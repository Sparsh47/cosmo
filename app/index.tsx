import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
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
