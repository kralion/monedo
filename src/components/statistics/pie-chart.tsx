import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { IExpense, TransactionType } from "@/interfaces";

type ChartProps = {
  transactionType: TransactionType;
  expenses: IExpense[];
  totalIncome: number;
  totalExpenses: number;
};

export default function PieChart({
  transactionType,
  expenses,
  totalIncome,
  totalExpenses,
}: ChartProps) {
  const aggregateByCategory = (expenseData: IExpense[]) => {
    const categoryTotals = new Map<number, number>();
    const categoryNames = new Map<number, string>();
    const categoryColors = new Map<number, string>();

    expenseData.forEach((expense) => {
      const current = categoryTotals.get(expense.id_category) || 0;
      categoryTotals.set(expense.id_category, current + expense.amount);
      categoryNames.set(expense.id_category, expense.categories?.label || "");
      categoryColors.set(
        expense.id_category,
        expense.categories?.color || "#41D29B",
      );
    });

    const total = Array.from(categoryTotals.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => ({
        value: amount,
        percentage: Math.round((amount / total) * 100),
        name: categoryNames.get(categoryId) || "",
        color: categoryColors.get(categoryId) || "#41D29B",
      }))
      .filter(({ percentage }) => percentage >= 2);
  };

  const getTodosData = () => {
    const total = totalIncome + totalExpenses;
    if (total === 0) return [];

    return [
      {
        value: totalIncome,
        percentage: Math.round((totalIncome / total) * 100),
        name: "Ingresos",
        color: "#22c55e",
      },
      {
        value: totalExpenses,
        percentage: Math.round((totalExpenses / total) * 100),
        name: "Gastos",
        color: "#ef4444",
      },
    ];
  };

  const pieData =
    transactionType === "todos" ? getTodosData() : aggregateByCategory(expenses);

  if (pieData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8">
        <p className="text-center text-xl text-muted-foreground">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md h-[300px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              const value = Number(payload[0].value);
              return (
                <div className="bg-white dark:bg-zinc-800 border rounded-lg px-3 py-2 shadow-lg">
                  <p>S/. {value.toFixed(2)}</p>
                </div>
              );
            }}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
