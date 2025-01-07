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
import { useBudgetContext } from "~/context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";

export function Budget({ budget }: { budget: IBudget }) {
  const date = new Date(budget.created_At);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
  const { deleteBudget } = useBudgetContext();

  const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expireDate = expire.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

  const onDelete = () => {
    Alert.alert(
      "¿Estás seguro?",
      "Esta acción eliminará el presupuesto seleccionado y no se puede deshacer", // Message
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => deleteBudget(budget.id),
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
          <View className="card-header flex flex-row justify-between items-center px-2 py-3">
            <View className="card-title flex flex-row items-center gap-2">
              <Image
                width={45}
                height={45}
                source={{
                  uri: "https://img.icons8.com/?size=96&id=ci9FsQ29gcwi&format=png",
                }}
              />
              <View className="card-title-details flex flex-col gap-1">
                <Text className="text-xl">
                  <Animated.Text entering={FadeIn.duration(1500)}>
                    S/. {budget.amount}
                  </Animated.Text>
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Registro : {formattedDate}
                </Text>
              </View>
            </View>
            <View className="card-description flex flex-row items-center justify-between">
              <View className="card-description-amount flex flex-row gap-2 items-center">
                <Text className="font-bold">
                  <Animated.Text entering={FadeIn.duration(1500)}>
                    Exp. {expireDate}
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
      <Separator />
    </Animated.View>

    // {/* <Sheet
    //   zIndex={100_000}
    //   snapPointsMode="fit"
    //   animation="medium"
    //   modal
    //   open={openBudgetDetails}
    //   onOpenChange={setOpenBudgetDetails}
    // >
    //   <Sheet.Handle />
    //   <Sheet.Overlay
    //     animation="100ms"
    //     enterStyle={{ opacity: 0 }}
    //     exitStyle={{ opacity: 0 }}
    //   />
    //   <Sheet.Frame p="$5">
    //     <H3>Detalles</H3>
    //     <Text color="$gray10">
    //       Mostrando información relevante sobre el presupuesto seleccionado.
    //     </Text>

    //     <YStack gap="$4" mt="$5">
    //       <H2>S/. {monto.toFixed(2)}</H2>
    //       <YStack gap="$1">
    //         <Text>Fecha Registro</Text>
    //         <Text fontWeight="bold">
    //           {date.toLocaleDateString("es-ES", {
    //             day: "numeric",
    //             month: "long",
    //             year: "numeric",
    //           })}
    //         </Text>
    //       </YStack>
    //       <YStack gap="$1">
    //         <Text className="font-bold">Fecha Expiración</Text>
    //         <Text fontWeight="bold">
    //           {endDate.toLocaleDateString("es-ES", {
    //             day: "numeric",
    //             month: "long",
    //             year: "numeric",
    //           })}
    //         </Text>
    //       </YStack>
    //       <YStack gap="$1">
    //         <Text>Descripcion</Text>
    //         <Text>{descripcion}</Text>
    //       </YStack>
    //     </YStack>
    //     <Button
    //       my="$5"
    //       size="$5"
    //       bg="$green9Light"
    //       color="$white1"
    //       onPress={() => {
    //         alert("La funcionalidad aun no esta disponible");
    //       }}
    //     >
    //       Editar
    //     </Button>
    //   </Sheet.Frame>
    // </Sheet> */}
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
