import GradientButton from "@/components/GradientButton";
import { THEME } from "@/constants/theme";
import { globalStyles } from "@/styles/globalStyles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeed, validateMnemonic } from "bip39";
import bs58 from "bs58";
import { router } from "expo-router";
import { HDKey } from "micro-ed25519-hdkey";
import { useRef, useState } from "react";
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

const WORD_COUNT = 12;

export default function ExistingWalletScreen() {
  const [words, setWords] = useState<string[]>(Array(WORD_COUNT).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>(Array(WORD_COUNT).fill(null));

  const updateWord = (index: number, value: string) => {
    // Handle paste of entire mnemonic in first box
    const trimmed = value.trim();
    const split = trimmed.split(/\s+/);
    if (split.length === WORD_COUNT) {
      setWords(split.slice(0, WORD_COUNT));
      inputRefs.current[WORD_COUNT - 1]?.focus();
      return;
    }
    const updated = [...words];
    updated[index] = value.toLowerCase().trim();
    setWords(updated);
    // Auto-advance on space
    if (value.endsWith(" ") && index < WORD_COUNT - 1) {
      updated[index] = value.trim();
      setWords(updated);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleImport = async () => {
    const mnemonic = words.join(" ").trim();
    if (!validateMnemonic(mnemonic)) {
      Toast.show({
        type: "error",
        text1: "Invalid seed phrase",
        text2: "Please check all 12 words and try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = "m/44'/501'/0'/0'";
      const hd = HDKey.fromMasterSeed(seed);
      const derivedSeed = hd.derive(path);
      if (!derivedSeed.privateKey) throw new Error("Failed to derive key");
      const keyPair = Keypair.fromSeed(derivedSeed.privateKey);

      const walletData = {
        mnemonic,
        path,
        publicKey: keyPair.publicKey.toBase58(),
        privateKey: bs58.encode(keyPair.secretKey),
      };

      await AsyncStorage.setItem("wallet", JSON.stringify(walletData));
      router.replace("/home");
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Import failed",
        text2: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const allFilled = words.every((w) => w.length > 0);

  if (loading) {
    return (
      <View style={[globalStyles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={THEME.accentMint} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="chevron-small-left" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.bannerTitle}>IMPORT WALLET</Text>
        <Text>{"      "}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <View style={styles.phraseContainer}>
              <Text style={styles.title}>Enter your 12-word recovery phrase</Text>

              {/* Warning */}
              <View style={styles.warning}>
                <AntDesign name="exclamation-circle" size={24} color={THEME.warningYellow} />
                <Text style={styles.warningMsg}>
                  Your seed phrase gives full access to your wallet. Keep it private and never share it.
                </Text>
              </View>

              {/* Word grid */}
              <View style={styles.grid}>
                {words.map((word, index) => (
                  <View key={index} style={styles.wordInputWrapper}>
                    <Text style={styles.wordIndex}>{index + 1}</Text>
                    <TextInput
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={styles.wordInput}
                      value={word}
                      onChangeText={(val) => updateWord(index, val)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType={index < WORD_COUNT - 1 ? "next" : "done"}
                      onSubmitEditing={() => {
                        if (index < WORD_COUNT - 1) inputRefs.current[index + 1]?.focus();
                      }}
                      blurOnSubmit={index === WORD_COUNT - 1}
                      placeholder="word"
                      placeholderTextColor="rgba(255,255,255,0.15)"
                    />
                  </View>
                ))}
              </View>

              {/* Clear button */}
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setWords(Array(WORD_COUNT).fill(""))}
                activeOpacity={0.7}
              >
                <AntDesign name="close-circle" size={16} color="#FF4D4D" />
                <Text style={styles.clearBtnText}>CLEAR ALL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBtnContainer}>
              <GradientButton
                btnText="Import Wallet"
                OnPress={handleImport}
                variant={allFilled ? "filled" : "outline"}
                disabled={!allFilled}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontWeight: "600",
    fontFamily: "Doto-ExtraBold",
    textAlign: "center",
  },
  phraseContainer: {
    backgroundColor: THEME.midnightTeal,
    width: "100%",
    borderRadius: 15,
    padding: 20,
    gap: 14,
  },
  title: {
    color: "#FFF",
    fontSize: Platform.OS === "ios" ? 22 : 18,
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
    fontSize: 13,
  },
  // Word grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordInputWrapper: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.bg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
  },
  wordIndex: {
    color: THEME.border.color,
    fontSize: 13,
    minWidth: 18,
  },
  wordInput: {
    flex: 1,
    color: THEME.accentMint,
    fontFamily: "SpaceMono",
    fontSize: 14,
    padding: 0,
  },
  // Clear button
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,77,77,0.2)",
    backgroundColor: "rgba(255,77,77,0.04)",
  },
  clearBtnText: {
    color: "#FF4D4D",
    fontFamily: "SpaceMono",
    fontSize: 12,
    letterSpacing: 1,
  },
  bottomBtnContainer: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: "auto",
    marginBottom: 20,
  },
});
