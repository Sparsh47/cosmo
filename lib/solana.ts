import "../lib/polyfills";

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from "bip39";
import bs58 from "bs58";
import { HDKey } from "micro-ed25519-hdkey";
import Toast from "react-native-toast-message";

const CONNECTION = new Connection("https://api.devnet.solana.com", "confirmed");

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

export const getBalance = async (publicKey: string) => {
  const key = new PublicKey(publicKey);
  const balanceInLamports = await CONNECTION.getBalance(key);
  const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
  return balanceInSol;
};

export const getTransactions = async (address: string) => {
  const pubKey = new PublicKey(address);

  const signatures = await CONNECTION.getSignaturesForAddress(pubKey, {
    limit: 20,
  });

  return signatures;
};

export const sendSOL = async (senderPvtKey: string, receiverAddress: string, amount: number) => {
  try {
    const senderKeyPair = Keypair.fromSecretKey(bs58.decode(senderPvtKey))

    const receiverPubKey = new PublicKey(receiverAddress)

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: senderKeyPair.publicKey,
      toPubkey: receiverPubKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })

    const transaction = new Transaction().add(transferInstruction)

    const signature = await sendAndConfirmTransaction(CONNECTION, transaction, [
      senderKeyPair
    ])

    return signature

  } catch (e) {
    console.error("Error sending SOL:", e);
    Toast.show({
      type: "error",
      text1: "Error sending SOL",
    });
  }
}