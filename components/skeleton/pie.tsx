import { Skeleton } from "moti/skeleton";
import { View, useWindowDimensions } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

const SkeletonCommonProps = {
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const PieSkeleton = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Adjust size based on screen width
  const skeletonSize = isMobile ? 300 : 350;
  const skeletonWidth = isMobile ? "80%" : "60%";
  
  return (
    <View className="flex-1 items-center justify-center">
      <View className="web:md:max-w-2xl web:md:w-full items-center">
        <Skeleton.Group show={true}>
          <Skeleton
            height={skeletonSize}
            colorMode={isDarkColorScheme ? "dark" : "light"}
            radius={skeletonSize}
            width={skeletonWidth}
            {...SkeletonCommonProps}
          />
        </Skeleton.Group>
      </View>
    </View>
  );
};
