import React from "react";
import { Dimensions, Platform, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TOP_VALUE = Platform.OS === "ios" ? 60 : 20;

type TToast = {
  message: string;
  visible: boolean;
  type?: string;
};

const Toast = ({ message, visible, type = "info" }: TToast) => {
  const toastTopPosition = useSharedValue(-Dimensions.get("window").height); // Start off-screen

  if (visible) {
    toastTopPosition.value = withTiming(40, { duration: 500 }); // Animate to visible position
    setTimeout(() => {
      toastTopPosition.value = withTiming(-Dimensions.get("window").height, {
        duration: 500,
      }); // Animate back off-screen
    }, 2000); // Show for 2 seconds
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: toastTopPosition.value,
    };
  });

  return (
    <Animated.View
      className={`
        absolute left-1/2 transform -translate-x-1/2 rounded-lg min-w-[300px] border  p-2 z-10
        ${type === "success" && "bg-green-100 border-green-200"}
        ${type === "error" && "bg-red-100 border-red-200"}
        ${type === "warning" && "bg-yellow-100 border-yellow-200"}
        ${type === "info" && "bg-blue-100 border-blue-200"}
        top-${TOP_VALUE}
        `}
      style={[animatedStyle]}
    >
      <Text
        className={`
        text-center
          ${type === "success" && "text-green-500"}
          ${type === "error" && "text-red-500"}
          ${type === "warning" && "text-yellow-500"}
          ${type === "info" && "text-blue-500"}
        `}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export default Toast;
