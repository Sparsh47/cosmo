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

const rpcUrl = __DEV__
  ? "https://api.devnet.solana.com"
  : "https://api.mainnet-beta.solana.com";

export const CONNECTION = new Connection(rpcUrl, "confirmed");

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
  try {
    const key = new PublicKey(publicKey);
    const balanceInLamports = await CONNECTION.getBalance(key);
    const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
    return balanceInSol;
  } catch (err: any) {
    console.error("Error fetching SOL balance:", err);
    return 0;
  }
};

export const getTransactions = async (address: string) => {
  try {
    const pubKey = new PublicKey(address);

    const signatures = await CONNECTION.getSignaturesForAddress(pubKey, {
      limit: 20,
    });

    return signatures;
  } catch (err: any) {
    console.error("Error fetching transactions:", err);
    return [];
  }
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
};

export const getUSDCBalance = async (publicKey: string) => {
  try {
    const owner = new PublicKey(publicKey);

    // Switch between Devnet Faucet USDC and Mainnet Official USDC
    const USDC_MINT = __DEV__
      ? new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU") // Devnet USDC
      : new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); // Mainnet USDC

    const response = await CONNECTION.getParsedTokenAccountsByOwner(owner, {
      mint: USDC_MINT,
    });

    if (response.value.length === 0) {
      return 0;
    }

    const balance = response.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance;
  } catch (error: any) {
    console.error("Error fetching USDC balance:", error);
    return 0;
  }
};

export const getPrices = async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd");
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching prices:", error);
    return {};
  }
};