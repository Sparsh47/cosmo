import TransactionList from "@/components/TransactionList";
import { THEME } from "@/constants/theme";
import { getBalance } from "@/lib/solana";
import { globalStyles } from "@/styles/globalStyles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const ACTION_BUTTONS = [
    {
      id: "send",
      title: "Send",
      icon: <Ionicons name="arrow-up-circle-outline" size={32} color="white" />,
      action: () => { },
    },
    {
      id: "receive",
      title: "Receive",
      icon: (
        <Ionicons name="arrow-down-circle-outline" size={32} color="white" />
      ),
      action: () => { },
    },
    {
      id: "swap",
      title: "Swap",
      icon: (
        <MaterialCommunityIcons
          name="swap-horizontal"
          size={32}
          color="white"
        />
      ),
      action: () => { },
    },
    {
      id: "buy",
      title: "Buy",
      icon: <Ionicons name="card-outline" size={32} color="white" />,
      action: () => { },
    },
  ];

  useEffect(() => {
    (async () => {
      const wallet = await AsyncStorage.getItem("wallet");
      if (JSON.parse(wallet!).length === 0) return;
      const publicKey = JSON.parse(wallet!).publicKey;
      setWalletAddress(publicKey);
      const balance = await getBalance(publicKey);
      setSolBalance(balance);
    })();
  }, []);

  return (
    <View style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={["#0F3832", "#0A2622", "#061A18"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <View style={styles.headerContent}>
                <View style={styles.profileImg}></View>
                <View style={styles.userInfo}>
                  <Text style={[styles.infoText, styles.name]}>
                    Hello, Sparsh
                  </Text>
                  <Text style={[styles.infoText, styles.greeting]}>
                    Good day to invest
                  </Text>
                </View>
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.infoText}>Wallet (USDT)</Text>
                <Text style={styles.amount}>{solBalance.toFixed(2)} SOL</Text>
              </View>
              <View style={styles.actionBtns}>
                <FlatList
                  contentContainerStyle={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={ACTION_BUTTONS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ActionButton icon={item.icon} title={item.title} action={item.action} />
                  )}
                />
              </View>
            </LinearGradient>
          </View>
        </View>
        <TransactionList address={walletAddress} />
      </ScrollView>
    </View>
  );
}

function ActionButton({ icon, title, action }: { icon?: any; title?: string; action?: () => void }) {
  return (
    <View style={styles.actionBtnWrapper}>
      <TouchableOpacity style={styles.actionBtn} onPress={action}>
        {icon}
      </TouchableOpacity>
      {title && <Text style={styles.actionBtnTitle}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
  cardWrapper: {
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 15,
  },
  gradientContainer: {
    minHeight: "40%",
    borderRadius: 50,
    padding: 20,
    paddingTop: 60,
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
    overflow: "hidden",
    gap: 20,
  },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImg: {
    height: THEME.box.dimension,
    width: THEME.box.dimension,
    borderRadius: THEME.box.radius,
    backgroundColor: THEME.bg,
  },
  userInfo: {},
  infoText: {
    color: THEME.textWhite,
    fontFamily: "SpaceMono",
  },
  name: {
    fontSize: 15,
  },
  greeting: {
    fontSize: 12,
    color: THEME.textGray,
  },
  walletInfo: {
    gap: 5,
  },
  amount: {
    color: THEME.textWhite,
    fontWeight: "500",
    fontSize: 40,
  },
  actionBtns: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionBtnWrapper: {
    alignItems: "center",
  },
  actionBtn: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: THEME.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnTitle: {
    color: THEME.textWhite,
    fontSize: 14,
    fontFamily: "SpaceMono",
    marginTop: 6,
  },
});
