import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TransactionType } from "@/interfaces";
import { memo, useMemo } from "react";

type CategoryAggregate = {
  id_category: number;
  name: string;
  color: string;
  value: number;
};

type ChartProps = {
  transactionType: TransactionType;
  expensesByCategory: CategoryAggregate[];
  totalIncome: number;
  totalExpenses: number;
};

function PieChartComponent({
  transactionType,
  expensesByCategory,
  totalIncome,
  totalExpenses,
}: ChartProps) {
  const pieData = useMemo(() => {
    if (transactionType === "todos") {
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
    }

    const total = expensesByCategory.reduce((sum, c) => sum + c.value, 0);
    if (total === 0) return [];
    return expensesByCategory
      .map((c) => ({
        value: c.value,
        percentage: Math.round((c.value / total) * 100),
        name: c.name,
        color: c.color,
      }))
      .filter(({ percentage }) => percentage >= 2);
  }, [transactionType, expensesByCategory, totalIncome, totalExpenses]);

  if (pieData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8">
        <p className="text-center text-xl text-muted-foreground">Sin datos</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="h-[300px]">
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
              isAnimationActive={false}
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
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {pieData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex flex-row items-center gap-2"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(PieChartComponent);
