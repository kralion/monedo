import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import Chart from "@/components/statistics/chart";
import PieChart from "@/components/statistics/pie-chart";
import { Transaction } from "@/components/transaction";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCategoryStore } from "@/stores/category";
import { useExpenseStore } from "@/stores/expense";
import { useIncomeStore } from "@/stores/income";
import { IExpense, IIncome, TransactionType } from "@/interfaces";
import { formatDate } from "@/helpers/dateFormatter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/statistics")({
  component: StatisticsPage,
});

const typeFilters: { value: TransactionType; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ingresos", label: "Ingresos" },
  { value: "gastos", label: "Gastos" },
];

function IncomeTransaction({ income }: { income: IIncome }) {
  const isMobile = useIsMobile();

  return (
    <Link
      to="/transaction/$id"
      params={{ id: String(income.id) }}
      search={{ type: "income" }}
      className="flex flex-1 py-2 flex-row gap-2 items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      <div className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-green-500" />
      </div>
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
            S/{income.amount.toFixed(2)}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </Link>
  );
}

function StatisticsPage() {
  const { user } = useNeonUser();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("todos");
  const [incomes, setIncomes] = useState<IIncome[]>([]);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const { loading: expensesLoading, getAllExpensesSortedByAmount } =
    useExpenseStore();
  const { loading: incomesLoading, getIncomesSortedByAmount } =
    useIncomeStore();
  const { categories, getCategories } = useCategoryStore();

  const loading = expensesLoading || incomesLoading;

  useEffect(() => {
    if (user?.id) getCategories(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      if (transactionType === "gastos" || transactionType === "todos") {
        getAllExpensesSortedByAmount(user.id).then((data) =>
          setExpenses(data ?? []),
        );
      }
      if (transactionType === "ingresos" || transactionType === "todos") {
        getIncomesSortedByAmount(user.id).then((data) =>
          setIncomes(data ?? []),
        );
      }
    }
  }, [transactionType, user?.id]);

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getSortedTransactions = () => {
    const transactionList: (
      | { type: "income"; data: IIncome; amount: number }
      | { type: "expense"; data: IExpense; amount: number }
    )[] = [];

    if (transactionType === "todos" || transactionType === "ingresos") {
      incomes.forEach((inc) =>
        transactionList.push({ type: "income", data: inc, amount: inc.amount }),
      );
    }
    if (transactionType === "todos" || transactionType === "gastos") {
      expenses.forEach((exp) =>
        transactionList.push({
          type: "expense",
          data: exp,
          amount: exp.amount,
        }),
      );
    }

    return transactionList.sort((a, b) => b.amount - a.amount);
  };

  const sortedTransactions = getSortedTransactions();

  const getChartTitle = () => {
    switch (transactionType) {
      case "todos":
        return "Resumen";
      case "ingresos":
        return "Ingresos Recientes";
      case "gastos":
        return "Gastos por Categoría";
    }
  };

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
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : transactionType === "ingresos" ? (
            <div className="mt-4">
              <Chart incomes={incomes} />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 items-center">
                <PieChart
                  transactionType={transactionType}
                  expenses={expenses}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                />
                {transactionType === "gastos" && (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {categories.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {transactionType === "todos" && (
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-gray-700">Ingresos</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      <span className="text-gray-700">Gastos</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <h2 className="mt-12 text-xl font-semibold md:text-2xl">
            {getChartTitle()}
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
        </div>
      </div>
    </div>
  );
}
