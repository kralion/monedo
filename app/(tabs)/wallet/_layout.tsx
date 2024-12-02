import { router } from "expo-router";
import { Stack } from "expo-router";
import { X } from "lucide-react-native";
import { Button } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Presupuestos",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },

          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerLargeTitle: true,
          title: "Detalles",
          headerBackTitle: "Atrás",
          headerBlurEffect: "regular",
          headerTransparent: true,
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
          title: "Editar Presupuesto",
          headerBackTitle: "Detalles",
          headerLargeTitle: true,
          headerBlurEffect: "regular",
          headerBackVisible: true,
          headerTransparent: true,
          headerShadowVisible: false,
          presentation: "card",
          headerRight: () => (
            <Button
              title="Eliminar"
              color="#FF453A"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
