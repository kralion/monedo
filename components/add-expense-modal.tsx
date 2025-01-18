import * as React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import type { ConfettiMethods } from "react-native-fast-confetti";
import { Confetti } from "react-native-fast-confetti";
import { AlertDialog, AlertDialogContent } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Text } from "./ui/text";
import { router } from "expo-router";

const styles = StyleSheet.create({
  modalContent: {
    width: "95%", // Adjust as needed
    height: "60%", // Adjust as needed
    maxWidth: 450, // Prevent it from becoming too wide on larger screens
    borderRadius: 20,
    overflow: "hidden", // Important for rounded corners with gradient
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gradient: {
    height: "100%",
    display: "flex",
    paddingBottom: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default function AddExpenseModal({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const confettiRef = React.useRef<ConfettiMethods>(null);

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className="p-0 " style={styles.modalContent}>
        <Confetti
          ref={confettiRef}
          autoplay={true}
          radiusRange={[0, 15]}
          sizeVariation={0.5}
          flakeSize={{ width: 15, height: 10 }}
          count={500}
        />
        <View className="flex flex-col gap-6 pt-6 items-center">
          <Text className="text-2xl font-bold px-6 text-left">
            Gasto Agregado
          </Text>
          <Separator />

          <Image
            style={{ width: 150, height: 150 }}
            className="bg-brand/20 rounded-full p-8"
            source={{
              uri: "https://img.icons8.com/?size=200&id=IFyb9G1c6yAC&format=png&color=000000",
            }}
          />
          <Text className="text-xl font-semibold">Registro Exitoso</Text>
          <Text className="text-center leading-6 text-muted-foreground px-6">
            Los gastos estan acutalizados en real time con tus reportes y
            estadísticas.
          </Text>
          <Text className="text-center text-muted-foreground px-6">
            🚀 Tip: Será bloqueado el creado de gastos si superas tu billetera.
          </Text>
        </View>
        <Button
          size="lg"
          className="mx-10 rounded-full"
          onPress={() => {
            setOpenModal(false);
            router.push("/(auth)/(tabs)");
          }}
        >
          <Text>Ir al Inicio</Text>
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
