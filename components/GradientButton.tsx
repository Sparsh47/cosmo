import { THEME } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

type GradientButtonProps = {
  btnText: string;
  OnPress: () => void;
  variant?: "filled" | "outline";
};

export default function GradientButton({
  btnText,
  OnPress,
  variant = "filled",
}: GradientButtonProps) {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={OnPress}
      style={styles.touchableBtnContainer}
    >
      {isOutline ? (
        // 🔥 Outline Variant
        <LinearGradient
          colors={[THEME.accentMint, THEME.accentCyan]}
          style={styles.gradientBorder}
        >
          <View style={styles.outlineInner}>
            <MaskedView
              maskElement={
                <Text
                  style={[styles.btnText, { backgroundColor: "transparent" }]}
                >
                  {btnText}
                </Text>
              }
            >
              <LinearGradient colors={[THEME.accentMint, THEME.accentCyan]}>
                <Text style={[styles.btnText, { opacity: 0 }]}>{btnText}</Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </LinearGradient>
      ) : (
        // 🔥 Filled Variant
        <LinearGradient
          colors={[THEME.accentMint, THEME.accentCyan]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBtn}
        >
          <Text style={styles.btnText}>{btnText}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchableBtnContainer: {
    width: "100%",
    borderRadius: 30,
    shadowColor: THEME.accentMint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  gradientBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  gradientBorder: {
    borderRadius: 30,
    padding: 2, // thickness of gradient border
  },

  outlineInner: {
    borderRadius: 30,
    backgroundColor: THEME.bg,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: THEME.bg,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
