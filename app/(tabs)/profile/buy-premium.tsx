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
export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(false);
  const width = Dimensions.get("window").width;
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(true);
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
  const scrollOffsetValue = useSharedValue<number>(0);
  const defaultDataWith6Colors = [
    "#B0604D",
    "#899F9C",
    "#B3C680",
    "#5C6265",
    "#F5D399",
    "#F1F1F1",
  ];

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
        <View className="flex flex-col gap-6">
          <View id="carousel-component">
            <Carousel
              loop
              width={430}
              height={width / 2}
              defaultScrollOffsetValue={scrollOffsetValue}
              data={defaultDataWith6Colors}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => console.log("current index:", index)}
              renderItem={({ index }) => (
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/29683927/pexels-photo-29683927/free-photo-of-historic-courtyard-architecture-in-arequipa-peru.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load",
                  }}
                  style={{ width: width, height: width / 2 }}
                />
              )}
            />
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
                <Text>Tarjeta</Text>
              </TabsTrigger>
              <TabsTrigger
                onPress={handleYapePayment}
                value="yape"
                className="flex-1 rounded-lg"
              >
                <Text>Yape</Text>
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
