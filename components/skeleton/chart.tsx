import { Skeleton } from "moti/skeleton";

const SkeletonCommonProps = {
  colorMode: "light",
  transition: {
    type: "timing",
    duration: 1000,
  },
} as const;

export const ChartSkeleton = () => {
  return (
    <Skeleton.Group show={true}>
      <Skeleton height={300} width="100%" {...SkeletonCommonProps} />
    </Skeleton.Group>
  );
};
