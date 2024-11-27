import { X } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import * as React from "react";
import { Button, Dialog, H3, Text, YStack } from "tamagui";

type TNotification = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
};

export function BudgetLimitExceededModal({
  setShowModal,
  showModal,
}: TNotification) {
  return (
    <Dialog modal open={false}>
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
                onPress={() => {
                  setShowModal(false);
                }}
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
            <YStack gap="$4" alignItems="center">
              {/* <BuyPremiumAsset width={200} height={220} /> */}
              <H3>Presupuesto Excedido</H3>
              <Text>
                Parece que ya has gastado todo el monto presupuesto para este
                mes.
              </Text>
            </YStack>
            <YStack gap="$4">
              <Link href="/(modals)/buy-premium" asChild>
                <Button
                  mt="$5"
                  height={12}
                  onPress={() => {
                    setShowModal(false), router.push("/(modals)/buy-premium");
                  }}
                >
                  <Text className="font-semibold  ">Ver Estadísticas</Text>
                </Button>
              </Link>
            </YStack>
          </LinearGradient>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
