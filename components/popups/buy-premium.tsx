import BuyPremiumAsset from "@/assets/svgs/buy-premium.svg";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const styles = StyleSheet.create({
  modalContent: {
    width: "95%", // Adjust as needed
    height: "80%", // Adjust as needed
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

export default function BuyPremiumModal({openModal, setOpenModal}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent className="p-0 " style={styles.modalContent}>
        <LinearGradient
          colors={["#41D29B", "#2E9B70"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View className="flex flex-col gap-6 items-center pt-10">
            <BuyPremiumAsset width={180} height={200} />
            <Text className="text-3xl font-bold">Desbloquea Premium</Text>
            <Text className="text-center leading-6">
              Actualiza a <Text className="font-bold">Premium</Text> para
              obtener funciones exclusivas y una experiencia mejorada.{" "}
            </Text>
            <Text className="text-center italic leading-5">
              ¡Maximiza tu potencial con{" "}
              <Text className="font-bold">Monedo</Text>! 🚀
            </Text>
          </View>
          <View className="px-6 mt-6 w-full">
            <Link href="/(modals)/buy-premium" asChild>
              <Button
                size="lg"
                onPress={() => {
                  router.push("/(modals)/buy-premium");
                }}
              >
                <Text>Adquirir Premium</Text>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full mt-4 border-white"
              onPress={() => {
                setOpenModal(false);
                router.push("/(tabs)");
              }}
            >
              <Text>Quizá más tarde</Text>
            </Button>
          </View>
        </LinearGradient>
      </AlertDialogContent>
    </AlertDialog>
  );
}
