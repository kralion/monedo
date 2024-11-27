import { X } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image } from "react-native";
import { H3, Text, YStack } from "tamagui";
import { Button } from "tamagui";
import { Dialog } from "tamagui";

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
            <YStack gap="$4" alignItems="center">
              <Image
                width={200}
                height={220}
                source={require("../../assets/images/success.png").default}
              />
              <H3>Registro Exitoso</H3>
              <Text textAlign="center">
                Para mas detalles sobre este registro puedes revisar el
                historial de gastos.
              </Text>
              <Button variant="outlined">
                <Text className="font-bold text-xl">S/. {expensePrice}</Text>
              </Button>
              <Button
                onPress={() => setOpenModal(false)}
                className="rounded-full w-full py-4"
              >
                <Text className=" font-semibold text-white">Aceptar</Text>
              </Button>
            </YStack>
          </LinearGradient>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
