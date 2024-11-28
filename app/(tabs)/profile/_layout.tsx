import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          title: "Añadir una sala",
          headerBackTitle: "Perfil",
        }}
      />
      <Stack.Screen
        name="personal-info"
        options={{
          title: "",
          headerBackTitle: "Perfil",
        }}
      />
      <Stack.Screen
        name="buy-premium"
        options={{
          title: "",
          headerBackTitle: "Perfil",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          headerBackTitle: "Perfil",
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
    </Stack>
  );
}
