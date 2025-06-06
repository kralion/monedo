import { View } from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";

export default function Yape() {
  return (
    <View className="flex flex-col py-3 gap-6">
      <View className="flex flex-col gap-2">
        <Text>Número de Teléfono</Text>
        <Button disabled variant="outline" size="lg" className="font-bold">
          <Text className="  text-black dark:text-black">914 019 629</Text>
        </Button>
      </View>
      <View className="flex flex-col gap-2">
        <Text>Monto de yapeo</Text>

        <Button variant="outline" size="lg" disabled className="font-bold">
          <Text className="text-black dark:text-black"> S/ 15.00</Text>
        </Button>
      </View>
      <Text className="text-sm text-foreground">
        El último paso es mandarnos una captura al WhatsApp del yapeo a este
        número
        <Text className="text-primary dark:text-primary"> 914 019 929</Text>
      </Text>
      <Button size="lg" className="bg-purple-600 mt-5 text-white">
        <Text className="text-white"> Abrir Yape</Text>
      </Button>
    </View>
  );
}
