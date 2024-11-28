import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        options={{
          title: "Presupuestos",
          headerStyle: {
            backgroundColor: "#F3F3F3",
          },
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },

          headerLargeTitleShadowVisible: false,
        }}
        name="index"
      />
    </Stack>
  );
}
