import { THEME } from "@/constants/theme";
import { TOKENS } from "@/constants/tokens";
import { getBalance } from "@/lib/solana";
import { getSwapQuote, swapTokens } from "@/lib/splToken";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function SwapScreen() {
    const [sellAmount, setSellAmount] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [solBalance, setSolBalance] = useState<number>(0);
    const [usdcBalance, setUsdcBalance] = useState<number>(0);

    const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
    const [isSwapping, setIsSwapping] = useState<boolean>(false);
    const [keypair, setKeypair] = useState<Keypair | null>(null);

    useEffect(() => {
        const setupWallet = async () => {
            try {
                const walletStr = await AsyncStorage.getItem("wallet");
                if (!walletStr) {
                    console.log("No wallet found in storage");
                    return;
                }

                const parsed = JSON.parse(walletStr);
                console.log("Parsed Wallet Data:", parsed);

                if (parsed.publicKey) {
                    const balance = await getBalance(parsed.publicKey);
                    setSolBalance(balance);
                }

                if (!parsed.privateKey) {
                    console.error("Secret key is missing from storage!");
                    return;
                }
                let secretKeyUint8Array;

                if (Array.isArray(parsed.privateKey)) {
                    secretKeyUint8Array = new Uint8Array(parsed.privateKey);
                } else if (typeof parsed.privateKey === 'object') {
                    secretKeyUint8Array = new Uint8Array(Object.values(parsed.privateKey) as number[]);
                } else if (typeof parsed.privateKey === 'string') {
                    console.error("Secret key is a string. You might need to decode it with bs58.");
                    return;
                }

                if (secretKeyUint8Array) {
                    const loadedKeypair = Keypair.fromSecretKey(secretKeyUint8Array);
                    setKeypair(loadedKeypair);
                }

            } catch (error) {
                console.error("Failed to load wallet data", error);
            }
        };

        setupWallet();
    }, []);

    const fetchQuote = async (amount: string) => {
        if (!amount || isNaN(Number(amount))) {
            setBuyAmount("");
            return;
        }

        setLoadingQuote(true);
        const lamports = parseFloat(amount) * 1e9;

        try {
            const quote = await getSwapQuote({
                inputMint: TOKENS.SOL,
                outputMint: TOKENS.USDC,
                amount: lamports,
            });

            if (quote && quote.outAmount) {
                const outAmount = quote.outAmount / 1e6; // USDC has 6 decimals
                setBuyAmount(outAmount.toFixed(4));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingQuote(false);
        }
    };

    // Handle the actual Swap
    const handleSwap = async () => {
        if (!keypair || !sellAmount || isNaN(Number(sellAmount))) {
            Toast.show({ type: "error", text1: "Please enter a valid amount" });
            return;
        }

        setIsSwapping(true);

        const signTransaction = async (tx: VersionedTransaction) => {
            tx.sign([keypair]);
            return tx;
        };

        const walletObj = {
            publicKey: keypair.publicKey,
            signTransaction: signTransaction,
        };

        try {
            const txid = await swapTokens({
                wallet: walletObj,
                inputMint: TOKENS.SOL,
                outputMint: TOKENS.USDC,
                amount: parseFloat(sellAmount) * 1e9,
            });

            if (txid) {
                Toast.show({ type: "success", text1: "Swap successful!" });
                setSellAmount("");
                setBuyAmount("");
                // Refresh balance after swap
                const newBalance = await getBalance(keypair.publicKey.toBase58());
                setSolBalance(newBalance);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSwapping(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={THEME.textWhite} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Swap currency</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="help" size={20} color={THEME.bg} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Swap Cards Container */}
                    <View style={styles.swapContainer}>
                        {/* Top Card - Sell */}
                        <View style={[styles.card, styles.topCard]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Sell</Text>
                                <TouchableOpacity style={styles.tokenSelector}>
                                    <MaterialCommunityIcons name="alphabet-aurebesh" size={18} color={THEME.textWhite} />
                                    <Text style={styles.tokenText}>SOL</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.amountInput}
                                    value={sellAmount}
                                    onChangeText={(value) => {
                                        setSellAmount(value);
                                        fetchQuote(value);
                                    }}
                                    keyboardType="decimal-pad"
                                    placeholder="0.00"
                                    placeholderTextColor={THEME.textGray}
                                />
                            </View>

                            <View style={styles.balanceRow}>
                                <Text style={styles.balanceText}>Balance: {solBalance.toFixed(4)} SOL</Text>
                                <TouchableOpacity
                                    style={styles.maxButton}
                                    onPress={() => {
                                        const maxAmount = Math.max(0, solBalance - 0.005).toString();
                                        setSellAmount(maxAmount);
                                        fetchQuote(maxAmount);
                                    }}
                                >
                                    <Text style={styles.maxText}>Max</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Overlapping Swap Icon */}
                        <View style={styles.swapIconWrapper}>
                            <TouchableOpacity style={styles.swapIconButton}>
                                <Ionicons name="swap-vertical" size={22} color={THEME.textWhite} />
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Card - Buy */}
                        <View style={[styles.card, styles.bottomCard]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Buy</Text>
                                <TouchableOpacity style={styles.tokenSelector}>
                                    <MaterialCommunityIcons name="currency-usd" size={18} color={THEME.textWhite} />
                                    <Text style={styles.tokenText}>USDC</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                {loadingQuote ? (
                                    <ActivityIndicator color={THEME.accentMint} />
                                ) : (
                                    <TextInput
                                        style={styles.amountInput}
                                        value={buyAmount}
                                        editable={false}
                                        placeholder="0.00"
                                        placeholderTextColor={THEME.textGray}
                                    />
                                )}
                            </View>

                            <View style={styles.balanceRow}>
                                <Text style={styles.balanceText}>Balance: {usdcBalance.toFixed(2)} USDC</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>

                {/* Bottom Action Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSwap}
                        disabled={isSwapping || !sellAmount || loadingQuote}
                    >
                        <LinearGradient
                            colors={["#0F3832", "#0A2622", "#061A18"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.swapButton, (isSwapping || loadingQuote) && { opacity: 0.7 }]}
                        >
                            {isSwapping ? (
                                <ActivityIndicator color={THEME.textWhite} />
                            ) : (
                                <>
                                    <View style={styles.chevrons}>
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} style={{ opacity: 0.3 }} />
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} style={{ opacity: 0.6, marginLeft: -8 }} />
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} style={{ marginLeft: -8 }} />
                                    </View>

                                    <Text style={styles.swapButtonText}>Swap</Text>

                                    <View style={styles.chevrons}>
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} />
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} style={{ opacity: 0.6, marginLeft: -8 }} />
                                        <Ionicons name="chevron-forward" size={18} color={THEME.textWhite} style={{ opacity: 0.3, marginLeft: -8 }} />
                                    </View>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1A2524",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: THEME.textWhite,
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    swapContainer: {
        position: "relative",
        alignItems: "center",
    },
    card: {
        width: "100%",
        backgroundColor: THEME.cardBg,
        borderRadius: 30,
        padding: 24,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
    },
    topCard: {
        marginBottom: 8,
    },
    bottomCard: {
        marginTop: 8,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    cardLabel: {
        color: THEME.textGray,
        fontSize: 14,
        fontWeight: "500",
    },
    tokenSelector: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#152422",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    tokenText: {
        color: THEME.textWhite,
        fontSize: 16,
        fontWeight: "600",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 20,
    },
    amountInput: {
        color: THEME.textWhite,
        fontSize: 40,
        fontWeight: "700",
        flex: 1,
    },
    balanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balanceText: {
        color: THEME.textGray,
        fontSize: 13,
    },
    maxButton: {
        backgroundColor: "#1A2E2C",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    maxText: {
        color: THEME.textWhite,
        fontSize: 12,
        fontWeight: "600",
    },
    swapIconWrapper: {
        position: "absolute",
        top: "50%",
        marginTop: -24,
        zIndex: 10,
        backgroundColor: THEME.bg,
        padding: 6,
        borderRadius: 30,
    },
    swapIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1A2524",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
    },
    footer: {
        paddingVertical: 20,
    },
    swapButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        borderRadius: 30,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
        gap: 20,
    },
    swapButtonText: {
        color: THEME.textWhite,
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },
    chevrons: {
        flexDirection: "row",
        alignItems: "center",
    },
});