import { useUser } from "@clerk/clerk-expo";

export const useUserPlan = () => {
  const { user } = useUser();

  const isPremium = user?.publicMetadata.plan === "premium";
  const planName = isPremium ? "Premium" : "Free";

  return {
    isPremium,
    planName,
  };
};
