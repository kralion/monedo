import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import Card from "@/components/dashboard/card";
import { Expense } from "@/components/expense";
import { groupExpensesByDate } from "@/helpers/groupExpenseByDate";
import { useBudgetStore } from "@/stores/budget";
import { useExpenseStore } from "@/stores/expense";
import { Lock } from "lucide-react";
import { BuyPremiumModal } from "@/components/buy-premium";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useNeonUser();
  const { checkBudget } = useBudgetStore();
  const { getRecentExpenses, expenses } = useExpenseStore();
  const [showAll, setShowAll] = useState(false);
  const [buyPremiumOpen, setBuyPremiumOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getRecentExpenses(user.id);
      checkBudget(user.id);
    }
  }, [user?.id]);

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
            <div className="flex flex-row justify-end items-end p-4 ">
              <Button
                onClick={() => setShowAll(false)}
                variant="ghost"
                className="text-muted-foreground "
              >
                Ver Menos
              </Button>
            </div>
            {Object.entries(groupExpensesByDate(parsedExpenses)).map(
              ([dateLabel, dateExpenses]) => (
                <div key={dateLabel} className="px-4 space-y-2">
                  <h2 className="text-muted-foreground">{dateLabel}</h2>
                  <div className="space-y-0">
                    {dateExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="border-b border-zinc-200 dark:border-zinc-700 "
                      >
                        <Expense expense={expense} />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
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
            <Button onClick={() => setBuyPremiumOpen(true)} variant="secondary">
              <Lock />
            </Button>
          </div>
          <div className="rounded-b-3xl pb-10 md:pb-12">
            <Card />
          </div>
          <BuyPremiumModal
            open={buyPremiumOpen}
            onOpenChange={setBuyPremiumOpen}
          />
          <div className="flex flex-row justify-between items-center w-full md:mt-6">
            <h2 className="text-xl font-bold dark:text-white md:text-2xl">
              Historial de Gastos
            </h2>
            <Button
              onClick={() => setShowAll(true)}
              variant="ghost"
              className="text-muted-foreground"
            >
              Ver más
            </Button>
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
                  className="border-b border-zinc-200 dark:border-zinc-700 "
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
