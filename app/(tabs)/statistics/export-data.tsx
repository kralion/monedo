import ExportAsset from "@/assets/svgs/export.svg";
import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { Alert, Image, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Export() {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <View className="flex flex-col gap-4 p-4 items-center">
        <ExportAsset width={300} height={300} />
        <View className="flex flex-col gap-2 mx-auto">
          <Text className="text-2xl font-bold text-center ">
            Formatos de exportación
          </Text>
          <Text className="text-md text-muted-foreground text-center">
            Selecciona el formato en el que quieres exportar tus historiales de
            gasto y demás.
          </Text>
        </View>

        <View className="flex flex-col mt-10 gap-3 w-full">
          <Button
            size="lg"
            variant="outline"
            className="flex flex-row gap-2 items-center"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13674&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text> Documento</Text>
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
            variant="outline"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13654&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />

            <Text> Hoja de Cálculo</Text>
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
            variant="outline"
            onPress={() =>
              Alert.alert("Exportación", "Se exportó correctamente")
            }
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=48&id=13417&format=png",
              }}
              style={{ width: 30, height: 30 }}
            />

            <Text> Archivo PDF</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
