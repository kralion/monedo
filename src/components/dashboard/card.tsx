import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function Card() {
  const { user } = useNeonUser();
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { totalIncome, getTotalIncome } = useIncomeStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      sumOfAllOfExpenses(user.id);
      getTotalIncome(user.id);
    }
  }, [user?.id]);

  const balance = totalIncome - totalExpenses;

  const gradient =
    balance < 0
      ? "linear-gradient(135deg, #FF0000, #FF7F7F)"
      : "linear-gradient(135deg, #14B8A6, #0F766E)";

  const CardContent = (
    <div
      className="relative w-full max-w-md mx-auto my-6 h-[200px] md:h-[220px] md:rounded-2xl rounded-xl p-4 flex flex-col justify-between  border border-black/10 shadow-xl"
      style={{ background: gradient }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl text-white">Balance</h2>
          <p className="text-4xl font-bold text-white">
            S/. {isVisible ? balance.toFixed(2) : "*".repeat(8)}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-white hover:bg-white/20 hover:text-white"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center">
            <ArrowDown className="text-white w-4 h-4" />
            <span className="text-white ">Gastos</span>
          </div>
          <p className="md:text-xl text-lg text-white ">
            S/. {isVisible ? totalExpenses.toFixed(2) : "*".repeat(8)}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex flex-row gap-1 items-center">
            <ArrowUp className="text-white w-4 h-4" />
            <span className="text-white ">Ingresos</span>
          </div>
          <p className="md:text-xl text-lg text-white">
            S/. {isVisible ? totalIncome.toFixed(2) : "*".repeat(8)}
          </p>
        </div>
      </div>
    </div>
  );

  return <div className="cursor-default">{CardContent}</div>;
}
