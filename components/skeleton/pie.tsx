import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const PieSkeleton = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Skeleton.Group show={true}>
        <Skeleton
          height={250}
          radius={300}
          width="65%"
          {...SkeletonCommonProps}
        />
      </Skeleton.Group>
    </View>
  );
};
