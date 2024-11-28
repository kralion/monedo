import BuyPremiumAsset from "@/assets/svgs/buy-premium.svg";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Text } from "../ui/text";
type ModalProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BuyPremiumModal({
  openModal,
  setOpenModal,
}: ModalProps) {
  return (
    <Dialog open={openModal}>
      <DialogContent
        key="content"
        className="rounded-full w-full flex flex-col py-4"
      >
        <LinearGradient
          style={{
            borderRadius: 20,
            padding: 10,
            shadowRadius: 10,
            paddingHorizontal: 12,
          }}
          colors={["#10828d", "#a3e062"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex flex-col gap-4 items-center">
            <BuyPremiumAsset width={200} height={220} />
            <Text className="text-3xl">Desbloquea Ahora</Text>
            <Text className="text-center">
              Con el plan <Text className="font-bold">Premium</Text> podrás
              acceder a funcionalidades exclusivas.
            </Text>
            <Text className="text-center italic">
              ¡Mejora tu experiencia hoy! y sácale el máximo provecho a{" "}
              <Text className="font-bold">Monedo</Text>
              🚀
            </Text>
          </View>
          <View className="flex flex-col gap-4">
            <Link href="/(modals)/buy-premium" asChild>
              <Button
                className="mt-5"
                size="lg"
                onPress={() => {
                  setOpenModal(false), router.push("/(modals)/buy-premium");
                }}
              >
                Adquiere Premium
              </Button>
            </Link>
          </View>
        </LinearGradient>
        <Button
          className="absolute rounded-full top-5 right-5"
          size="icon"
          onPress={() => setOpenModal(false)}
        >
          <X />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
