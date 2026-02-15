import "../lib/polyfills";

import Toast from "react-native-toast-message";
import { generateMnemonic, validateMnemonic, mnemonicToSeed } from "bip39";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { HDKey } from "micro-ed25519-hdkey";

export const createWallet = async () => {
  try {
    const mnemonic = generateMnemonic();

    if (!validateMnemonic(mnemonic)) {
      throw new Error("Invalid Mnemonic");
    }

    const seed = await mnemonicToSeed(mnemonic);

    const path = "m/44'/501'/0'/0'";

    const hd = HDKey.fromMasterSeed(seed);

    const derivedSeed = hd.derive(path);

    if (!derivedSeed.privateKey) {
      throw new Error("Failed to derive private key");
    }

    const keyPair = Keypair.fromSeed(derivedSeed.privateKey);

    return {
      mnemonic: mnemonic,
      path: path,
      publicKey: keyPair.publicKey.toBase58(),
      privateKey: bs58.encode(keyPair.secretKey),
    };
  } catch (err: any) {
    Toast.show({
      type: "error",
      text1: `Error creating wallet: ${err.message}`,
    });
    console.error(`Error creating wallet: ${err.message}`);
  }
};
