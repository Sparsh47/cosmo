export type OnboardingScreensType = {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  secondaryText?: string;
};

export const onboardingScreens: OnboardingScreensType[] = [
  {
    id: "1",
    title: "Welcome to Cosmo",
    description:
      "Your secure gateway to the decentralized world. Manage assets, explore dApps, and transact with absolute ease.",
    ctaText: "Get Started",
    image: require("../assets/images/onboarding1.png"),
  },
  {
    id: "2",
    title: "Your Keys, Your Crypto",
    description:
      "Enjoy full non-custodial control. We never store your data—only you have access to your private keys and digital assets.",
    ctaText: "Next",
    image: require("../assets/images/onboarding2.png"),
  },
  {
    id: "3",
    title: "Swap, Trade & Explore",
    description:
      "Instantly exchange tokens across multiple chains and access a growing universe of decentralized applications.",
    ctaText: "Next",
    image: require("../assets/images/onboarding3.png"),
  },
  {
    id: "4",
    title: "Launch Your Crypto Journey",
    description:
      "Create a new wallet in seconds or import your existing one to join the decentralized revolution.",
    ctaText: "Create Wallet",
    secondaryText: "I already have a wallet",
    image: require("../assets/images/onboarding4.png"),
  },
];
