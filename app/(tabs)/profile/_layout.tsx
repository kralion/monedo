import { router, Stack } from "expo-router";
import { Alert, Button } from "react-native";

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
          title: "Plan Actual",
          headerBackTitle: "Perfil",
          headerTransparent: true,
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="personal-info"
        options={{
          title: "Datos Personales",
          headerBackTitle: "Perfil",
          headerTransparent: true,
          headerLargeTitle: true,
          headerRight: () => (
            <Button
              title="Guardar"
              color="#27BE8B"
              onPress={
                () =>
                  Alert.alert(
                    "Guardar Cambios",
                    "Actualizar los datos modificados"
                  )
                // router.back();
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="buy-premium"
        options={{
          title: "Adquirir Premium",
          headerBackTitle: "Perfil",
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
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
