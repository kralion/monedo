import { router, Stack } from "expo-router";
import { Button } from "react-native";
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
          title: "",
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
