import Card from "@/components/dashboard/card";
import { Expense } from "@/components/dashboard/expense";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { useExpenseContext } from "@/context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronUp, Lock, Maximize2, Minimize2 } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  Animated as AnimatedRN,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Home() {
  const fadeAnim = React.useRef(new AnimatedRN.Value(1)).current;
  const { expenses, getExpensesByUser } = useExpenseContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, isSignedIn } = useUser();
  const { has } = useAuth();
  const [showAll, setShowAll] = React.useState(false);
  const [showBuyPremiumModal, setShowBuyPremiumModal] = React.useState(false);
  if (!user) {
    return null;
  }

  React.useEffect(() => {
    AnimatedRN.timing(fadeAnim, {
      toValue: showAll ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [showAll]);

  React.useEffect(() => {
    setIsLoading(true);
    getExpensesByUser(user.id);
    setIsLoading(false);
  }, [expenses, user]);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(scrollRef);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHandler.value > 5 ? withTiming(1) : withTiming(0),
    };
  });
  function scrollToTop() {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
  }

  return (
    <View>
      {showAll ? (
        //TODO: Change the opacity to another value, primarily it was fadeAnim but it was causing bugs
        <Animated.View style={{ opacity: 80 }}>
          <SafeAreaView
            style={{
              paddingTop: 14,
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            <View className="flex flex-col gap-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-3xl font-bold">Gastos Recientes</Text>
                <Button
                  onPress={() => {
                    setShowAll(false);
                  }}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Minimize2 color="black" size={20} />
                </Button>
              </View>
              <ScrollView className="h-screen-safe">
                <FlashList
                  data={expenses}
                  estimatedItemSize={200}
                  renderItem={({ item: expense }) => (
                    <Expense expense={expense} />
                  )}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            className={`pt-16  rounded-b-3xl
             bg-${
               has?.({ permission: "premium:plan" }) ? "yellow-500" : "primary"
             }

              `}
          >
            <View className="flex flex-row justify-between items-center px-4">
              <View className="flex flex-col">
                <Text className="text-sm">
                  {capitalizeFirstLetter(
                    new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  )}
                </Text>
                <Text className="font-bold text-xl">
                  Hola, {user?.firstName} 👋
                </Text>
              </View>

              <Button
                onPress={() => router.push("/(modals)/buy-premium")}
                size="icon"
                className="rounded-full bg-green-200 active:opacity-80"
              >
                <Lock color="black" size={20} />
              </Button>
            </View>
            <Card />
            <View style={{ height: 160 }} />
          </View>

          <ScrollView ref={scrollRef} className="px-4 h-screen-safe ">
            <View>
              <View className="flex flex-row justify-between items-center pt-32 px-4 w-full pb-8">
                <Text className="text-2xl font-bold">Gastos Recientes</Text>

                <Button
                  onPress={() => {
                    setShowAll(true);
                  }}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Maximize2 color="black" size={20} />
                </Button>
              </View>

              {isLoading && <ActivityIndicator size="large" className="mt-5" />}
              <FlashList
                data={expenses}
                estimatedItemSize={200}
                renderItem={({ item: expense }) => (
                  <Expense expense={expense} />
                )}
              />
            </View>
          </ScrollView>
          <Animated.View
            style={[
              buttonStyle,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              },
            ]}
          >
            <Button
              style={{ borderRadius: 20, padding: 10 }}
              onPress={scrollToTop}
            >
              <ChevronUp />
            </Button>
          </Animated.View>
        </>
      )}
    </View>
  );
}
