import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "../ui/text";

type SectionProps = {
  title: string;
  content: string;
};

const Section: React.FC<SectionProps> = ({ title, content }) => {
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const animatedContentStyles = useAnimatedStyle(() => {
    return {
      opacity: rotation.value === 180 ? 1 : 0,
      height: rotation.value === 180 ? "auto" : 0,
    };
  });

  return (
    <View>
      <Pressable
        onPress={() => {
          rotation.value = withTiming(rotation.value === 0 ? 180 : 0, {
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        }}
      >
        <View className="flex flex-row gap-2 items-center justify-between">
          <Text>{title}</Text>
          <Animated.View style={animatedStyles}>
            <FontAwesome name="chevron-down" size={14} color="black" />
          </Animated.View>
        </View>
      </Pressable>
      <Animated.View style={animatedContentStyles}>
        <Text className="text-zinc-500">{content}</Text>
      </Animated.View>
    </View>
  );
};

export default Section;
