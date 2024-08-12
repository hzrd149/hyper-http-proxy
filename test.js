import { request } from "http";
import HyperDHT from "hyperdht";

const node = new HyperDHT();

const s = node.connect(
  Buffer.from(
    "60a06191772dd936e634ede7f26dcc4fc51484394efd74de79e96f53ab49ede3",
    "hex",
  ),
);

s.write(
  [
    "GET / HTTP/1.1",
    "Host: 60a06191772dd936e634ede7f26dcc4fc51484394efd74de79e96f53ab49ede3.hyper",
    "User-Agent: curl/7.81.0",
    "Accept: */*",
    "Proxy-Connection: Keep-Alive",
    "",
    "",
  ].join("\r\n"),
);

s.on("data", (d) => {
  console.log("data", d.toString("utf-8"));
});

// const req = request({
//   protocol: "http:",
//   host: "60a06191772dd936e634ede7f26dcc4fc51484394efd74de79e96f53ab49ede3.hyper",
//   port: 80,
//   method: "GET",
//   createConnection: (options) => {
//     const s = node.connect(
//       Buffer.from(options.host.replace(".hyper", ""), "hex"),
//     );
//     s.cork = () => {};
//     s.uncork = () => {};
//     return s;
//   },
// });

// req.on("socket", (socket) => {
//   socket.on("data", (d) => {
//     console.log("Data", d.toString("utf-8"));
//   });
// });

// req.end();
