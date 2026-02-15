import { globalStyles } from "@/styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const resetOnboarding = async () => {
    await AsyncStorage.setItem("onboarding", "false");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <TouchableOpacity
        style={{
          maxWidth: 100,
          backgroundColor: "#FFF",
          position: "absolute",
          top: 100,
          left: 20,
          borderRadius: 50,
        }}
        onPress={resetOnboarding}
      >
        <Text
          style={{
            color: "#000",
            paddingVertical: 10,
            paddingHorizontal: 24,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Reset
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
