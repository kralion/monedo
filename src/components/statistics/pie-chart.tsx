import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { IExpense } from "@/interfaces";

type ChartProps = {
  timelineQuery: {
    value: string;
    label: string;
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  };
  data: IExpense[];
};

export default function PieChart({ timelineQuery, data }: ChartProps) {
  const filterExpensesByTimeline = (expenses: IExpense[]) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate >= timelineQuery.startTimeOfQuery &&
        expenseDate <= timelineQuery.endTimeOfQuery
      );
    });
  };

  const aggregateByCategory = (expenses: IExpense[]) => {
    const filteredExpenses = filterExpensesByTimeline(expenses);
    const categoryTotals = new Map<number, number>();
    const categoryNames = new Map<number, string>();
    const categoryColors = new Map<number, string>();

    filteredExpenses.forEach((expense) => {
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

  const pieData = aggregateByCategory(data);

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
            label={({ name, percentage }) => `${name} ${percentage}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
