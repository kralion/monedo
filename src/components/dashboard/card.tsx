import { ArrowDown, ArrowUp, Eye, Menu, RotateCcw } from "lucide-react";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { useBalanceAdjustmentStore } from "@/stores/balance-adjustment";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BalanceAdjustmentDialog } from "./balance-adjustment-dialog";

export function CardSkeleton() {
  return (
    <Skeleton className="w-full max-w-md mx-auto my-6 h-[200px] md:h-[220px] rounded-xl md:rounded-2xl" />
  );
}

export default function Card() {
  const { user } = useNeonUser();
  const { sumOfAllOfExpenses, totalExpenses } = useExpenseStore();
  const { totalIncome, getTotalIncome } = useIncomeStore();
  const { balanceAdjustment, getBalanceAdjustment } = useBalanceAdjustmentStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRebalanceDialog, setShowRebalanceDialog] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);
    Promise.all([
      sumOfAllOfExpenses(user.id),
      getTotalIncome(user.id),
      getBalanceAdjustment(user.id),
    ]).finally(() => setIsLoading(false));
  }, [user?.id, sumOfAllOfExpenses, getTotalIncome, getBalanceAdjustment]);

  const balance = totalIncome - totalExpenses;
  const adjustedBalance = balance + balanceAdjustment;

  const gradient =
    adjustedBalance < 0
      ? "linear-gradient(135deg, #FF0000, #FF7F7F)"
      : "linear-gradient(135deg, #14B8A6, #0F766E)";

  if (isLoading) {
    return <CardSkeleton />;
  }

  const CardContent = (
    <div
      className="relative w-full max-w-md mx-auto my-6 h-[200px] md:h-[220px] md:rounded-2xl rounded-xl p-4 flex flex-col justify-between  border border-black/10 shadow-xl"
      style={{ background: gradient }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl text-white">Balance</h2>
          <p className="text-4xl font-bold text-white">
            S/. {isVisible ? adjustedBalance.toFixed(2) : "*".repeat(8)}
          </p>
          {balanceAdjustment !== 0 && (
            <span className="text-xs text-white/80 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reajuste: {balanceAdjustment > 0 ? "+" : ""}{balanceAdjustment.toFixed(2)}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-white hover:bg-white/20 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsVisible(!isVisible)}>
              <Eye className="w-4 h-4" />
              Ver cifras
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowRebalanceDialog(true)}
              className="text-primary focus:text-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Rebalance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center">
            <ArrowDown className="text-white w-4 h-4" />
            <span className="text-white ">Gastos</span>
          </div>
          <p className="md:text-xl text-lg text-white ">
            {isVisible ? totalExpenses.toFixed(2) : "*".repeat(8)}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex flex-row gap-1 items-center">
            <ArrowUp className="text-white w-4 h-4" />
            <span className="text-white ">Ingresos</span>
          </div>
          <p className="md:text-xl text-lg text-white">
            {isVisible ? totalIncome.toFixed(2) : "*".repeat(8)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cursor-default">
      {CardContent}
      <BalanceAdjustmentDialog open={showRebalanceDialog} onOpenChange={setShowRebalanceDialog} />
    </div>
  );
}
