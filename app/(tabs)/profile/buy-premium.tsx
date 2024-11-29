import Stripe from "@/components/payment/stripe";
import Yape from "@/components/payment/yape";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  Animated as AnimatedRN,
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
export default function BuyPremiumModal() {
  const [yapePaymentMethod, setYapePaymentMethod] = React.useState(false);
  const [cardPaymentMethod, setCardPaymentMethod] = React.useState(true);
  const [value, setValue] = React.useState("card");
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
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView className="px-4" style={{ paddingTop: headerHeight + 16 }}>
      <View className="flex flex-col gap-6 ">
        <View className="flex flex-row gap-4 items-center">
          <Avatar alt="profile" className="bg-teal-600 w-32 h-32">
            <AvatarImage
              accessibilityLabel="avatar"
              source={{ uri: userData?.imageUrl }}
            />
            <AvatarFallback className="bg-slate-500" />
          </Avatar>
          <View className="flex flex-col gap-2">
            <Text className="font-bold text-xl">
              {userData?.firstName} {userData?.lastName}
            </Text>
            <Badge
              className={`
                  ${
                    has?.({ permission: "free:plan" })
                      ? "bg-primary"
                      : "bg-orange-500"
                  }
                  text-white py-2
                  `}
            >
              <Text className="text-md">
                {has?.({ permission: "free:plan" })
                  ? "Cuenta Premium"
                  : "Cuenta Free"}
              </Text>
            </Badge>
          </View>
        </View>
        <Separator className="text-gray-500" />
        <Text className="text-2xl font-bold ">Método de Pago</Text>
        <Tabs
          value={value}
          onValueChange={setValue}
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full rounded-lg">
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
  );
}
