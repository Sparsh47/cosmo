import { THEME } from "@/constants/theme";
import { getBalance } from "@/lib/solana";
import { copyToClipboard } from "@/lib/utils";
import { globalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const QR_SIZE = SCREEN_WIDTH * 0.52;

export default function Receive() {
    const [walletAddress, setWalletAddress] = useState("");
    const [solBalance, setSolBalance] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        (async () => {
            const wallet = await AsyncStorage.getItem("wallet");
            if (!wallet || JSON.parse(wallet).length === 0) return;
            const publicKey = JSON.parse(wallet).publicKey;
            setWalletAddress(publicKey);
            const balance = await getBalance(publicKey);
            setSolBalance(balance);
        })();
    }, []);

    const shortAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`
        : "Loading...";

    const handleCopy = () => {
        copyToClipboard(walletAddress)
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Large gradient card */}
                <View style={styles.cardWrapper}>
                    <LinearGradient
                        colors={["#0F3832", "#0A2622", "#061A18"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientContainer}
                    >
                        {/* Header row */}
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
                            <Text style={styles.headerTitle}>Receive SOL</Text>
                            <View style={styles.emptyBox} />
                        </View>

                        {/* QR code */}
                        <View style={styles.qrWrapper}>
                            <View style={styles.qrCard}>
                                {walletAddress ? (
                                    <QRCode
                                        value={walletAddress}
                                        size={QR_SIZE}
                                        color={THEME.textWhite}
                                        backgroundColor="transparent"
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: QR_SIZE,
                                            height: QR_SIZE,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Text style={{ color: THEME.textGray, fontFamily: "SpaceMono", fontSize: 12 }}>
                                            Loading...
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Balance & badge */}
                        <View style={styles.infoSection}>
                            <View style={styles.networkBadge}>
                                <View style={styles.networkDot} />
                                <Text style={styles.networkText}>Solana Devnet</Text>
                            </View>
                            <Text style={styles.balanceText}>
                                {solBalance.toFixed(4)} SOL
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Address section */}
                <View style={styles.addressSection}>
                    <Text style={styles.addressLabel}>Your Wallet Address</Text>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                            {walletAddress || "Loading..."}
                        </Text>
                        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                            <Ionicons
                                name={copied ? "checkmark" : "copy-outline"}
                                size={18}
                                color={copied ? THEME.accentMint : THEME.textGray}
                            />
                        </TouchableOpacity>
                    </View>
                    {copied && (
                        <Text style={styles.copiedText}>Address copied!</Text>
                    )}
                    <Text style={styles.disclaimer}>
                        Only send SOL and Solana-based tokens to this address.
                    </Text>
                </View>
            </ScrollView>
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
        minHeight: "67%",
        borderRadius: 50,
        padding: 20,
        paddingTop: 56,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
        overflow: "hidden",
        gap: 20,
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

    // QR
    qrWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
    },
    qrCard: {
        backgroundColor: "rgba(0, 255, 163, 0.08)",
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 255, 163, 0.15)",
        alignItems: "center",
        justifyContent: "center",
    },

    // Info
    infoSection: {
        alignItems: "center",
        gap: 6,
    },
    networkBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.06)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    networkDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: THEME.accentMint,
    },
    networkText: {
        color: THEME.textGray,
        fontSize: 12,
        fontFamily: "SpaceMono",
    },
    balanceText: {
        color: THEME.textWhite,
        fontSize: 22,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },

    // Address
    addressSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
        gap: 12,
    },
    addressLabel: {
        color: THEME.textGray,
        fontSize: 13,
        fontFamily: "SpaceMono",
        marginLeft: 4,
    },
    addressCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    addressText: {
        flex: 1,
        color: THEME.textWhite,
        fontSize: 13,
        fontFamily: "SpaceMono",
    },
    copyBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.06)",
        alignItems: "center",
        justifyContent: "center",
    },
    copiedText: {
        color: THEME.accentMint,
        fontSize: 12,
        fontFamily: "SpaceMono",
        marginLeft: 4,
    },
    disclaimer: {
        color: "rgba(255,255,255,0.2)",
        fontSize: 11,
        fontFamily: "SpaceMono",
        textAlign: "center",
        lineHeight: 18,
        marginTop: 4,
    },
});
