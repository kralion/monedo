import Yape from "@/components/payment/yape";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import * as React from "react";
import {
  ActivityIndicator,
  Animated as AnimatedRN,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  View,
} from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { toast } from "sonner-native";
import Stripe from "~/components/payment/stripe";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
const width = Dimensions.get("window").width;
interface CarouselItem {
  title: string;
  subtitle: string;
  svgIcon: string;
}
const carouselData: CarouselItem[] = [
  {
    title: "Presupuestos personalizados",
    subtitle: "Crea presupuestos basados en su periodicidad.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=hbqNM94LZdjp&format=png&color=000000",
  },
  {
    title: "Análisis de gastos por categoría",
    subtitle: "Gráficos extra para mantener un seguimiento detallado.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=D0A1Afld5jac&format=png&color=000000",
  },
  {
    title: "Soporte al cliente",
    subtitle: "Prioridad en el soporte al cliente y asistencia.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=C8twQXUl1qoA&format=png&color=000000",
  },
  {
    title: "Perfiles múltiples",
    subtitle: "Perfiles de usuario múltiples para manejar diferentes fuentes.",
    svgIcon:
      "https://img.icons8.com/?size=200&id=28kzIB2E5Rat&format=png&color=000000",
  },
];

const POLAR_CHECKOUT_URL = "https://api.polar.sh/api/v1/checkout/sessions";

export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(true);
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { user } = useUser();
  const baseOptions = {
    vertical: false,
    width: width - 20,
    height: width * 0.6,
  };

  const [value, setValue] = React.useState("yape");
  const screenWidth = Dimensions.get("window").width;
  const animation = useSharedValue(0);
  const handlePress = (index: number) => {
    animation.value = withTiming((index * screenWidth) / 2.3, {
      duration: 300,
    });
  };

  const fadeAnimCard = React.useRef(new AnimatedRN.Value(1)).current;
  const fadeAnimYape = React.useRef(new AnimatedRN.Value(1)).current;
  const { getToken, userId } = useAuth();

  function handleUpgrade() {
    user?.update({
      unsafeMetadata: {
        plan: "premium",
        updatedAt: new Date(),
      },
    });
    toast.success("Plan actualizado");
  }

  React.useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (url.includes("/checkout/success")) {
        try {
          await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({
              public_metadata: { is_premium: true },
            }),
          });

          toast.success("Premium activated!");
          router.back();
        } catch (error) {
          toast.error("Update failed");
        }
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    return () => sub.remove();
  }, []);

  React.useEffect(() => {
    AnimatedRN.timing(fadeAnimCard, {
      toValue: yapePaymentMethod ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [yapePaymentMethod]);

  React.useEffect(() => {
    AnimatedRN.timing(fadeAnimYape, {
      toValue: cardPaymentMethod ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [cardPaymentMethod]);

  const handleYapePayment = () => {
    setYapePaymentMethod(true);
    setCardPaymentMethod(false);
    handlePress(0);
  };
  const handleCardPayment = () => {
    setYapePaymentMethod(false);
    setCardPaymentMethod(true);
    handlePress(1);
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="p-4 bg-white dark:bg-zinc-900"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex flex-col gap-6">
          <View className="flex-1 justify-center">
            <Carousel
              {...baseOptions}
              loop
              autoPlay
              autoPlayInterval={3000}
              data={carouselData}
              onProgressChange={(_, absoluteProgress) => {
                setCurrentIndex(Math.round(absoluteProgress));
              }}
              renderItem={({ item }) => (
                <View className="items-center justify-center px-4">
                  <View className="mb-6">
                    <Image
                      source={{ uri: item.svgIcon }}
                      style={{ width: 150, height: 150 }}
                    />
                  </View>
                  <View className="flex flex-col gap-0 px-4">
                    <Text className="text-xl font-semibold text-center ">
                      {item.title}
                    </Text>
                    <Text className="  text-center text-muted-foreground text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              )}
            />

            <View className="flex-row justify-center items-center h-8">
              {carouselData.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentIndex ? "bg-brand" : "bg-zinc-200"
                  }`}
                />
              ))}
            </View>
          </View>

          <Text className="text-2xl font-bold ">Método de Pago</Text>

          <Tabs
            value={value}
            onValueChange={setValue}
            className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
          >
            <TabsList className="flex-row w-full rounded-xl">
              <TabsTrigger
                onPress={handleYapePayment}
                value="yape"
                className="flex-1 rounded-lg"
              >
                <Text className="text-black dark:text-black">Yape</Text>
              </TabsTrigger>
              <TabsTrigger
                onPress={handleCardPayment}
                value="card"
                className="flex-1 rounded-lg"
              >
                <Text className="text-black dark:text-black">Tarjeta</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yape">
              {yapePaymentMethod && (
                <AnimatedRN.View style={{ opacity: fadeAnimYape }}>
                  <Yape />
                </AnimatedRN.View>
              )}
            </TabsContent>
            <TabsContent value="card">
              {cardPaymentMethod && (
                <AnimatedRN.View style={{ opacity: fadeAnimCard }}>
                  <Stripe />
                </AnimatedRN.View>
              )}
            </TabsContent>
          </Tabs>
        </View>
        <Button
          onPress={() => router.back()}
          size="sm"
          className="mt-4"
          variant="ghost"
        >
          <Text className="text-brand">Quizás más tarde</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
