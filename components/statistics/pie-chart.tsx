import { Dimensions, View } from "react-native";
import { PieChart as Pie } from "react-native-gifted-charts";
import { COLORS, getCategoryColor } from "~/helpers/getCategoryColor";
import { IExpense } from "~/interfaces";
const width = Dimensions.get("window").width;

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
    const categoryTotals = new Map<string, number>();
    filteredExpenses.forEach((expense) => {
      const current = categoryTotals.get(expense.category.value) || 0;
      categoryTotals.set(expense.category.value, current + expense.amount);
    });

    const total = Array.from(categoryTotals.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Array.from(categoryTotals.entries())
      .map(([category, amount], index) => ({
        value: amount,
        percentage: Math.round((amount / total) * 100),
        label: category,
        color: getCategoryColor(category.toLowerCase()),
      }))
      .filter(({ percentage }) => percentage >= 2)
      .map(({ value, percentage, label, color }) => ({
        value,
        text: `${percentage}%`,
        label,
        color,
      }));
  };

  const pieData = aggregateByCategory(data);

  return (
    <View style={{ alignItems: "center" }}>
      <Pie
        data={pieData}
        donut
        showText
        textColor="black"
        radius={width * 0.3}
        textSize={14}
        focusOnPress
      />
    </View>
  );
}
