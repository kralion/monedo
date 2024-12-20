import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const BudgetSkeleton = () => {
  return (
    <View>
      <Skeleton.Group show={true}>
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row gap-3 items-center">
            <Skeleton
              radius={10}
              height={40}
              width={40}
              {...SkeletonCommonProps}
            />
            <View className="flex flex-col gap-2">
              <Skeleton height={20} width={80} {...SkeletonCommonProps} />
              <Skeleton height={15} width={100} {...SkeletonCommonProps} />
            </View>
            <View />
          </View>
          <View className="mr-10">
            <Skeleton height={30} width={90} {...SkeletonCommonProps} />
          </View>
        </View>
      </Skeleton.Group>
    </View>
  );
};
