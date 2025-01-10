import { IBudget } from "@/interfaces";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ChevronRight, Trash } from "lucide-react-native";
import * as React from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  default as Animated,
  FadeIn,
  default as Reanimated,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import { useBudgetStore } from "~/stores/budget";

export function Budget({ budget }: { budget: IBudget }) {
  const date = new Date(budget.created_At);
  const [isVisible, setIsVisible] = React.useState(true);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const { deleteBudget } = useBudgetStore();

  const onDelete = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará el presupuesto seleccionado y no se puede deshacer",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            setIsVisible(false);
            await new Promise((resolve) => setTimeout(resolve, 200));
            deleteBudget(budget.id);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const RightAction = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 200 }],
    }));
    return (
      <Pressable
        onPress={() => {
          if (process.env.EXPO_OS === "ios") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          onDelete();
        }}
      >
        <Reanimated.View style={[styleAnimation, styles.rightAction]}>
          <Trash color="white" size={24} />
        </Reanimated.View>
      </Pressable>
    );
  };
  if (!isVisible) {
    return null;
  }
  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <ReanimatedSwipeable
        key={budget.id}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        overshootRight={false}
        enableContextMenu
      >
        <TouchableOpacity
          onPress={() => {
            router.push(`/wallet/details/${budget.id}`);
          }}
          className="card active:opacity-80"
        >
          <View className="card-header flex flex-row justify-between items-center  py-3">
            <View className="card-title flex flex-row items-center gap-2">
              <Image
                width={45}
                height={45}
                className="bg-brand/20 rounded-full p-2"
                source={{
                  uri: "https://img.icons8.com/?size=100&id=yUTNKgUuTlsA&format=png&color=000000",
                }}
              />
              <View className="card-title-details flex flex-col gap-1">
                <Text className="text-lg">
                  <Animated.Text entering={FadeIn.duration(1500)}>
                    {budget.description.length > 25
                      ? `${budget.description.slice(0, 25)}...`
                      : budget.description}
                  </Animated.Text>
                </Text>
                <Text className="text-muted-foreground dark:text-secondary text-sm">
                  {formattedDate}
                </Text>
              </View>
            </View>
            <View className="card-description flex flex-row items-center justify-between">
              <View className=" flex flex-row items-center">
                <Text className="font-bold text-xl text-brand dark:text-brand">
                  <Animated.Text entering={FadeIn.duration(1500)}>
                    + S/. {budget.amount}
                  </Animated.Text>
                </Text>
                <Button variant="ghost" size="icon">
                  <ChevronRight size={20} color="gray" />
                </Button>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
      <Separator className="bg-zinc-200 dark:bg-zinc-800 " />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    width: 200,
    height: 70,
    backgroundColor: "#FF3F3F",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeable: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#FF0000",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  textContent: {
    flexShrink: 1,
  },
  productCount: {
    fontSize: 12,
    color: "gray",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nicknameContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  nicknameCircle: {
    fontSize: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 16,
    padding: 1,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  ellipsisCircle: {
    lineHeight: 0,
    marginLeft: -6,
  },
});
