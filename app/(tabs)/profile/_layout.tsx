import { useAuth, useUser } from "@clerk/clerk-expo";
import { router, Stack } from "expo-router";
import React from "react";
import { Alert, Button, Platform } from "react-native";

export default function Layout() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const deleteAccount = async () => {
    try {
      await user?.delete();
      await signOut();
      alert("Se ha cerrado la sesión");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará todos los datos de tu cuenta y no se puede deshacer",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar cuenta",
          onPress: deleteAccount,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

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
              title="Eliminar"
              color="red"
              onPress={handleDeleteAccount}
            />
          ),
        }}
      />
      <Stack.Screen
        name="buy-premium"
        options={{
          title: "Adquirir Premium",
          headerBackTitle: "Perfil",
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
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
