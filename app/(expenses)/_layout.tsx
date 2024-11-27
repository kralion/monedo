import { ChevronLeft } from "lucide-react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function ModalsLayout() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Detalles",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -10 }}
            >
              <View className="flex flex-row items-center">
                <ChevronLeft className="text-xl text-primary" />
                <Text className="text-xl text-primary">Gastos</Text>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              onPress={() => router.push(`/(expenses)/edit/${params.id}`)}
            >
              <Text className="text-primary">Editar</Text>
            </Button>
          ),
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerTitle: "Editar",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={{ marginLeft: -5 }}
            >
              <View className="flex flex-row items-center">
                <ChevronLeft size={24} className="text-primary" />
                <Button onPress={() => router.back()}>
                  <Text className="text-4xl text-primary">Gastos</Text>
                </Button>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button onPress={() => router.replace("/(tabs)")}>
              <Text className="text-primary">Cancelar</Text>
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
