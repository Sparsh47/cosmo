import { THEME } from "@/constants/theme";
import { getBalance } from "@/lib/solana";
import { globalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function Send() {
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [solBalance, setSolBalance] = useState<number>(0);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        (async () => {
            const wallet = await AsyncStorage.getItem("wallet");
            if (JSON.parse(wallet!).length === 0) return;
            const publicKey = JSON.parse(wallet!).publicKey;
            const balance = await getBalance(publicKey);
            setSolBalance(balance);
        })();
    }, []);

    const handleMax = () => {
        setAmount(solBalance.toString());
    };

    const handleSend = async () => {
        if (!recipientAddress || !amount) return;
        setSending(true);
        // TODO: Implement actual send transaction
        setTimeout(() => {
            setSending(false);
        }, 2000);
    };

    const isValid = recipientAddress.length > 0 && parseFloat(amount) > 0;

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* Full-width gradient header */}
                    <View style={styles.cardWrapper}>
                        <LinearGradient
                            colors={["#0F3832", "#0A2622", "#061A18"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientContainer}
                        >
                            <View style={styles.headerRow}>
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons
                                        name="arrow-back"
                                        size={24}
                                        color={THEME.textWhite}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Send SOL</Text>
                                <View style={styles.emptyBox} />
                            </View>
                            <View style={styles.balanceSection}>
                                <Text style={styles.balanceLabel}>Available Balance</Text>
                                <Text style={styles.balanceAmount}>
                                    {solBalance.toFixed(4)} SOL
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputSection}>
                        {/* Recipient Card */}
                        <View style={styles.inputCard}>
                            <View style={styles.inputCardHeader}>
                                <View style={styles.inputIconCircle}>
                                    <Ionicons
                                        name="wallet-outline"
                                        size={18}
                                        color={THEME.accentMint}
                                    />
                                </View>
                                <Text style={styles.inputCardLabel}>
                                    Recipient Address
                                </Text>
                                <TouchableOpacity style={styles.pasteBtn}>
                                    <Text style={styles.pasteBtnText}>Paste</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.inputCardTextInput}
                                placeholder="Enter Solana address"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                value={recipientAddress}
                                onChangeText={setRecipientAddress}
                                autoCapitalize="none"
                                autoCorrect={false}
                                multiline={false}
                            />
                            <View style={styles.inputCardDivider} />
                            <Text style={styles.inputCardHint}>
                                Solana mainnet or devnet address
                            </Text>
                        </View>

                        {/* Amount Card */}
                        <View style={styles.inputCard}>
                            <View style={styles.inputCardHeader}>
                                <View
                                    style={[
                                        styles.inputIconCircle,
                                        {
                                            backgroundColor:
                                                "rgba(0, 209, 255, 0.1)",
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name="diamond-outline"
                                        size={18}
                                        color={THEME.accentCyan}
                                    />
                                </View>
                                <Text style={styles.inputCardLabel}>
                                    Amount
                                </Text>
                                <TouchableOpacity
                                    style={styles.maxBtn}
                                    onPress={handleMax}
                                >
                                    <Text style={styles.maxBtnText}>MAX</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.amountRow}>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="0.00"
                                    placeholderTextColor="rgba(255,255,255,0.15)"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="decimal-pad"
                                />
                                <Text style={styles.amountSuffix}>SOL</Text>
                            </View>
                            <View style={styles.inputCardDivider} />
                            <Text style={styles.inputCardHint}>
                                Available: {solBalance.toFixed(4)} SOL
                            </Text>
                        </View>
                    </View>

                    {/* Summary */}
                    {isValid && (
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Amount</Text>
                                <Text style={styles.summaryValue}>
                                    {parseFloat(amount).toFixed(4)} SOL
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Network Fee</Text>
                                <Text style={styles.summaryValue}>~0.000005 SOL</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>To</Text>
                                <Text style={styles.summaryValue}>
                                    {recipientAddress.slice(0, 6)}...
                                    {recipientAddress.slice(-4)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Spacer */}
                    <View style={{ flex: 1 }} />

                    {/* Send Button */}
                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={!isValid || sending}
                            onPress={handleSend}
                            style={styles.sendBtnOuter}
                        >
                            <LinearGradient
                                colors={
                                    isValid
                                        ? [THEME.accentMint, THEME.accentCyan]
                                        : ["#1a2e2b", "#1a2e2b"]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.sendBtn}
                            >
                                {sending ? (
                                    <ActivityIndicator color={THEME.bg} />
                                ) : (
                                    <Text
                                        style={[
                                            styles.sendBtnText,
                                            !isValid && { color: THEME.textGray },
                                        ]}
                                    >
                                        Send SOL
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 15,
    },
    gradientContainer: {
        borderRadius: 50,
        padding: 20,
        paddingTop: 50,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
        overflow: "hidden",
        gap: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: THEME.bg,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyBox: {
        width: 40,
        height: 40,
    },
    headerTitle: {
        color: THEME.textWhite,
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },
    balanceSection: {
        alignItems: "center",
        gap: 6,
        paddingBottom: 4,
    },
    balanceLabel: {
        color: THEME.textGray,
        fontSize: 13,
        fontFamily: "SpaceMono",
    },
    balanceAmount: {
        color: THEME.textWhite,
        fontSize: 32,
        fontWeight: "600",
    },

    // Input section
    inputSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    inputCard: {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 20,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
        padding: 14,
        gap: 10,
    },
    inputCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    inputIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(0, 255, 163, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    inputCardLabel: {
        flex: 1,
        color: THEME.textGray,
        fontSize: 13,
        fontFamily: "SpaceMono",
        fontWeight: "500",
    },
    inputCardTextInput: {
        color: THEME.textWhite,
        fontSize: 16,
        fontFamily: "SpaceMono",
        paddingVertical: 8,
    },
    inputCardDivider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    inputCardHint: {
        color: "rgba(255, 255, 255, 0.25)",
        fontSize: 11,
        fontFamily: "SpaceMono",
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },
    amountInput: {
        flex: 1,
        color: THEME.textWhite,
        fontSize: 28,
        fontWeight: "600",
        paddingVertical: 4,
    },
    amountSuffix: {
        color: THEME.textGray,
        fontSize: 16,
        fontFamily: "SpaceMono",
        fontWeight: "600",
    },
    pasteBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: "rgba(0, 255, 163, 0.12)",
    },
    pasteBtnText: {
        color: THEME.accentMint,
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },
    maxBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: "rgba(0, 209, 255, 0.12)",
    },
    maxBtnText: {
        color: THEME.accentCyan,
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },

    // Summary
    summaryCard: {
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        padding: 20,
        gap: 14,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        color: THEME.textGray,
        fontSize: 13,
        fontFamily: "SpaceMono",
    },
    summaryValue: {
        color: THEME.textWhite,
        fontSize: 13,
        fontFamily: "SpaceMono",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.06)",
    },

    // Send button
    btnContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    sendBtnOuter: {
        borderRadius: 30,
        shadowColor: THEME.accentMint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    sendBtn: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    sendBtnText: {
        color: THEME.bg,
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 1,
    },
});
