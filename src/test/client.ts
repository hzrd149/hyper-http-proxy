import http from "http";
import HyperDHT from "hyperdht";
import { encodeAddress } from "../address.js";
import { HyperAgent } from "../agent.js";

const keyPair = HyperDHT.keyPair(
  Buffer.from(
    "4d8701501af8e98c9af96c93d9e67ee644c6c93ea7c551230ec086b393f6ab19",
    "hex",
  ),
);

const node = new HyperDHT({ keyPair });

const address = encodeAddress(
  Buffer.from(
    "f6abd00e6c043c0ee64eac60419db4226bdaaed81196c4c71e8a5b7bff50a76b",
    "hex",
  ),
);

const s = node.connect(
  Buffer.from(
    "f6abd00e6c043c0ee64eac60419db4226bdaaed81196c4c71e8a5b7bff50a76b",
    "hex",
  ),
);
s.on("data", (c) => {
  console.log(c);
});
s.on("open", () => {
  console.log("open 1st");
});

const agent = new HyperAgent({ node });

const req = http.request({
  host: address,
  protocol: "http:",
  agent,
  lookup: undefined,
});

req.on("response", async (res) => {
  console.log(res.headers);

  res.setEncoding("utf-8");
  res.on("data", (chunk) => {
    console.log(chunk);
  });
  res.on("end", () => {
    console.log("---done---");
  });
});

req.end();
