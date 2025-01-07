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
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Detalles",
            headerLargeTitle: true,
            headerBackTitle: "Atrás",
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                title="Editar"
                color="#27BE8B"
                onPress={() => router.push(`/wallet/edit/${id}`)}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Editar Registro",
          headerBackVisible: true,
          headerLargeTitle: true,
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerShadowVisible: true,
          presentation: "modal",
          headerLeft: () => (
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
