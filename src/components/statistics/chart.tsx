import { IIncome } from "@/interfaces";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartProps = {
  incomes: IIncome[];
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

export default function Chart({ incomes }: ChartProps) {
  const last10Incomes = incomes.slice(0, 10).reverse();

  const chartData = last10Incomes.map((income) => ({
    name: formatDate(income.created_at),
    value: income.amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8">
        <p className="text-center text-xl text-muted-foreground">Sin datos</p>
        <p className="text-center text-sm text-muted-foreground">
          No hay ingresos registrados aún
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
