import { Stack } from "expo-router";

export default function WalletScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="newWallet" options={{ headerShown: false }} />
      <Stack.Screen name="existingWallet" options={{ headerShown: false }} />
    </Stack>
  );
}
