import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useBudgetStore } from "@/stores/budget";
import { useExpenseStore } from "@/stores/expense";
import { Button } from "../ui/button";
import { useEffect } from "react";

export default function Card() {
  const { planName, isPremium } = useUserPlan();
  const { user } = useNeonUser();
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
      className="relative w-full max-w-md mx-auto my-6 h-[200px] md:h-[220px] rounded-2xl p-4 flex flex-col justify-between  border border-black/10 shadow-xl"
      style={{ background: gradient }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl text-white">Balance</h2>
          <p className="text-4xl font-bold text-white">
            S/. {balance.toFixed(2)}
          </p>
        </div>
        {!isPremium && (
          <Button size="sm" className="rounded-full bg-orange-500">
            <span className="text-white">Cuenta {planName}</span>
          </Button>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center">
            <ArrowDownCircle className="text-white w-4 h-4" />
            <span className="text-white ">Gastos</span>
          </div>
          <p className="text-xl text-white ">S/ {totalExpenses.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex flex-row gap-1 items-center">
            <ArrowUpCircle className="text-white w-4 h-4" />
            <span className="text-white ">Billetera</span>
          </div>
          <p className="text-xl text-white">S/ {totalBudget.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  return <div className="cursor-default">{CardContent}</div>;
}
