import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { memo, useEffect, useMemo, useState } from "react";
import Chart from "@/components/statistics/chart";
import PieChart from "@/components/statistics/pie-chart";
import { Transaction } from "@/components/transaction";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IExpense, IIncome, TransactionType } from "@/interfaces";
import { formatDate } from "@/helpers/dateFormatter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { getStatisticsData } from "@/api/statistics";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/statistics")({
  component: StatisticsPage,
  pendingComponent: StatisticsPending,
});

function ChartSkeleton() {
  return <Skeleton className="h-[300px] w-full" />;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-600"
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

function StatisticsPending() {
  return (
    <div className="py-4 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between p-4">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
          <Separator />
        </div>
      </div>
      <div className="overflow-y-auto pb-28 px-4">
        <div className="flex flex-col gap-4 mt-4">
          <ChartSkeleton />
          <Skeleton className="h-6 w-40 mt-8" />
          <ListSkeleton />
        </div>
      </div>
    </div>
  );
}

const typeFilters: { value: TransactionType; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ingresos", label: "Ingresos" },
  { value: "gastos", label: "Gastos" },
];

const IncomeTransaction = memo(function IncomeTransaction({
  income,
}: {
  income: IIncome;
}) {
  const isMobile = useIsMobile();
  return (
    <Link
      to="/transaction/$id"
      params={{ id: String(income.id) }}
      search={{ type: "income" }}
      className="flex flex-1 py-2 flex-row gap-2 items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      <img
        src="https://img.icons8.com/?size=100&id=BHX6wRnikXL8&format=png&color=000000"
        alt=""
        className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5 object-contain"
      />
      <div className="flex flex-row justify-between items-center flex-1">
        <div className="flex flex-col">
          <h3 className="md:text-lg dark:text-white">
            {income.description.length > (isMobile ? 15 : 30)
              ? `${income.description.slice(0, isMobile ? 15 : 30)}...`
              : income.description}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(income.created_at)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="md:text-xl font-semibold text-green-500 dark:text-green-400">
            S/{Number(income.amount).toFixed(2)}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </Link>
  );
});

type CategoryAggregate = {
  id_category: number;
  name: string;
  color: string;
  value: number;
};

function StatisticsPage() {
  const { user } = useNeonUser();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("todos");

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState<
    CategoryAggregate[]
  >([]);
  const [topIncomes, setTopIncomes] = useState<IIncome[]>([]);
  const [topExpenses, setTopExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    setLoading(true);
    getStatisticsData(user.id)
      .then((data) => {
        if (cancelled) return;
        setTotalIncome(data.totalIncome);
        setTotalExpenses(data.totalExpenses);
        setExpensesByCategory(data.expensesByCategory);
        setTopIncomes(data.topIncomes as IIncome[]);
        setTopExpenses(data.topExpenses as IExpense[]);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const sortedTransactions = useMemo(() => {
    const list: (
      | { type: "income"; data: IIncome; amount: number }
      | { type: "expense"; data: IExpense; amount: number }
    )[] = [];

    if (transactionType === "todos" || transactionType === "ingresos") {
      topIncomes.forEach((inc) =>
        list.push({ type: "income", data: inc, amount: Number(inc.amount) }),
      );
    }
    if (transactionType === "todos" || transactionType === "gastos") {
      topExpenses.forEach((exp) =>
        list.push({
          type: "expense",
          data: exp,
          amount: Number(exp.amount),
        }),
      );
    }

    return list.sort((a, b) => b.amount - a.amount);
  }, [transactionType, topIncomes, topExpenses]);

  const listTitle = useMemo(() => {
    switch (transactionType) {
      case "todos":
        return "Top Transacciones";
      case "ingresos":
        return "Top Ingresos";
      case "gastos":
        return "Top Gastos";
    }
  }, [transactionType]);

  return (
    <div className="py-4 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between p-4">
          <h1 className="text-4xl font-bold md:text-5xl">Estadísticas</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {typeFilters.map((item) => (
              <Button
                key={item.value}
                size="sm"
                variant={transactionType === item.value ? "default" : "outline"}
                onClick={() => setTransactionType(item.value)}
                className="rounded-full shrink-0"
              >
                {item.label}
              </Button>
            ))}
          </div>
          <Separator />
        </div>
      </div>
      <div className="overflow-y-auto pb-28 px-4">
        <div className="flex flex-col gap-4 mt-4">
          {loading ? (
            <>
              <ChartSkeleton />
              <Skeleton className="h-6 w-40 mt-8" />
              <ListSkeleton />
            </>
          ) : (
            <>
              {transactionType === "ingresos" ? (
                <div className="mt-4">
                  <Chart incomes={topIncomes} />
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-center">
                  <PieChart
                    transactionType={transactionType}
                    expensesByCategory={expensesByCategory}
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                  />
                </div>
              )}

              <h2 className="mt-12 text-xl font-semibold md:text-2xl">
                {listTitle}
              </h2>
              <div className="space-y-0">
                {sortedTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-center text-xl text-muted-foreground">
                      No hay transacciones registradas
                    </p>
                  </div>
                ) : (
                  sortedTransactions.slice(0, 10).map((item) => (
                    <div
                      key={`${item.type}-${item.data.id}`}
                      className="border-b border-zinc-200 dark:border-zinc-600"
                    >
                      {item.type === "income" ? (
                        <IncomeTransaction income={item.data as IIncome} />
                      ) : (
                        <Transaction expense={item.data as IExpense} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
