import SaveGoalAsset from "@/assets/svgs/save-goal.svg";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Text } from "./ui/text";

type TNotification = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const savingGoalAdvices = [
  "Automatiza transferencias para ahorrar fácilmente.",
  "Establece metas de ahorro mensuales.",
  "Revisa y ajusta tus gastos regularmente.",
  "Celebra pequeños logros de ahorro.",
  "Categoriza gastos para un seguimiento detallado.",
  "Recibe notificaciones de límites de gastos.",
  "Analiza gráficos para insights rápidos.",
  "Aprovecha alertas de revisión de presupuesto.",
];

export function SavingGoalModal({ openModal, setOpenModal }: TNotification) {
  const [currentAdvices, setCurrentAdvices] = React.useState<string[]>([]);
  React.useEffect(() => {
    const randomAdvices = savingGoalAdvices
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    setCurrentAdvices(randomAdvices);
  }, []);
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent key="content" className=" rounded-2xl mx-2">
        <View className="flex flex-col gap-4 items-center">
          <SaveGoalAsset width={200} height={220} />
        </View>
        <Text className=" font-bold text-2xl ">Presupuesto Registrado</Text>
        <Text className="text-md text-muted-foreground">
          Cada gasto registrado irá disminuyendo la cantidad que acabas de
          registrar.
        </Text>

        <View className="flex flex-col gap-4 ">
          <Text className="font-semibold">Tips que te servirán :</Text>
          <View className="flex flex-col gap-2 ">
            {currentAdvices.map((advice, index) => (
              <View className="flex flex-row gap-2 items-center" key={index}>
                <FontAwesome color="#10828D" name="check" size={15} />
                <Text>{advice}</Text>
              </View>
            ))}
          </View>
          <Button
            className="w-full mt-10 rounded-full"
            onPress={() => {
              setOpenModal(false), router.push("/(tabs)/statistics");
            }}
          >
            <Text className="font-semibold text-white ">Ver Estadísticas</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
