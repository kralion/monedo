import { router } from "expo-router";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Text } from "./ui/text";
import { Image } from "expo-image";

type TNotification = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
};

export function BudgetLimitExceededModal({
  setShowModal,
  showModal,
}: TNotification) {
  return (
    <AlertDialog open={showModal}>
      <AlertDialogContent
        key="content"
        className=" w-full h-[60%] flex flex-col justify-between  py-4"
      >
        <AlertDialogHeader className="w-full ">
          <Image
            style={{ width: 300, height: 250 }}
            source={require("../assets/images/block-limit-exceeded.png")}
          />
          <AlertDialogTitle>Presupuesto Excedido</AlertDialogTitle>
          <AlertDialogDescription>
            Parece que ya has gastado todo el monto presupuesto para este mes,
            necesitas agregar mas fondos en tu presupuesto, por ahora el
            <Text className="text-red-500 font-bold">
              {" "}
              registro de gastos está bloqueado.
            </Text>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onPress={() => {
              setShowModal(false), router.push("/(auth)/(tabs)/wallet");
            }}
          >
            <Text>Agregar Fondos</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
