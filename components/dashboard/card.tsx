import { Link } from "@tanstack/react-router";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useEffect } from "react";

export default function Card() {
  const { planName, isPremium } = useUserPlan();
  const { user } = useUser();
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { totalBudget, isOutOfBudget, getTotalBudget } = useBudgetStore();

  useEffect(() => {
    if (user?.id) {
      sumOfAllOfExpenses(user.id);
      getTotalBudget(user.id);
    }
  }, [user?.id]);

  const balance = totalBudget - totalExpenses;

  const gradient = isOutOfBudget
    ? "linear-gradient(135deg, #FF0000, #FF7F7F)"
    : isPremium
    ? "linear-gradient(135deg, #000000, #353535, #000000)"
    : "linear-gradient(135deg, #10B981, #047857)";

  const CardContent = (
      <div
        className="relative w-full max-w-md mx-auto my-6 h-[200px] md:h-[220px] rounded-2xl p-4 flex flex-col justify-between shadow-lg border border-black/10"
        style={{ background: gradient }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <Text className="text-xl text-white md:text-2xl">Balance</Text>
            <Text className="text-4xl text-white font-bold md:text-5xl">
              S/ {balance}
            </Text>
          </div>
          {!isPremium && (
            <Button size="sm" className="rounded-full bg-orange-500">
              <Text className="text-white">Cuenta {planName}</Text>
            </Button>
          )}
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-1 items-center">
              <ArrowDownCircle className="text-white w-4 h-4" />
              <Text className="text-white md:text-lg">Gastos</Text>
            </div>
            <Text className="text-xl text-white md:text-2xl">
              S/ {totalExpenses}
            </Text>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex flex-row gap-1 items-center">
              <ArrowUpCircle className="text-white w-4 h-4" />
              <Text className="text-white md:text-lg">Billetera</Text>
            </div>
            <Text className="text-xl text-white md:text-2xl">
              S/ {totalBudget}
            </Text>
          </div>
        </div>
      </div>
  );

  return isPremium ? (
    <div className="cursor-default">{CardContent}</div>
  ) : (
    <Link to="/buy-premium">{CardContent}</Link>
  );
}
