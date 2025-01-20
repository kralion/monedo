import { router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import { Button as NativeButton, Platform } from "react-native";
import { Button } from "~/components/ui/button";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/add-expense"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Nuevo Gasto",
            headerBackTitle: "Gastos",
            presentation: "modal",
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                className="rounded-full"
                variant="link"
                hitSlop={20}
                onPress={() => router.back()}
                size="icon"
              >
                <X size={20} color="black" />
              </Button>
            ),
          };
        }}
      />
      <Stack.Screen
        name="(modals)/details/[id]"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Detalles",
            headerBackTitle: "Gastos",
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: false,
            headerRight: () => (
              <NativeButton
                title="Editar"
                color="#27BE8B"
                onPress={() => router.push(`/(auth)/(modals)/edit/${id}`)}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="(modals)/edit/[id]"
        options={{
          title: "Editar Gasto",
          headerBackTitle: "Detalles",
          headerLargeTitle: true,
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerBackVisible: true,
          headerShadowVisible: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="(modals)/buy-premium"
        options={{
          presentation: "modal",
          title: "Adquirir Premium",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
