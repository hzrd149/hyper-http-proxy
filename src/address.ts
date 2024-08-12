import { bech32 } from "@scure/base";

function stripRoot(address: string) {
  return address.replace(/\.hyper$/, "");
}

export function isAddress(address: string) {
  return /^hypr1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58,}$/gi.test(
    stripRoot(address),
  );
}

export const Bech32MaxSize = 5000;
export function decodePubkey(encoded: string) {
  let { prefix, words } = bech32.decode(encoded, Bech32MaxSize);
  if (prefix !== "hypr") throw new Error("Invalid prefix");
  let data = new Uint8Array(bech32.fromWords(words));
  return Buffer.from(data);
}
export function decodeAddress(address: string) {
  return decodePubkey(stripRoot(address));
}
export function encodePubkey(pubkey: Buffer) {
  let words = bech32.toWords(new Uint8Array(pubkey));
  return bech32.encode("hypr", words, Bech32MaxSize);
}
export function encodeAddress(pubkey: Buffer) {
  return encodePubkey(pubkey) + ".hyper";
}
