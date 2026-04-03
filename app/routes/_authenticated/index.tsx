import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Card from "~/components/dashboard/card";
import { Expense } from "~/components/expense";
import { groupExpensesByDate } from "~/helpers/groupExpenseByDate";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useUser();
  const { checkBudget } = useBudgetStore();
  const { getRecentExpenses, expenses } = useExpenseStore();
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getRecentExpenses(user.id);
      checkBudget(user.id);
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await getRecentExpenses(user.id);
      checkBudget(user.id);
    }
    setRefreshing(false);
  };

  const parsedExpenses = (expenses ?? []).map((expense) => ({
    ...expense,
    date: new Date(expense.date),
  }));

  if (!expenses) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      {showAll ? (
        <div className="overflow-y-auto pb-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-end items-end px-4 md:px-6">
              <button
                onClick={() => setShowAll(false)}
                className="text-muted-foreground px-1.5 opacity-50"
              >
                Ver Menos
              </button>
            </div>
            {Object.entries(groupExpensesByDate(parsedExpenses)).map(
              ([dateLabel, dateExpenses]) => (
                <div key={dateLabel}>
                  <h2 className="px-4 text-lg text-muted-foreground md:px-6 md:text-xl">
                    {dateLabel}
                  </h2>
                  <div className="space-y-0">
                    {dateExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="border-b border-zinc-200 dark:border-zinc-700 ml-[60px]"
                      >
                        <Expense expense={expense} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto pb-28 px-4 md:px-6">
          <div className="rounded-b-3xl pb-10 md:pb-12">
            <Card />
          </div>
          <div className="flex flex-row justify-between items-center w-full md:mt-6">
            <h2 className="text-xl font-bold dark:text-white md:text-2xl">
              Historial de Gastos
            </h2>
            <button
              onClick={() => setShowAll(true)}
              className="text-muted-foreground dark:text-secondary px-1.5 opacity-50"
            >
              Ver más
            </button>
          </div>
          <div className="space-y-0 mt-4">
            {parsedExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-xl text-muted-foreground md:text-2xl">
                  No hay gastos registrados
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-base">
                  Haz click en el botón "+" para registrar un gasto
                </p>
              </div>
            ) : (
              parsedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border-b border-zinc-200 dark:border-zinc-700 ml-[60px]"
                >
                  <Expense expense={expense} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
