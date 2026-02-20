import { VersionedTransaction } from "@solana/web3.js";
import Toast from "react-native-toast-message";
import { CONNECTION } from "./solana";

export const getSwapQuote = async ({ inputMint, outputMint, amount }: { inputMint: string, outputMint: string, amount: number }) => {
    try {
        const res = await fetch(
            `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&cluster=devnet`
        );

        return res.json();
    } catch (error: any) {
        console.error("Error getting swap quote:", error);
        Toast.show({
            type: "error",
            text1: "Error getting swap quote",
        });
    }
}

export const buildSwapTx = async (quoteResponse: any, publicKey: string) => {
    try {
        const res = await fetch("https://quote-api.jup.ag/v6/swap?cluster=devnet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: publicKey,
                wrapAndUnwrapSol: true,
            })
        });

        const data = await res.json();

        return data.swapTransaction;
    } catch (error: any) {
        console.error("Error building swap transaction:", error);
        Toast.show({
            type: "error",
            text1: "Error building swap transaction",
        });
    }
}

export const executeSwap = async (swapTxBase64: string, signTransaction: any) => {
    try {
        const txBuf = Buffer.from(swapTxBase64, "base64");
        const tx = VersionedTransaction.deserialize(txBuf);

        const signedTx = await signTransaction(tx);

        const txid = await CONNECTION.sendRawTransaction(signedTx.serialize())


        await CONNECTION.confirmTransaction(txid);

        return txid;
    } catch (error: any) {
        console.error("Error executing swap:", error);
        Toast.show({
            type: "error",
            text1: "Error executing swap",
        });
    }
}

export const swapTokens = async ({ wallet, inputMint, outputMint, amount }: { wallet: any, inputMint: string, outputMint: string, amount: number }) => {
    try {
        const quote = await getSwapQuote({
            inputMint,
            outputMint,
            amount,
        })

        if (!quote) {
            throw new Error("Failed to get swap quote");
        }

        const swapTx = await buildSwapTx(
            quote,
            wallet.publicKey.toString()
        );

        const txid = await executeSwap(
            swapTx,
            wallet.signTransaction
        )

        return txid;

    } catch (error: any) {
        console.error("Error swapping tokens:", error);
        Toast.show({
            type: "error",
            text1: "Error swapping tokens",
        });
    }
}