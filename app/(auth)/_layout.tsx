import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/add-expense"
        options={({ route }) => {
          const { id } = route.params as { id: number };
          return {
            title: id ? "Editar Gasto" : "Nuevo Gasto",
            presentation: "modal",
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: false,
          };
        }}
      />
      <Stack.Screen
        name="(modals)/details/[id]"
        options={{
          title: "Detalles",
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerShadowVisible: false,
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
