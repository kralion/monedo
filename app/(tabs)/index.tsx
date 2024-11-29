import Card from "@/components/dashboard/card";
import NoDataSvg from "@/assets/svgs/no-data.svg";
import { Expense } from "@/components/dashboard/expense";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { useExpenseContext } from "@/context";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import {
  ChevronUp,
  ListCollapse,
  Loader,
  Lock,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
} from "lucide-react-native";
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
import { createClerkSupabaseClient } from "~/lib/supabase";
import { IExpense, IExpenseGET } from "~/interfaces";

export default function Home() {
  const fadeAnim = React.useRef(new AnimatedRN.Value(1)).current;
  const { expenses } = useExpenseContext();
  const { user, isSignedIn } = useUser();
  const [showAll, setShowAll] = React.useState(false);
  const [showBuyPremiumModal, setShowBuyPremiumModal] = React.useState(false);
  const supabase = createClerkSupabaseClient();
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
                  <Minimize2 size={20} />
                </Button>
              </View>
              <ScrollView className="h-screen-safe">
                {expenses && expenses.length > 0 ? (
                  <FlashList
                    data={expenses}
                    estimatedItemSize={200}
                    renderItem={({ item: expense }) => (
                      <Expense expense={expense} />
                    )}
                  />
                ) : (
                  <ActivityIndicator size="large" className="mx-auto mt-5" />
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            className="pt-16 bg-green-500 rounded-b-3xl"
            // bg="$green9Light" TODO: change color to yellow bg="yellow10Light"
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
              <BuyPremiumModal
                setOpenModal={setShowBuyPremiumModal}
                openModal={showBuyPremiumModal}
              />
              <Button
                onPress={() => {
                  setShowBuyPremiumModal(true);
                }}
                size="icon"
                className="rounded-full bg-green-200 active:opacity-80"
              >
                <Lock size={20} />
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
                  <Maximize2 size={20} />
                </Button>
              </View>

              {expenses && expenses.length > 0 ? (
                <FlashList
                  data={expenses}
                  estimatedItemSize={200}
                  renderItem={({ item: expense }) => (
                    <Expense expense={expense} />
                  )}
                />
              ) : (
                // <View className="flex flex-col items-center justify-center mt-5 gap-5">
                //   <NoDataSvg width={200} height={200} />
                //   <View>
                //     <Text className="text-center text-xl text-muted-foreground">
                //       No tienes gastos aún
                //     </Text>
                //     <Text className="text-center text-sm text-muted-foreground">
                //       Añade un gasto haciendo tap en el botón "+"
                //     </Text>
                //   </View>
                // </View>
                <ActivityIndicator size="large" className="mt-5" />
              )}
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
