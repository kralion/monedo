import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Confetti, ConfettiMethods } from "react-native-fast-confetti";
import { Text } from "~/components/ui/text";
import { usePaymentStore } from "~/stores/payment";

export default function Layout() {
  const confettiRef = useRef<ConfettiMethods>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isPayed, setIsPayed } = usePaymentStore();

  useEffect(() => {
    if (isPayed) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setIsPayed(false); // Reset the isPayed state after animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isPayed, setIsPayed]);

  return (
    <View className="flex-1">
      {showConfetti && (
        <Confetti
          ref={confettiRef}
          autoplay={true}
          radiusRange={[0, 15]}
          fallDuration={4000}
          sizeVariation={0.5}
          flakeSize={{ width: 15, height: 10 }}
          count={500}
        />
      )}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/add-expense"
          options={({ route }) => {
            const { id } = route.params as { id: number };
            return {
              title: id ? "Editar Gasto" : "Nuevo Gasto",
              presentation: "modal",
              headerLeft: () => (
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Text className="text-primary text-xl">Cancelar</Text>
                </TouchableOpacity>
              ),
            };
          }}
        />
        <Stack.Screen
          name="(modals)/details/[id]"
          options={{
            title: "Detalles",
            headerBackTitle: "Atrás",
            headerBlurEffect: Platform.OS === "ios" ? "regular" : "none",
            headerTransparent: Platform.OS === "ios" ? false : true,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="(modals)/buy-premium"
          options={{
            presentation: "modal",
            title: "Adquirir Premium",
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
