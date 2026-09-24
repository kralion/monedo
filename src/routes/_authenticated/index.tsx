import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import Card from "@/components/dashboard/card";
import { Transaction } from "@/components/transaction";
import { Income } from "@/components/wallet/income";
import {
  Transaction as TransactionItem,
  transactionDate,
} from "@/helpers/groupTransactionsByDate";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";
import { AllTransactionsVirtualList } from "@/components/dashboard/transactions-virtual-list";
import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "@/components/dashboard/card";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
  pendingComponent: DashboardPending,
});

function RecentTransactionsSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-700"
        >
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

function DashboardPending() {
  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="overflow-y-auto pb-28 px-4 md:px-6">
        <div className="flex flex-row justify-between items-center py-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
        <CardSkeleton />
        <div className="flex flex-row justify-between items-center w-full md:mt-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <RecentTransactionsSkeleton />
      </div>
    </div>
  );
}

function TransactionRow({ t }: { t: TransactionItem }) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      {t.kind === "income" ? (
        <Income income={t.income} />
      ) : (
        <Transaction expense={t.expense} />
      )}
    </div>
  );
}

function DashboardPage() {
  const { user } = useNeonUser();
  const { getIncomes, incomes } = useIncomeStore();
  const { getRecentExpenses, expenses } = useExpenseStore();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoadingRecent(true);
    Promise.all([getRecentExpenses(user.id), getIncomes(user.id)]).finally(() =>
      setIsLoadingRecent(false),
    );
  }, [user?.id, getRecentExpenses, getIncomes]);

  const parsedExpenses = (expenses ?? []).map((expense) => ({
    ...expense,
    date: new Date(expense.date),
  }));

  const transactions: TransactionItem[] = [
    ...(incomes ?? []).map((income) => ({ kind: "income" as const, income })),
    ...parsedExpenses.map((expense) => ({
      kind: "expense" as const,
      expense,
    })),
  ].sort((a, b) => transactionDate(b).getTime() - transactionDate(a).getTime());

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      {showAll ? (
        <div className="flex flex-col pb-14">
          <div className="flex flex-row justify-between items-center p-4">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as "all" | "expense" | "income")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="expense">Gastos</SelectItem>
                <SelectItem value="income">Ingresos</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowAll(false)}
              variant="ghost"
              className="text-muted-foreground"
            >
              Ver Menos
            </Button>
          </div>
          {user?.id ? (
            <AllTransactionsVirtualList userId={user.id} filter={filter} />
          ) : (
            <div className="px-4">
              <RecentTransactionsSkeleton />
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-y-auto pb-28 px-4 md:px-6">
          <div className="flex flex-row justify-between items-center py-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold dark:text-white">
                Hola {user?.firstName ?? ""} 👋🏻
              </h1>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <ProfileDropdown user={user} />
          </div>
          <div className=" md:pb-8 pb-4">
            <Card />
          </div>

          <div className="flex flex-row justify-between items-center w-full md:mt-6">
            <h2 className=" font-semibold dark:text-white">Recientes</h2>
            <Button
              onClick={() => setShowAll(true)}
              variant="ghost"
              className="text-muted-foreground"
            >
              Ver más
            </Button>
          </div>
          <div className="space-y-0 mt-4">
            {isLoadingRecent ? (
              <RecentTransactionsSkeleton />
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-xl text-muted-foreground md:text-2xl">
                  No hay transacciones registradas
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-base">
                  Haz click en el botón "+" para registrar una transacción
                </p>
              </div>
            ) : (
              recentTransactions.map((t) => (
                <TransactionRow
                  key={
                    t.kind === "income"
                      ? `income-${t.income.id}`
                      : `expense-${t.expense.id}`
                  }
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
