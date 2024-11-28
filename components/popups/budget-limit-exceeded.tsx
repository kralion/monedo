import { X } from "lucide-react-native";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

type TNotification = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
};

export function BudgetLimitExceededModal({
  setShowModal,
  showModal,
}: TNotification) {
  return (
    <Dialog open={false}>
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
            {/* <BuyPremiumAsset width={200} height={220} /> */}
            <Text className="text-3xl">Presupuesto Excedido</Text>
            <Text>
              Parece que ya has gastado todo el monto presupuesto para este mes.
            </Text>
          </View>
          <View className="flex flex-col gap-4">
            <Link href="/(modals)/buy-premium" asChild>
              <Button
                className="mt-5"
                onPress={() => {
                  setShowModal(false), router.push("/(modals)/buy-premium");
                }}
              >
                <Text className="font-semibold  ">Ver Estadísticas</Text>
              </Button>
            </Link>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
