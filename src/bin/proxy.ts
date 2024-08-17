#!/usr/bin/env node
import { Command } from "commander";
import createDebug from "debug";
import { spawn } from "child_process";
import { once } from "events";
// @ts-expect-error no types for "basic-auth-parser"
import basicAuthParser from "basic-auth-parser";

import { createProxy } from "../proxy.js";
import { decodeAddress, encodeAddress } from "../address.js";

const debug = createDebug("proxy");

process.title = "proxy";

const program = new Command();

program
  .command("decode")
  .description("decode a bech32 hyper address to hex")
  .argument("<address>", "The hypr1 bech32 encoded address")
  .action((address: string) => {
    process.stdout.write(decodeAddress(address) + "\n");
  });
program
  .command("encode")
  .description("encode a hex hyperdht key to a bech32 address")
  .argument("<key>", "A hex string")
  .action((key: string) => {
    process.stdout.write(encodeAddress(Buffer.from(key, "hex")) + "\n");
  });

program
  .command("start")
  .description("Starts the HTTP proxy")
  .option(
    "-p, --port <port>",
    "Port number to the proxy server should bind to",
    (v) => parseInt(v),
    3128,
  )
  .option(
    "--authenticate",
    '"authenticate" command to run when the "Proxy-Authorization" header is sent',
    String,
    "",
  )
  .action((options) => {
    const proxy = createProxy();

    if (options.authenticate) {
      debug(
        'setting `authenticate()` function for: "%s"',
        options.authenticate,
      );
      proxy.authenticate = async (req) => {
        debug('authenticate(): "%s"', options.authenticate);

        // parse the "Proxy-Authorization" header
        const auth = req.headers["proxy-authorization"];
        if (!auth) {
          // optimization: don't invoke the child process if no
          // "Proxy-Authorization" header was given
          return false;
        }
        const parsed = basicAuthParser(auth);
        debug('parsed "Proxy-Authorization": %j', parsed);

        // spawn a child process with the user-specified "authenticate" command
        const env = { ...process.env };
        // add "auth" related ENV variables
        for (const [key, value] of Object.entries(parsed)) {
          env["PROXY_AUTH_" + key.toUpperCase()] = value as string;
        }

        // TODO: add Windows support (use `cross-spawn`?)
        const child = spawn("/bin/sh", ["-c", options.authenticate], {
          env,
          stdio: ["ignore", "inherit", "inherit"],
        });

        const [code, signal]: number[] = await once(child, "exit");
        debug('authentication child process "exit" event: %s %s', code, signal);
        return code === 0;
      };
    }

    proxy.listen(options.port, () => {
      console.log(
        "HTTP(s) proxy server listening on port %d",
        // @ts-expect-error "port" is a number
        proxy.address().port,
      );
    });
  });

program.parse();
