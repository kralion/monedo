import { Stack, router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="export-data"
        options={{
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -10 }}
            >
              <View className="flex flex-row items-center">
                <ChevronLeft size={24} className="text-primary" />
                <Text className="text-3xl text-primary">Reporte</Text>
              </View>
            </TouchableOpacity>
          ),
          presentation: "card",
          title: "Exportar",
        }}
      />
      <Stack.Screen name="buy-premium" options={{ headerShown: false }} />

      <Stack.Screen
        name="notifications"
        options={{
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <View className="flex flex-row items-center">
                  <ChevronLeft size={24} className="text-primary" />
                  <Text className="text-4xl text-primary">Perfil</Text>
                </View>
              </TouchableOpacity>
            );
          },
          presentation: "card",
          title: "Notificaciones",
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          presentation: "card",
          headerBlurEffect: "regular",
          headerTransparent: true,
          title: "Membresía",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <View className="flex flex-row items-center">
                  <ChevronLeft size={24} className="text-primary" />
                  <Text className="text-4xl text-primary">Perfil</Text>
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="personal-info"
        options={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                style={{ marginLeft: -10 }}
              >
                <View className="flex flex-row items-center">
                  <ChevronLeft size={24} className="text-primary" />
                  <Text className="text-4xl text-primary">Perfil</Text>
                </View>
              </TouchableOpacity>
            );
          },

          headerBlurEffect: "regular",
          headerTransparent: true,
          presentation: "card",
          title: "Datos Personales",
        }}
      />
    </Stack>
  );
}
