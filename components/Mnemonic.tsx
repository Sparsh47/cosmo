import { THEME } from "@/constants/theme";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";

type MnemonicProps = {
  show: boolean;
  handleShow: () => void;
  seedPhrase: string;
};

export default function Mnemonic({
  show,
  handleShow,
  seedPhrase,
}: MnemonicProps) {
  const seedPhraseArray = seedPhrase.split(" ");

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        <FlatList
          data={seedPhraseArray}
          numColumns={2}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => (
            <WordBlock number={index + 1} word={item} />
          )}
        />

        {!show && (
          <Pressable style={styles.overlay} onPress={handleShow}>
            <BlurView
              intensity={Platform.OS === "ios" ? 60 : 30}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFill}
            />
            <Feather
              name="eye-off"
              size={Platform.OS === "ios" ? 40 : 32}
              color={THEME.textGray}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.overlayText}>"Tap" to reveal phrase</Text>
            <Text style={styles.overlayText}>Make sure no one is watching</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function WordBlock({ word, number }: { word: string; number: number }) {
  return (
    <View style={styles.blockContainer}>
      <Text style={styles.index}>{number}</Text>
      <Text style={styles.word}>{word}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 15,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  modernBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border.color,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  modernBtnText: {
    color: THEME.accentMint,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  /* LIST */

  listWrapper: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden", // ensures overlay respects rounded corners
  },

  listContainer: {
    borderRadius: 10,
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
    padding: 15,
    gap: 10,
  },

  blockContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: THEME.bg,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  index: {
    color: THEME.border.color,
    fontSize: 13,
  },

  word: {
    color: THEME.accentMint,
    fontFamily: "SpaceMono",
    fontSize: 16,
  },

  /* OVERLAY */

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      Platform.OS === "android" ? "rgba(0,0,0,0.4)" : "transparent",
    borderWidth: THEME.border.width,
    borderColor: THEME.border.color,
  },

  overlayText: {
    color: THEME.textGray,
    fontSize: Platform.OS === "ios" ? 16 : 12,
    fontFamily: "SpaceMono",
  },
});
