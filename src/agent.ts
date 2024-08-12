import http from "http";
import HyperDHT from "hyperdht";
import { Duplex } from "stream";
import * as net from "net";
import * as tls from "tls";
import { decodeAddress, isAddress } from "./address.js";
import { Agent, AgentConnectOpts } from "agent-base";

import createDebug from "debug";

const debug = createDebug("HyperAgent");

export class HyperAgent extends Agent {
  node: HyperDHT;

  constructor(opts?: http.AgentOptions & { node?: HyperDHT }) {
    super(opts);
    this.node = opts?.node || new HyperDHT();
  }

  connect(
    req: http.ClientRequest,
    options: AgentConnectOpts,
  ): http.Agent | Duplex | Promise<http.Agent | Duplex> {
    if (isAddress(req.host)) {
      const pubkey = decodeAddress(req.host);
      debug("Connecting to", pubkey.toString("hex"));
      const socket = this.node.connect(pubkey);

      const wrapper = new Duplex({
        construct(callback) {
          socket.once("open", () => callback());
          socket.on("error", (err) => {
            //@ts-expect-error
            if (err.code === "ECONNRESET") this.destroy();
            else this.emit("error", err);
          });
          socket.on("data", (chunk) => this.push(chunk));
          socket.on("close", () => {
            if (!this.closed) this.destroy();
          });
        },
        read(size) {
          return socket.read(size);
        },
        write(chunk, encoding, callback) {
          return socket.write(chunk, encoding, callback);
        },
        destroy(error, callback) {
          if (!socket.closed) socket.destroy();
          callback();
        },
      });

      return wrapper;
    }

    if (options.secureEndpoint) {
      return tls.connect(options);
    } else {
      return net.connect(options);
    }
  }

  destroy(): void {
    super.destroy();
    this.node.destroy();
  }
}
