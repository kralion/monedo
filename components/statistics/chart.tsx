import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { IExpense } from "~/interfaces";

type ChartProps = {
  timelineQuery: {
    value: string;
    label: string;
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  };
  data: IExpense[];
};

function aggregateData(
  data: IExpense[],
  timeLabels: string[],
  getTimeKey: (date: Date) => string
) {
  const totals = new Map<string, number>();
  data.forEach((expense) => {
    const expenseDate = new Date(expense.date);
    const key = getTimeKey(expenseDate);
    totals.set(key, (totals.get(key) || 0) + expense.amount);
  });
  return timeLabels.map((label) => ({
    name: label,
    value: totals.get(label) || 0,
  }));
}

export default function Chart({ timelineQuery, data }: ChartProps) {
  let chartData: { name: string; value: number }[] = [];

  switch (timelineQuery.value) {
    case "hoy": {
      const hours = ["05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:59"];
      chartData = aggregateData(
        data,
        hours,
        (date) => `${date.getHours().toString().padStart(2, "0")}:00`
      );
      break;
    }
    case "diario": {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
      });
      chartData = aggregateData(data, days, (date) =>
        date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
      );
      break;
    }
    case "semanal": {
      const weeks = Array.from({ length: 4 }, (_, i) => `S ${4 - i}`);
      chartData = aggregateData(data, weeks, (date) => {
        const weekNumber = Math.ceil(date.getDate() / 7);
        return `S ${weekNumber}`;
      });
      break;
    }
    case "mensual": {
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
      });
      chartData = aggregateData(data, months, (date) =>
        date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
      );
      break;
    }
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8">
        <p className="text-center text-xl text-muted-foreground">Sin datos</p>
        <p className="text-center text-sm text-muted-foreground">
          Para este filtro no hay gastos registrados aún
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#41D29B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#41D29B" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="#41D29B"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
