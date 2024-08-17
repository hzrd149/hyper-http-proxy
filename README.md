# Hyper HTTP proxy

A simple HTTP Proxy for [HyperDHT](https://docs.pears.com/building-blocks/hyperdht) connections using [bech32 encoded pubkeys](./src/address.ts)

## Using the HyperAgent class

This package also exports the `HyperAgent` class that can be used in when making http calls in nodejs

```js
import { HyperAgent } from "hyper-http-proxy";

const hyperAgent = new HyperAgent();

const req = http.request(
  {
    hostname:
      "hypr1q60wjq6fsqhfgeq4y8ksadwrzryecvereuqc77m73pz682jd266q557gyw.hyper",
    port: 80,
    path: "/",
    method: "GET",
    agent: hyperAgent,
  },
  (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
  },
);

req.end();
```

## Running using npx

```bash
npx hyper-http-proxy start
```

## Running from source

```bash
git clone https://github.com/hzrd149/hyper-http-proxy
cd hyper-http-proxy
yarn install # or npm install
yarn build # npm build
node dist/bin/proxy.js start
```
