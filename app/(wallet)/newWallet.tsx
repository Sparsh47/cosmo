import GradientButton from "@/components/GradientButton";
import Mnemonic from "@/components/Mnemonic";
import { THEME } from "@/constants/theme";
import { createWallet } from "@/lib/solana";
import { copyToClipboard } from "@/lib/utils";
import { globalStyles } from "@/styles/globalStyles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewWalletScreen() {
  const [showPhrase, setShowPhrase] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string>("");

  useEffect(() => {
    (async () => {
      const wallet = await createWallet();
      if (!wallet) {
        return;
      }
      setSeedPhrase(wallet?.mnemonic!);
      await AsyncStorage.setItem("wallet", JSON.stringify(wallet));
    })();
  }, []);

  const handleNext = async () => {
    await AsyncStorage.setItem("wallet", JSON.stringify([]));
    router.replace("/home");
  };

  const handleShow = () => {
    setShowPhrase((prev) => !prev);
  };

  // const seedPhrase =
  //   "apple banana cherry dog eagle fish goat horse ice jacket kangaroo lion";

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.banner}>
        <Entypo name="chevron-small-left" size={32} color="#FFF" />
        <Text style={styles.bannerTitle}>SEED PHRASE</Text>
        <Text>{"      "}</Text>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.phraseContainer}>
          <Text style={styles.title}>
            Write down your recovery phrase in order
          </Text>
          <View style={styles.warning}>
            <AntDesign
              name="exclamation-circle"
              size={24}
              color={THEME.warningYellow}
            />
            <Text style={styles.warningMsg}>
              Never pass the seed phrase from wallet to anyone
            </Text>
          </View>
          <Mnemonic
            show={showPhrase}
            handleShow={handleShow}
            seedPhrase={seedPhrase}
          />
          <TouchableOpacity
            style={styles.subtleCopyBtn}
            onPress={() => copyToClipboard(seedPhrase)}
            activeOpacity={0.7}
          >
            <Entypo name="copy" size={18} color={THEME.accentMint} />
            <Text style={styles.copyBtnText}>COPY TO CLIPBOARD</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBtnContainer}>
          <GradientButton btnText="Next" OnPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 5,
    flex: 1,
    gap: 20,
  },
  banner: {
    backgroundColor: THEME.midnightTeal,
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 600,
    fontFamily: "Doto-ExtraBold",
    textAlign: "center",
  },
  phraseContainer: {
    backgroundColor: THEME.midnightTeal,
    width: "100%",
    maxHeight: "95%",
    borderRadius: 15,
    padding: 20,
    gap: Platform.OS === "ios" ? 20 : 10,
  },
  title: {
    color: "#FFF",
    fontSize: Platform.OS === "ios" ? 24 : 20,
    fontFamily: "Doto-Black",
  },
  warning: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
  },
  warningMsg: {
    flex: 1,
    flexShrink: 1,
    color: "#F5F5F5",
    fontFamily: "SpaceMono",
    fontSize: 14,
  },
  subtleCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 163, 0.2)",
    backgroundColor: "rgba(0, 255, 163, 0.03)",
  },
  copyBtnText: {
    color: THEME.accentMint,
    fontFamily: "SpaceMono",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  bottomBtnContainer: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: "auto",
    marginBottom: 20,
  },
});
