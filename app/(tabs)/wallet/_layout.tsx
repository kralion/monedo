import { router, Stack } from "expo-router";
import { Button, Platform } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Presupuestos",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Detalles",
          headerBackTitle: "Atrás",
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerShadowVisible: false,
          headerRight: () => (
            <Button
              title="Editar"
              color="#27BE8B"
              onPress={() => router.push("/(tabs)/wallet/edit/[id]")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Editar",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerShadowVisible: false,
          presentation: "modal",
          headerRight: () => (
            <Button
              title="Cancelar"
              color="#27BE8B"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
