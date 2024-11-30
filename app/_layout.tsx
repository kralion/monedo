import "~/global.css";

import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { router, SplashScreen, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import * as React from "react";
import { Platform, TouchableOpacity } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import { Button as NativeButton } from "react-native";
import { Text } from "~/components/ui/text";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
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

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
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
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <ClerkLoaded>
          <RootLayoutNav />
        </ClerkLoaded>
        <PortalHost />
      </ThemeProvider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();

  // Automatically open login if user is not authenticated
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(auth)/sign-in");
    }
  }, [isLoaded]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/details/[id]"
        options={{
          headerLargeTitle: true,
          title: "Detalles",
          headerBackTitle: "Gastos",
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerShadowVisible: false,
          headerRight: () => (
            <NativeButton
              title="Editar"
              color="black"
              onPress={() => router.push("/(modals)/edit/[id]")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/edit/[id]"
        options={{
          title: "",
          presentation: "modal",
          headerRight: () => (
            <NativeButton
              title="Cancelar"
              color="black"
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/buy-premium"
        options={{
          presentation: "modal",
          title: "Adquirir Premium",

          headerRight: () => (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full  "
              onPress={() => router.back()}
            >
              <X />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
