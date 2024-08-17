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

## Running using docker

```bash
docker run --rm -it -p 1080:1080 ghcr.io/hzrd149/hyper-http-proxy:master
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

## Using the proxy in FireFox

To configure FireFox to use the local proxy, follow these steps

- Open [connection settings](https://support.mozilla.org/en-US/kb/connection-settings-firefox) in firefox
- Search for "proxy" or scroll to the bottom and find "Network Settings"
- Select "Manual proxy configuration"
- Select "HTTP"
- Enter `127.0.0.1` in "HTTP Proxy" and `3128` in "Port"
- Make sure the "Proxy DNS when using SOCKS v5" option is checked

Once your done it should look like this
![image](https://github.com/user-attachments/assets/45b5993b-e17b-4b28-a83f-9203ba4d7ae6)
