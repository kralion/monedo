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
        name="export-data"
        options={{
          title: "Exportar mis datos",
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
