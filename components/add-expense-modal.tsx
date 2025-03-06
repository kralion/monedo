import * as React from "react";
import { Image, Platform, StyleSheet, View, useColorScheme } from "react-native";
import type { ConfettiMethods } from "react-native-fast-confetti";
import { Confetti } from "react-native-fast-confetti";
import { AlertDialog, AlertDialogContent } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const styles = StyleSheet.create({
  modalContent: {
    width: "95%",
    maxWidth: 450,
    borderRadius: 20,
    overflow: "hidden",
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
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
  },
});

export default function AddExpenseModal({
  openModal,
  setOpenModal,
  amount,
  category,
  date,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  amount?: number;
  category?: string;
  date?: Date;
}) {
  const confettiRef = React.useRef<ConfettiMethods>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  React.useEffect(() => {
    if (openModal) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [openModal]);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleGoHome = async () => {
    try {
      setIsLoading(true);
      await router.push("/(auth)/(tabs)");
      setOpenModal(false);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnother = () => {
    setOpenModal(false);
    router.push("/(auth)/(modals)/add-expense");
  };

  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent
        className={`p-0 ${isDark ? "bg-gray-900" : "bg-white"}`}
        style={styles.modalContent}
      >
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Button
            variant="ghost"
            size="icon"
            style={styles.closeButton}
            onPress={handleClose}
            accessibilityLabel="Close modal"
            accessibilityHint="Closes the expense added confirmation modal"
          >
            <X size={24} />
          </Button>

          <Confetti
            ref={confettiRef}
            autoplay={true}
            radiusRange={[0, 15]}
            sizeVariation={0.5}
            flakeSize={{ width: 15, height: 10 }}
            count={300}
          />

          <View className="flex flex-col gap-6 pt-6 items-center">
            <Text className="text-2xl font-bold px-6 text-left">
              Gasto Agregado
            </Text>
            <Separator />

            <Image
              style={{ width: 150, height: 150 }}
              className="bg-brand/20 rounded-full p-8"
              source={require("../assets/images/success.png")}
              accessibilityLabel="Success checkmark"
            />

            <Text className="text-xl font-semibold">Registro Exitoso</Text>

            {amount && (
              <Text className="text-2xl font-bold text-primary">
                S/ {amount.toFixed(2)}
              </Text>
            )}

            {(category || date) && (
              <View className="flex flex-row gap-2 items-center">
                {category && (
                  <Text className="text-sm text-muted-foreground">
                    {category}
                  </Text>
                )}
                {date && (
                  <Text className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

            <Text className="text-center leading-6 text-muted-foreground px-6">
              Los gastos están actualizados en real time con tus reportes y
              estadísticas.
            </Text>
            <Text className="text-center text-muted-foreground px-6">
              🚀 Tip: Será bloqueado el creado de gastos si superas tu billetera.
            </Text>
          </View>

          <View className="flex flex-row gap-4 mx-10 mt-6">
            <Button
              size="lg"
              className="flex-1 rounded-full"
              onPress={handleGoHome}
              disabled={isLoading}
              accessibilityLabel="Go to home"
              accessibilityHint="Returns to the main screen"
            >
              <Text>{isLoading ? "Cargando..." : "Ir al Inicio"}</Text>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-full"
              onPress={handleAddAnother}
              accessibilityLabel="Add another expense"
              accessibilityHint="Opens form to add another expense"
            >
              <Text>Agregar Otro</Text>
            </Button>
          </View>
        </Animated.View>
      </AlertDialogContent>
    </AlertDialog>
  );
}
