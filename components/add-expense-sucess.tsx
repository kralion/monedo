import React from "react";
import { Image, View } from "react-native";
import { AlertDialog, AlertDialogContent } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Badge } from "./ui/badge";
import { router } from "expo-router";

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
    <AlertDialog open={openModal}>
      <AlertDialogContent
        key="content"
        className=" w-full flex flex-col py-4 rounded-[30px]"
      >
        <View className="flex flex-col gap-4 items-center">
          <Image
            style={{ width: 200, height: 320 }}
            source={require("../assets/images/success.png")}
          />
          <Badge>
            <Text className="font-bold text-3xl py-2 px-4">
              S/. {expensePrice}
            </Text>
          </Badge>
          <Text className="text-xl font-bold">Gasto Registrado</Text>
          <Text className="opacity-50">
            Puedes revisar detalles del gasto en tu historial, las estadísticas
            también fueron actualizadas con el nuevo gasto.
          </Text>
          <Button
            onPress={() => {
              setOpenModal(false);
              router.push("/(tabs)");
            }}
            className="rounded-full w-full py-4"
          >
            <Text className=" font-semibold text-white">Aceptar</Text>
          </Button>
        </View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
