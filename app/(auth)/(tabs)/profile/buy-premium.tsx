import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { Image } from "expo-image";
import * as React from "react";
import {
  Animated as AnimatedRN,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
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

export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(false);
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const baseOptions = {
    vertical: false,
    width: width - 20,
    height: width * 0.7,
  };

  const [value, setValue] = React.useState("card");
  const screenWidth = Dimensions.get("window").width;
  const animation = useSharedValue(0);
  const handlePress = (index: number) => {
    animation.value = withTiming((index * screenWidth) / 2.3, {
      duration: 300,
    });
  };

  const fadeAnimCard = React.useRef(new AnimatedRN.Value(1)).current;
  const fadeAnimYape = React.useRef(new AnimatedRN.Value(1)).current;
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
    handlePress(1);
  };
  const handleCardPayment = () => {
    setYapePaymentMethod(false);
    setCardPaymentMethod(true);
    handlePress(0);
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="p-4 bg-white dark:bg-zinc-900 web:md:w-1/2 mx-auto"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex flex-col gap-6">
          <View className="flex-1 justify-center">
            <Carousel
              {...baseOptions}
              loop
              autoPlay
              style={{
                backgroundColor: "#ecf0f1",
                borderRadius: 10,
                paddingTop: 10,
              }}
              autoPlayInterval={3000}
              data={carouselData}
              onProgressChange={(_, absoluteProgress) => {
                setCurrentIndex(Math.round(absoluteProgress));
              }}
              renderItem={({ item }) => (
                <View className="items-center justify-center p-4">
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
                onPress={handleCardPayment}
                value="card"
                className="flex-1 rounded-lg"
              >
                <Text className="text-black dark:text-black">Tarjeta</Text>
              </TabsTrigger>
              <TabsTrigger
                onPress={handleYapePayment}
                value="yape"
                className="flex-1 rounded-lg"
              >
                <Text className="text-black dark:text-black">Yape</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="card">
              {cardPaymentMethod && (
                <AnimatedRN.View style={{ opacity: fadeAnimCard }}>
                  <Stripe />
                </AnimatedRN.View>
              )}
            </TabsContent>
            <TabsContent value="yape">
              {yapePaymentMethod && (
                <AnimatedRN.View style={{ opacity: fadeAnimYape }}>
                  <Yape />
                </AnimatedRN.View>
              )}
            </TabsContent>
          </Tabs>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
