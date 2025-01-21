import { Skeleton } from "moti/skeleton";
import { View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const PieSkeleton = () => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex-1 items-center justify-center">
      <Skeleton.Group show={true}>
        <Skeleton
          height={300}
          colorMode={isDarkColorScheme ? "dark" : "light"}
          radius={300}
          width="80%"
          {...SkeletonCommonProps}
        />
      </Skeleton.Group>
    </View>
  );
};
