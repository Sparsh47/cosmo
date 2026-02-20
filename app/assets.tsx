import { THEME } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ASSETS_DATA = [
    {
        id: "1",
        name: "Solana",
        symbol: "SOL",
        balance: "3.20",
        fiatValue: "$506.94",
        change: "+5.24%",
        isPositive: true,
        icon: "currency-usd",
        iconBg: THEME.accentMint,
        iconColor: THEME.bg,
    },
    {
        id: "2",
        name: "Ethereum",
        symbol: "ETH",
        balance: "2.514",
        fiatValue: "$6,429.89",
        change: "-1.12%",
        isPositive: false,
        icon: "ethereum",
        iconBg: "#152422",
        iconColor: THEME.textWhite,
    },
    {
        id: "3",
        name: "Toncoin",
        symbol: "TON",
        balance: "417.03",
        fiatValue: "$2,919.21",
        change: "+2.80%",
        isPositive: true,
        icon: "diamond-outline",
        iconBg: THEME.accentCyan,
        iconColor: THEME.bg,
    },
    {
        id: "4",
        name: "Tether",
        symbol: "USDT",
        balance: "150.00",
        fiatValue: "$150.00",
        change: "+0.01%",
        isPositive: true,
        icon: "currency-usd",
        iconBg: "#152422",
        iconColor: THEME.accentMint,
    },
];

export default function AssetsScreen() {
    const renderAssetItem = ({ item }: { item: typeof ASSETS_DATA[0] }) => (
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
                    <Text style={[
                        styles.assetChange,
                        { color: item.isPositive ? THEME.accentMint : THEME.dangerRed }
                    ]}>
                        {item.change}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Full Width Top Gradient */}
            <LinearGradient
                colors={["#0F3832", "#0A2622", "#061A18"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerInner}>
                        {/* Top Navigation */}
                        <View style={styles.topNav}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                                <Ionicons name="arrow-back" size={24} color={THEME.textWhite} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>My Assets</Text>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="search" size={20} color={THEME.textWhite} />
                            </TouchableOpacity>
                        </View>

                        {/* Total Balance Info */}
                        <View style={styles.balanceContainer}>
                            <Text style={styles.totalLabel}>Total Balance</Text>
                            <Text style={styles.totalAmount}>$10,006.04</Text>
                            <View style={styles.profitBadge}>
                                <Ionicons name="trending-up" size={14} color={THEME.bg} />
                                <Text style={styles.profitText}>+$142.50 (24h)</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Assets List */}
            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Your Coins</Text>
                <FlatList
                    data={ASSETS_DATA}
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
        marginBottom: 16,
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