import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { X } from "lucide-react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  Animated as AnimatedRN,
  Dimensions,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(false);
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(true);
  const screenWidth = Dimensions.get("window").width;
  const { user: userData } = useUser();
  const { has } = useAuth();

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
    <ScrollView>
      <SafeAreaView className="p-4 flex-1">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-4xl">Información de Compra</Text>
            <Button variant="ghost" onPress={() => router.back()} size="icon">
              <X size="$1" />
            </Button>
          </View>

          <View className="flex flex-row gap-2 items-center">
            <Avatar alt="profile" className="bg-teal-600 w-36 h-36">
              <AvatarImage
                accessibilityLabel="avatar"
                src={userData?.imageUrl}
                style={{
                  borderRadius: 100,
                  width: 100,
                  height: 100,
                }}
              />
              <AvatarFallback className="bg-slate-500" />
            </Avatar>
            <View className="flex flex-col gap-4">
              <Text className="font-bold text-4xl">
                {userData?.firstName} {userData?.lastName}
              </Text>
              <Button
                disabled={!has?.({ permission: "free:plan" })}
                size="lg"
                className={`
                  ${
                    has?.({ permission: "free:plan" })
                      ? "bg-orange-10"
                      : "bg-green-900"
                  }
                  text-white
                  `}
              >
                {has?.({ permission: "free:plan" })
                  ? "Cuenta Premium"
                  : "Cuenta Free"}
              </Button>
            </View>
          </View>
          {/* <Separator borderColor="$gray5" /> */}

          <Text className="text-3xl ">Método de Pago</Text>
          <View className="flex flex-row gap-2 items-center">
            <View className="flex flex-row gap-2 items-center">
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 4,
                    left: 4,
                    width: "50%",
                    borderRadius: 7,
                    height: "100%",
                  },
                  useAnimatedStyle(() => {
                    return {
                      transform: [{ translateX: animation.value }],
                    };
                  }),
                ]}
              />
              <Button
                className="w-1/2 p-2"
                variant="ghost"
                onPress={handleCardPayment}
              >
                Tarjeta Bancaria
              </Button>
              <Button
                className="w-1/2 p-2"
                variant="ghost"
                onPress={handleYapePayment}
              >
                Yape
              </Button>
            </View>

            {cardPaymentMethod ? (
              <AnimatedRN.View style={{ opacity: fadeAnimCard }}>
                <Stripe />
              </AnimatedRN.View>
            ) : (
              <AnimatedRN.View style={{ opacity: fadeAnimYape }}>
                <Yape />
              </AnimatedRN.View>
            )}
          </View>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
