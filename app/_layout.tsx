import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../lib/polyfills";

SplashScreen.preventAutoHideAsync();



export const unstable_settings = {
  initialRouteName: "onboarding",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    "Doto-Thin": require("../assets/fonts/Doto-Thin.ttf"),
    "Doto-ExtraLight": require("../assets/fonts/Doto-ExtraLight.ttf"),
    "Doto-Light": require("../assets/fonts/Doto-Light.ttf"),
    "Doto-Regular": require("../assets/fonts/Doto-Regular.ttf"),
    "Doto-Medium": require("../assets/fonts/Doto-Medium.ttf"),
    "Doto-SemiBold": require("../assets/fonts/Doto-SemiBold.ttf"),
    "Doto-Bold": require("../assets/fonts/Doto-Bold.ttf"),
    "Doto-ExtraBold": require("../assets/fonts/Doto-ExtraBold.ttf"),
    "Doto-Black": require("../assets/fonts/Doto-Black.ttf"),

    "DotoRounded-Thin": require("../assets/fonts/Doto_Rounded-Thin.ttf"),
    "DotoRounded-ExtraLight": require("../assets/fonts/Doto_Rounded-ExtraLight.ttf"),
    "DotoRounded-Light": require("../assets/fonts/Doto_Rounded-Light.ttf"),
    "DotoRounded-Regular": require("../assets/fonts/Doto_Rounded-Regular.ttf"),
    "DotoRounded-Medium": require("../assets/fonts/Doto_Rounded-Medium.ttf"),
    "DotoRounded-SemiBold": require("../assets/fonts/Doto_Rounded-SemiBold.ttf"),
    "DotoRounded-Bold": require("../assets/fonts/Doto_Rounded-Bold.ttf"),
    "DotoRounded-ExtraBold": require("../assets/fonts/Doto_Rounded-ExtraBold.ttf"),
    "DotoRounded-Black": require("../assets/fonts/Doto_Rounded-Black.ttf"),

    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <Toast />
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="send" options={{ headerShown: false }} />
        <Stack.Screen name="receive" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="swap" options={{ headerShown: false }} />
        <Stack.Screen name="assets" options={{ headerShown: false }} />
        <Stack.Screen name="(wallet)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
