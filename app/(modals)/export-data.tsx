import ExportAsset from "@/assets/svgs/export.svg";
import { useHeaderHeight } from "@react-navigation/elements";
import { Alert, Image, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Export() {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <View className="flex flex-col gap-6 p-3 items-center">
        <ExportAsset width={300} height={300} />
        <Text className="text-3xl text-center px-5">
          Formatos en los que puedes exportar tu historial de gastos
        </Text>

        <View className="flex flex-row mt-10 gap-3 w-full">
          <Button
            size="lg"
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
            Documento
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
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
            Hoja de Cálculo
          </Button>
          <Button
            size="lg"
            className="flex flex-row gap-2 items-center"
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
            Archivo PDF
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
