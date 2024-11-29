import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="buy-premium"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}
