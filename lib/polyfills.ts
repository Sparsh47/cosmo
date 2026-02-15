import "react-native-get-random-values";
import { Buffer } from "buffer";

global.Buffer = Buffer;

// react-native-get-random-values sets up global.crypto.getRandomValues,
// but @noble/hashes checks globalThis.crypto at module evaluation time.
// Bridge the two to ensure compatibility.
if (typeof globalThis.crypto === "undefined" && typeof global.crypto !== "undefined") {
  globalThis.crypto = global.crypto;
} else if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {} as any;
}

if (typeof globalThis.crypto.getRandomValues === "undefined" && typeof global.crypto?.getRandomValues !== "undefined") {
  globalThis.crypto.getRandomValues = global.crypto.getRandomValues;
}

