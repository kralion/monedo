import SaveGoalAsset from "@/assets/svgs/save-goal.svg";
import { FontAwesome } from "@expo/vector-icons";
import { X } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as React from "react";
import { Button, Dialog, Text, XStack, YStack } from "tamagui";

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
    <Dialog modal open={openModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.7}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quicker",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{
            x: 0,
            y: -20,
            opacity: 0,
            scale: 0.9,
          }}
          exitStyle={{
            x: 0,
            y: 10,
            opacity: 0,
            scale: 0.95,
          }}
          gap="$4"
        >
          <LinearGradient
            style={{ borderRadius: 20, padding: 10, shadowRadius: 10 }}
            colors={["#10828d", "#a3e062"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
            <YStack gap="$7" alignItems="center">
              <SaveGoalAsset width={200} height={220} />
              <Text className=" font-bold text-2xl ">Meta Registrada</Text>
              <Text className="text-[16px] text-center">
                Ahora los gastos que realizas debes de concientizarlos para que
                puedas cumplir tu objetivo
              </Text>
            </YStack>
            <YStack gap="$3">
              <Text className="font-semibold">Tips que te servirán :</Text>
              <YStack gap="$2">
                {currentAdvices.map((advice, index) => (
                  <XStack key={index} space={2} alignItems="center">
                    <FontAwesome color="#10828D" name="check" size={15} />
                    <Text>{advice}</Text>
                  </XStack>
                ))}
              </YStack>
              <Button
                className="w-full mt-10 rounded-full"
                height={12}
                onPress={() => {
                  setOpenModal(false), router.push("/(tabs)/statistics");
                }}
              >
                <Text className="font-semibold text-white ">
                  Ver Estadísticas
                </Text>
              </Button>
            </YStack>
          </LinearGradient>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
