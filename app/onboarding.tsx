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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleOnboardingNav = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentIndex > 0) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex - 1,
        });
      }
    } else {
      if (currentIndex < onboardingScreens.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
        });
      }

      if (currentIndex === onboardingScreens.length - 1) {
        router.replace("/home");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingScreens}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={({ id }) => id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
        )}
      />
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => handleOnboardingNav("next")}
          style={styles.btn}
        >
          <Text style={styles.btnText}>
            {currentIndex === onboardingScreens.length - 1
              ? "Let's Go"
              : "Next"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOnboardingNav("prev")}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Prev</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
  },
  image: {
    backgroundColor: "#252525",
    height: "100%",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  buttons: {
    position: "absolute",
    bottom: 25,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 20,
    flex: 1,
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f5f5f5",
    borderRadius: 15,
  },
  btnText: {
    color: "#f5f5f5",
    fontWeight: 500,
    fontSize: 20,
    textTransform: "uppercase",
  },
});
