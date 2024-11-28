import Card from "@/components/dashboard/card";
import { Expense } from "@/components/dashboard/expense";
import BuyPremiumModal from "@/components/popups/buy-premium";
import { useExpenseContext } from "@/context";
import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronUp, Loader, Lock } from "lucide-react-native";
import * as React from "react";
import { Animated as AnimatedRN, ScrollView, View } from "react-native";
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
  const { getExpensesByUser, expenses } = useExpenseContext();
  const { user: userData, isSignedIn } = useUser();
  const [showAll, setShowAll] = React.useState(false);
  const [showBuyPremiumModal, setShowBuyPremiumModal] = React.useState(false);
  // REVIEW: CODE fot the user with expenses '9e683f71-8a18-4a91-a596-c956813405e9'
  if (!userData) {
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

  React.useEffect(() => {
    if (userData) {
      getExpensesByUser(userData.id);
    }
  }, [userData, getExpensesByUser, expenses]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
  }

  return (
    <View>
      {showAll ? (
        <Animated.View style={{ opacity: fadeAnim }}>
          <SafeAreaView
            style={{
              paddingTop: 14,
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            <View className="flex flex-col gap-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-semibold">Gastos Recientes</Text>
                <Text
                  onPress={() => {
                    setShowAll(false);
                  }}
                  className="active:opacity-80"
                >
                  Ver Menos
                </Text>
              </View>
              <ScrollView>
                <FlashList
                  data={expenses}
                  estimatedItemSize={50}
                  renderItem={({ item: expense }) => {
                    return <Expense expense={expense} />;
                  }}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <>
          <View
            className="pt-10 bg-green-500 rounded-b-2xl"
            // bg="$green9Light" TODO: change color to yellow bg="yellow10Light"
          >
            <View className="flex flex-row justify-between px-4 mx-4">
              <View className="flex flex-col">
                <Text className="text-2xl">
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
                  Hola, {userData?.firstName} 👋
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
                <Lock size="$1" />{" "}
              </Button>
            </View>
            <Card />
            <View style={{ height: 160 }} />
          </View>

          <ScrollView
            ref={scrollRef}
            style={{ paddingHorizontal: 5, zIndex: -10 }}
          >
            <View className="flex flex-col gap-4 pb-5">
              <View className="flex flex-row justify-between items-center pt-12 px-4">
                <Text className="text-xl font-semibold">
                  Historial de Gastos
                </Text>

                <Text
                  onPress={() => {
                    setShowAll(true);
                  }}
                  className="active:opacity-80"
                >
                  Ver Todo
                </Text>
              </View>
              {expenses && expenses.length === 0 && (
                <View className="flex flex-col items-center justify-center min-h-100">
                  <Loader className="animate-spin" size={24} />
                  <Text className="text-foreground">Cargando...</Text>
                </View>
              )}

              <FlashList
                data={expenses}
                estimatedItemSize={50}
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
