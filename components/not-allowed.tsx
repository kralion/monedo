import UpgradeAsset from "@/assets/svgs/unlock.svg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import { Text } from "./ui/text";
type NotAllowedProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotAllowedModal({
  openModal,
  setOpenModal,
}: NotAllowedProps) {
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
            <Button size="icon">
              <X />
            </Button>
          </DialogClose>
          <View className="flex flex-col gap-4 items-center">
            <View className="flex flex-col gap-4 items-center">
              <UpgradeAsset width={200} height={220} />
              <Text className="font-bold">Desbloquea Ahora</Text>
              <Text>
                Esta funcionalidad está{" "}
                <Text className="font-bold">disponible</Text> en el plan{" "}
                <Text className="font-bold">Premium</Text>.
              </Text>
              <Text className="italic text-center">
                ¡Mejora tu experiencia hoy! y sacale el máximo provecho a la
                applicación.
              </Text>
            </View>
            <View className="flex flex-col gap-3 ">
              <Button
                size="lg"
                onPress={() => {
                  setOpenModal(false),
                    router.push("/(auth)/(modals)/buy-premium");
                }}
              >
                <Text className="font-semibold  ">Adquiere Premium</Text>
              </Button>
            </View>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
