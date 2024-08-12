declare module "streamx" {
  import { Duplex, Stream } from "stream";

  export function pipeline(...streams: Stream[]): Duplex;
}
