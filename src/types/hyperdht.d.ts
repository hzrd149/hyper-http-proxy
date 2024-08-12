declare module "hyperdht" {
  import type { Socket } from "net";
  import type EventEmitter from "events";

  class NoiseStreamSocket extends Socket {
    remotePublicKey: Buffer;
  }

  export class Server extends EventEmitter<{
    listening: [];
    connection: [NoiseStreamSocket];
  }> {
    address(): { host: string; port: string; publicKey: Buffer } | null;

    listen(keyPair: KeyPair): Promise<void>;
  }

  type KeyPair = {
    publicKey: Buffer;
    secretKey: Buffer;
  };

  export default class HyperDHT {
    constructor(opts?: { keyPair: KeyPair; bootstrap?: string[] });

    createServer(
      opts?: {
        firewall?: (
          removePublicKey: Buffer,
          remoteHandshakePayload: any,
        ) => boolean;
      },
      onconnection?: (socket: NoiseStreamSocket) => void,
    ): Server;
    destroy(opts?: { force: boolean }): Promise<void>;

    connect(host: Buffer): Socket;

    static keyPair(seed?: Buffer): KeyPair;
  }
}
