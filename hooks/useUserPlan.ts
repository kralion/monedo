import { useUser } from "@clerk/clerk-expo";

export const useUserPlan = () => {
  const { user } = useUser();

  const isPremium = user?.unsafeMetadata.plan === "premium";
  const planName = isPremium ? "Premium" : "Free";

  return {
    isPremium,
    planName,
  };
};
