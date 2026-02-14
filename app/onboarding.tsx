import { onboardingScreens } from "@/constants/onboardingContent";
import { router } from "expo-router";
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

const { width } = Dimensions.get("screen");

const THEME = {
  bg: "#021213",
  textWhite: "#ffffff",
  textGray: "#d5d5d5",
  accentMint: "#00FFA3",
  accentCyan: "#00D1FF",
};

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOnboardingNav = () => {
    if (currentIndex < onboardingScreens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOnboardingNav}
          style={styles.touchableBtnContainer}
        >
          <LinearGradient
            colors={[THEME.accentMint, THEME.accentCyan]} // Mint to Cyan gradient
            start={{ x: 0, y: 0 }} // Diagonal gradient from top-left
            end={{ x: 1, y: 1 }} // ...to bottom-right
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>
              {onboardingScreens[currentIndex].ctaText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {currentIndex === onboardingScreens.length - 1 && (
          <TouchableOpacity activeOpacity={0.7}>
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
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },

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

  // 4. New styles for gradient button structure
  touchableBtnContainer: {
    width: "100%",
    borderRadius: 30,
    // Shadows for depth (optional, looks good on dark bg)
    shadowColor: THEME.accentMint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  gradientBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  btnText: {
    color: THEME.bg, // Using the dark background color for text contrast against the bright gradient
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  secondaryText: {
    color: THEME.accentMint, // Changed to the accent color
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20, // Changed from absolute positioning to margin for cleaner layout flow
  },
});
