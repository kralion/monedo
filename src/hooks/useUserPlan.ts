import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import { db } from "@/db";
import { payments } from "@/schema";
import { eq, and } from "drizzle-orm";

export const useUserPlan = () => {
  const { user } = useNeonUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const checkPlan = async () => {
      const [data] = await db
        .select({ plan: payments.plan })
        .from(payments)
        .where(
          and(
            eq(payments.user_id, user.id),
            eq(payments.status, "success"),
            eq(payments.plan, "premium"),
          ),
        )
        .limit(1);

      setIsPremium(!!data);
    };

    checkPlan();
  }, [user?.id]);

  const planName = isPremium ? "Premium" : "Free";

  return {
    isPremium,
    planName,
  };
};
