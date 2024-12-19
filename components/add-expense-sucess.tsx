import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React from "react";
import { Image, View } from "react-native";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent } from "./ui/dialog";
import { Text } from "./ui/text";

export default function AddExpenseSuccesModal({
  openModal,
  setOpenModal,
  expensePrice,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  expensePrice: string;
}) {
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
            <Image
              width={200}
              height={220}
              source={require("../../assets/images/success.png").default}
            />
            <Text className="text-2xl">Registro Exitoso</Text>
            <Text className="text-center">
              Para mas detalles sobre este registro puedes revisar el historial
              de gastos.
            </Text>
            <Button variant="outline">
              <Text className="font-bold text-xl">S/. {expensePrice}</Text>
            </Button>
            <Button
              onPress={() => setOpenModal(false)}
              className="rounded-full w-full py-4"
            >
              <Text className=" font-semibold text-white">Aceptar</Text>
            </Button>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
