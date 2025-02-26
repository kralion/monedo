import { Skeleton } from "moti/skeleton";
import { useWindowDimensions, View } from "react-native";

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const ChartSkeleton = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const skeletonHeight = isMobile ? 300 : 350;
  
  return (
    <View className="items-center web:md:w-full">
      <View className="web:md:max-w-3xl web:md:w-full">
        <Skeleton.Group show={true}>
          <Skeleton height={skeletonHeight} width="100%" {...SkeletonCommonProps} />
        </Skeleton.Group>
      </View>
    </View>
  );
};
