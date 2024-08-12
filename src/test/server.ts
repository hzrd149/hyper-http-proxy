import HyperDHT from "hyperdht";
import express from "express";
import { encodeAddress } from "../address.js";
import morgan from "morgan";
import net from "net";

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).end("Hello World");
});

app.listen(8080);

const node = new HyperDHT();

const hyperServer = node.createServer();

hyperServer.on("connection", (socket) => {
  const netSocket = net.connect(8080);

  socket.on("data", (chunk) => {
    netSocket.write(chunk);
  });
  netSocket.on("data", (chunk) => {
    socket.write(chunk);
  });
  netSocket.on("close", () => {
    if (!socket.closed) socket.destroy();
  });
  socket.on("close", () => {
    !netSocket.closed && netSocket.destroy();
  });
});

const keyPair = HyperDHT.keyPair();
await hyperServer.listen(keyPair);

const key = hyperServer.address()?.publicKey;
if (key) {
  console.log(key.toString("hex"));
  console.log("http://" + encodeAddress(key));
}
