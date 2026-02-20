import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("wallet");
      const wallet = value ? JSON.parse(value) : null;

      if (wallet) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    })();
  }, []);

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
