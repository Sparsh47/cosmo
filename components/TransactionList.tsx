import { THEME } from "@/constants/theme";
import { getTransactions } from "@/lib/solana";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Transaction = {
  signature: string;
  slot: number;
  blockTime: number | null | undefined;
  memo: string | null;
  err: any;
};

function formatDate(blockTime: number | null | undefined): string {
  if (!blockTime) return "Unknown";
  const date = new Date(blockTime * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function truncateSignature(sig: string): string {
  return `${sig.slice(0, 4)}...${sig.slice(-4)}`;
}

function TransactionRow({ item }: { item: Transaction }) {
  const isError = item.err !== null;
  const icon = isError
    ? {
      name: "close-circle" as const,
      color: THEME.warningYellow,
      bg: "rgba(243, 207, 10, 0.1)",
    }
    : {
      name: "checkmark-circle" as const,
      color: THEME.accentMint,
      bg: "rgba(0, 255, 163, 0.1)",
    };

  return (
    <View style={styles.row}>
      <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.rowCenter}>
        <Text style={styles.txLabel}>
          {isError ? "Failed" : "Confirmed"}
        </Text>
        <Text style={styles.txAddress}>
          {truncateSignature(item.signature)}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text
          style={[
            styles.txStatus,
            { color: isError ? THEME.warningYellow : THEME.accentMint },
          ]}
        >
          Slot {item.slot.toLocaleString()}
        </Text>
        <Text style={styles.txDate}>{formatDate(item.blockTime)}</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name="receipt-outline" size={48} color={THEME.textGray} />
      </View>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your transaction history will appear here once you start using your
        wallet.
      </Text>
    </View>
  );
}

export default function TransactionList({ address }: { address: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const sigs = await getTransactions(address);
        const mapped: Transaction[] = sigs.map((sig) => ({
          signature: sig.signature,
          slot: sig.slot,
          blockTime: sig.blockTime,
          memo: sig.memo ?? null,
          err: sig.err,
        }));
        setTransactions(mapped);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length > 0 && (
          <Text style={styles.countBadge}>{transactions.length}</Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={THEME.accentMint} />
          <Text style={styles.loadingText}>Fetching transactions...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.signature}
          scrollEnabled={false}
          renderItem={({ item }) => <TransactionRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "SpaceMono",
  },
  countBadge: {
    color: THEME.accentMint,
    fontSize: 13,
    fontFamily: "SpaceMono",
  },
  // Loading
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    color: THEME.textGray,
    fontSize: 13,
    fontFamily: "SpaceMono",
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SpaceMono",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: THEME.textGray,
    fontSize: 13,
    fontFamily: "SpaceMono",
    textAlign: "center",
    lineHeight: 20,
  },
  // Transaction rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenter: {
    flex: 1,
    marginLeft: 14,
    gap: 3,
  },
  txLabel: {
    color: THEME.textWhite,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "SpaceMono",
  },
  txAddress: {
    color: THEME.textGray,
    fontSize: 12,
    fontFamily: "SpaceMono",
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 3,
  },
  txStatus: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "SpaceMono",
  },
  txDate: {
    color: THEME.textGray,
    fontSize: 11,
    fontFamily: "SpaceMono",
  },
  separator: {
    height: 8,
  },
});
