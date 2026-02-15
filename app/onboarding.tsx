import { onboardingScreens } from "@/constants/onboardingContent";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { THEME } from "@/constants/theme";
import { globalStyles } from "@/styles/globalStyles";
import GradientButton from "@/components/GradientButton";

const { width } = Dimensions.get("screen");

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnboardingNav = async () => {
    if (currentIndex < onboardingScreens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/(wallet)/newWallet");
    }
  };

  const handleImportWallet = async () => {
    router.replace("/(wallet)/existingWallet");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingScreens}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.bottomContainer}>
        <GradientButton
          btnText={onboardingScreens[currentIndex].ctaText}
          OnPress={handleOnboardingNav}
        />

        {currentIndex === onboardingScreens.length - 1 && (
          <TouchableOpacity onPress={handleImportWallet} activeOpacity={0.7}>
            <Text style={styles.secondaryText}>
              {onboardingScreens[currentIndex].secondaryText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  image: {
    width: width * 0.8, // Reduced width slightly so it doesn't touch edges
    height: 300, // Fixed height to ensure consistency
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    color: THEME.textWhite,
    fontWeight: "800", // Made slightly bolder for a modern look
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  description: {
    fontSize: 16,
    color: THEME.textGray,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 50, // Lifted slightly
    left: 24,
    right: 24,
    alignItems: "center", // Ensures secondary text centers properly
  },

  secondaryText: {
    color: THEME.accentMint, // Changed to the accent color
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20, // Changed from absolute positioning to margin for cleaner layout flow
  },
});
