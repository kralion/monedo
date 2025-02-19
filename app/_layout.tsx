import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { router, Slot, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { XCircle } from "lucide-react-native";
import * as React from "react";
import { ActivityIndicator, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { toast, Toaster } from "sonner-native";
import OnboardingScreen from "~/components/onboarding";
import "~/global.css";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import QuickActionsSetup from "../components/quick-actions";
import WhatsNewModal from "~/components/news-modal";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
export default function RootLayout() {
  useQuickActionRouting();
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkOnboardingAndAuth = async () => {
      const onboardingCompleted = await AsyncStorage.getItem(
        "onboardingCompleted"
      );
      setIsOnboardingCompleted(onboardingCompleted === "true");
      setIsLoading(false);
    };

    checkOnboardingAndAuth();
  }, []);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hide();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (!isOnboardingCompleted && Platform.OS !== "web") {
    return (
      <OnboardingScreen onComplete={() => setIsOnboardingCompleted(true)} />
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <ClerkLoaded>
          <QuickActionsSetup />
          <WhatsNewModal />
          <RootLayoutNav />
          <PortalHost />
        </ClerkLoaded>
      </ThemeProvider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const client = new QueryClient();
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        toast.success("No tienes conexión a internet", {
          icon: <XCircle color="red" size={20} />,
        });
      }
    });
    return () => unsubscribe();
  }, []);
  React.useEffect(() => {
    if (!isSignedIn && segments[0] === "(auth)") {
      router.push("/(public)");
    } else if (isSignedIn && segments[0] === "(public)") {
      router.push("/(auth)/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments]);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={client}>
        <Toaster />
        <Slot />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
