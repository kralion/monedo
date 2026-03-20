import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Chart from "~/components/statistics/chart";
import PieChart from "~/components/statistics/pie-chart";
import { Expense } from "~/components/expense";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { getDateRange } from "~/lib/rangeDate";
import { useCategoryStore } from "~/stores/category";
import { useExpenseStore } from "~/stores/expense";
import { IExpense } from "~/interfaces";

export const Route = createFileRoute("/_authenticated/statistics")({
  component: StatisticsPage,
});

const queryFilters = [
  getDateRange("hoy"),
  getDateRange("diario"),
  getDateRange("semanal"),
  getDateRange("mensual"),
];

function StatisticsPage() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [chartType, setChartType] = useState<"pie" | "line">("pie");
  const [timelineQuery, setTimelineQuery] = useState(getDateRange("diario"));
  const { getExpensesByPeriodicity, loading } = useExpenseStore();
  const { categories, getCategories } = useCategoryStore();

  useEffect(() => {
    if (user?.id) getCategories(user.id);
  }, [user?.id]);

  useEffect(() => {
    getExpensesByPeriodicity(timelineQuery).then((data) =>
      setExpenses((data as IExpense[]) ?? [])
    );
  }, [timelineQuery]);

  return (
    <div className="py-4 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between px-4 pt-7">
          <Text className="text-4xl font-bold md:text-5xl">Estadísticas</Text>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {queryFilters.map((item) => (
              <Button
                key={item.value}
                size="sm"
                variant={timelineQuery.value === item.value ? "default" : "outline"}
                onClick={() => setTimelineQuery(item)}
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : chartType === "pie" ? (
            <>
              <div className="flex flex-col gap-2 items-center">
                <PieChart timelineQuery={timelineQuery} data={expenses} />
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {categories.map((item) => (
                    <div key={item.id} className="flex flex-row items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="text-gray-700">{item.label}</Text>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <Chart timelineQuery={timelineQuery} data={expenses} />
            </div>
          )}

          <Text className="text-xl font-bold mt-12 md:text-2xl">Top Gastos</Text>
          <div className="space-y-0">
            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-xl text-muted-foreground">
                  No hay gastos registrados
                </p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border-b border-zinc-200 dark:border-zinc-600"
                >
                  <Expense expense={expense} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
