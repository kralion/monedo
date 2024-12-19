import SaveGoalAsset from "@/assets/svgs/save-goal.svg";
import { FontAwesome } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import * as React from "react";
import { Button } from "./ui/button";
import { View } from "react-native";
import { Text } from "./ui/text";

type TNotification = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const savingGoalAdvices = [
  "Automatiza transferencias para ahorrar fácilmente.",
  "Establece metas de ahorro mensuales.",
  "Revisa y ajusta tu presupuesto regularmente.",
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
    <Dialog open={openModal}>
      <DialogContent
        key="content"
        className="rounded-full w-full flex flex-col py-4"
      >
        <LinearGradient
          style={{ borderRadius: 20, padding: 10, shadowRadius: 10 }}
          colors={["#10828d", "#a3e062"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <DialogClose asChild>
            <Button className="rounded-full" size="icon">
              <X />
            </Button>
          </DialogClose>
          <View className="flex flex-col gap-4 items-center">
            <SaveGoalAsset width={200} height={220} />
            <Text className=" font-bold text-2xl ">Meta Registrada</Text>
            <Text className="text-[16px] text-center">
              Ahora los gastos que realizas debes de concientizarlos para que
              puedas cumplir tu objetivo
            </Text>
          </View>
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
              <Text className="font-semibold text-white ">
                Ver Estadísticas
              </Text>
            </Button>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
