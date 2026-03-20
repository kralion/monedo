import { useUser } from "@clerk/clerk-react";

export const useUserPlan = () => {
  const { user } = useUser();

  const isPremium =
    (user?.unsafeMetadata?.plan as string) === "premium" ||
    (user?.publicMetadata?.is_premium as boolean) === true;
  const planName = isPremium ? "Premium" : "Free";

  return {
    isPremium,
    planName,
  };
};
