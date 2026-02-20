import { THEME } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBalance, getPrices, getUSDCBalance } from "@/lib/solana";

const INITIAL_ASSETS_DATA = [
    {
        id: "1",
        name: "Solana",
        symbol: "SOL",
        balance: "0.00",
        fiatValue: "$0.00",
        isPositive: true,
        icon: "currency-usd",
        iconBg: THEME.accentMint,
        iconColor: THEME.bg,
    },
    {
        id: "2",
        name: "USD Coin",
        symbol: "USDC",
        balance: "0.00",
        fiatValue: "$0.00",
        isPositive: true,
        icon: "currency-usd",
        iconBg: "#152422",
        iconColor: THEME.accentMint,
    },
];

export default function AssetsScreen() {
    const [wallet, setWallet] = useState<{ publicKey?: string; address?: string;[key: string]: any } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Balances
    const [solBalance, setSolBalance] = useState<number>(0);
    const [usdcBalance, setUsdcBalance] = useState<number>(0);

    // Prices
    const [solPrice, setSolPrice] = useState<number>(0);
    const [usdcPrice, setUsdcPrice] = useState<number>(1);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1. Fetch Wallet
                const jsonValue = await AsyncStorage.getItem("wallet");
                let addressToUse = null;

                if (jsonValue !== null) {
                    const parsedWallet = JSON.parse(jsonValue);
                    setWallet(parsedWallet);
                    addressToUse = parsedWallet.publicKey || parsedWallet.address;
                }

                // 3. If we have a wallet, fetch balances
                let solBalPromise = Promise.resolve(0);
                let usdcBalPromise = Promise.resolve(0);

                if (addressToUse) {
                    solBalPromise = getBalance(addressToUse);
                    usdcBalPromise = getUSDCBalance(addressToUse);
                }

                // Wait for all network requests to finish
                const [priceData, fetchedSolBal, fetchedUsdcBal] = await Promise.all([
                    getPrices(),
                    solBalPromise,
                    usdcBalPromise
                ]);

                // Update Balances
                setSolBalance(fetchedSolBal);
                setUsdcBalance(fetchedUsdcBal);

                // Update Prices if API call was successful
                if (priceData) {
                    const solPrice = priceData.solana.usd;
                    const usdcPrice = priceData["usd-coin"].usd;

                    setSolPrice(solPrice);
                    setUsdcPrice(usdcPrice);
                }

            } catch (error) {
                console.error("Error retrieving data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // 4. Calculate total USD values dynamically based on fetched prices and balances
    const solFiatValue = solBalance * solPrice;
    const usdcFiatValue = usdcBalance * usdcPrice;
    const totalBalanceUSD = solFiatValue + usdcFiatValue;

    // 5. Inject the live balances and calculated fiat values into our data array
    const dynamicAssetsData = INITIAL_ASSETS_DATA.map(asset => {
        if (asset.symbol === "SOL") {
            return {
                ...asset,
                balance: solBalance.toFixed(4), // Show up to 4 decimals for SOL
                fiatValue: `$${solFiatValue.toFixed(2)}`,
            };
        }
        if (asset.symbol === "USDC") {
            return {
                ...asset,
                balance: usdcBalance.toFixed(2),
                fiatValue: `$${usdcFiatValue.toFixed(2)}`,
            };
        }
        return asset;
    });

    const displayAddress = wallet?.publicKey || wallet?.address;

    const renderAssetItem = ({ item }: { item: typeof INITIAL_ASSETS_DATA[0] }) => (
        <TouchableOpacity style={styles.assetCard}>
            <View style={styles.assetLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
                </View>
                <View>
                    <Text style={styles.assetName}>{item.name}</Text>
                    <Text style={styles.assetSymbol}>{item.symbol}</Text>
                </View>
            </View>

            <View style={styles.assetRight}>
                <Text style={styles.assetFiat}>{item.fiatValue}</Text>
                <View style={styles.balanceRow}>
                    <Text style={styles.assetBalance}>{item.balance} {item.symbol}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={["#0F3832", "#0A2622", "#061A18"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerInner}>
                        <View style={styles.topNav}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                                <Ionicons name="arrow-back" size={24} color={THEME.textWhite} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>My Assets</Text>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="search" size={20} color={THEME.textWhite} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.balanceContainer}>
                            <Text style={styles.totalLabel}>Total Balance</Text>

                            {isLoading ? (
                                <ActivityIndicator size="large" color={THEME.accentMint} style={{ marginVertical: 10 }} />
                            ) : (
                                <>
                                    {/* Dynamically render the calculated total balance */}
                                    <Text style={styles.totalAmount}>
                                        ${totalBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>

                                    {displayAddress && (
                                        <View style={styles.walletAddressBadge}>
                                            <Ionicons name="wallet-outline" size={14} color={THEME.textGray} />
                                            <Text style={styles.walletAddressText}>
                                                {displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Hardcoded 24h profit for now. Need historic data to calculate this dynamically */}
                                    <View style={styles.profitBadge}>
                                        <Ionicons name="trending-up" size={14} color={THEME.bg} />
                                        <Text style={styles.profitText}>+$25.26 (24h)</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Your Coins</Text>
                <FlatList
                    data={dynamicAssetsData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderAssetItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: THEME.bg,
    },
    headerGradient: {
        width: "100%",
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingBottom: 40,
        borderBottomWidth: THEME.border.width,
        borderColor: THEME.border.color,
    },
    headerInner: {
        paddingHorizontal: 20,
    },
    topNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    iconButton: {
        width: THEME.box.dimension,
        height: THEME.box.dimension,
        borderRadius: THEME.box.radius,
        backgroundColor: THEME.bg,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: THEME.textWhite,
        fontSize: 18,
        fontWeight: "600",
        fontFamily: "SpaceMono",
    },
    balanceContainer: {
        alignItems: "center",
    },
    totalLabel: {
        color: THEME.textGray,
        fontSize: 14,
        marginBottom: 8,
    },
    totalAmount: {
        color: THEME.textWhite,
        fontSize: 44,
        fontWeight: "700",
        fontFamily: "SpaceMono",
        marginBottom: 8,
    },
    walletAddressBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
        gap: 6,
    },
    walletAddressText: {
        color: THEME.textGray,
        fontSize: 12,
        fontFamily: "SpaceMono",
    },
    profitBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: THEME.accentMint,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    profitText: {
        color: THEME.bg,
        fontSize: 12,
        fontWeight: "600",
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    sectionTitle: {
        color: THEME.textWhite,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        fontFamily: "SpaceMono",
    },
    listContent: {
        paddingBottom: 20,
    },
    assetCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: THEME.cardBg,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: THEME.border.width,
        borderColor: THEME.border.color,
    },
    assetLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    assetName: {
        color: THEME.textWhite,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    assetSymbol: {
        color: THEME.textGray,
        fontSize: 13,
    },
    assetRight: {
        alignItems: "flex-end",
    },
    assetFiat: {
        color: THEME.textWhite,
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "SpaceMono",
        marginBottom: 4,
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    assetBalance: {
        color: THEME.textGray,
        fontSize: 13,
    },
    assetChange: {
        fontSize: 12,
        fontWeight: "500",
    },
});