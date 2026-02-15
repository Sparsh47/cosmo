import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("onboarding");
      const isOnboardingTrue = value ? JSON.parse(value) : false;

      if (isOnboardingTrue) {
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
