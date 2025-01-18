import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
import { X } from "lucide-react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { isDarkColorScheme } = useColorScheme();

  if (isSignedIn) {
    return <Redirect href="/(auth)/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="t&c"
        options={{
          title: "Términos Legales",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerRight: () => (
            <Button
              variant="link"
              className="active:opacity-70"
              size="icon"
              onPress={() => {
                router.back();
              }}
              hitSlop={20}
            >
              <X color={isDarkColorScheme ? "white" : "black"} />
            </Button>
          ),
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{ title: "Iniciar Sesión", headerShown: false }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: "Iniciar Sesión", headerShown: false }}
      />
    </Stack>
  );
}
