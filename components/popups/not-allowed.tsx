import UpgradeAsset from "@/assets/svgs/unlock.svg";
import { X } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as React from "react";
import { Button, Dialog, H3, Text, YStack } from "tamagui";
type NotAllowedProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotAllowedModal({
  openModal,
  setOpenModal,
}: NotAllowedProps) {
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
                onPress={() => {
                  setOpenModal(false);
                }}
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
            <YStack gap="$4" alignItems="center">
              <YStack space={7} alignItems="center">
                <UpgradeAsset width={200} height={220} />
                <H3 fontWeight="bold">Desbloquea Ahora</H3>
                <Text>
                  Esta funcionalidad está{" "}
                  <Text fontWeight="bold">disponible</Text> en el plan{" "}
                  <Text fontWeight="bold">Premium</Text>.
                </Text>
                <Text className="italic text-center">
                  ¡Mejora tu experiencia hoy! y sacale el máximo provecho a la
                  applicación.
                </Text>
              </YStack>
              <YStack space={3}>
                <Button
                  size="$5"
                  bg="$green9Light"
                  color="$white1"
                  onPress={() => {
                    setOpenModal(false), router.push("/(modals)/buy-premium");
                  }}
                >
                  <Text className="font-semibold  ">Adquiere Premium</Text>
                </Button>
              </YStack>
            </YStack>
          </LinearGradient>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
