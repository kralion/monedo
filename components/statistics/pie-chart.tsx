import { Dimensions, View, useWindowDimensions } from "react-native";
import { PieChart as Pie } from "react-native-gifted-charts";
import { IExpense } from "~/interfaces";
import { useColorScheme } from "~/lib/useColorScheme";
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
  const { isDarkColorScheme } = useColorScheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
        expense.categories?.color || "#41D29B"
      );
    });

    const total = Array.from(categoryTotals.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => ({
        value: amount,
        percentage: Math.round((amount / total) * 100),
        label: categoryId,
        categoryName: categoryNames.get(categoryId) || "",
        color: categoryColors.get(categoryId) || "#41D29B",
      }))
      .filter(({ percentage }) => percentage >= 2)
      .map(({ value, percentage, categoryName, color }) => ({
        value,
        text: `${percentage}%`,
        label: categoryName,
        color,
      }));
  };
  const pieData = aggregateByCategory(data);

  // Calculate responsive dimensions based on screen width
  const getRadius = () => {
    if (isMobile) {
      return width * 0.4; // Original mobile size
    }
    return Math.min(width * 0.25, 180); // Desktop size, capped at 180
  };

  const getInnerRadius = () => {
    if (isMobile) {
      return width * 0.25; // Original mobile size
    }
    return Math.min(width * 0.15, 110); // Desktop size, capped at 110
  };

  const textSize = isMobile ? 12 : 14;

  return (
    <View className="items-center web:md:w-full">
      <Pie
        data={pieData}
        donut
        showText
        strokeWidth={4}
        backgroundColor="transparent"
        strokeColor={isDarkColorScheme ? "#18181b" : "white"}
        strokeDashArray={[5, 5]}
        textColor="black"
        radius={getRadius()}
        innerRadius={getInnerRadius()}
        textSize={textSize}
        focusOnPress
        labelsPosition="outward"
        centerLabelComponent={() => {
          return pieData.length > 0 ? (
            <View className="items-center justify-center">
              <View className="bg-white dark:bg-zinc-800 rounded-full p-2">
                <View className="items-center justify-center">
                  <View className="w-2 h-2 rounded-full bg-teal-500" />
                </View>
              </View>
            </View>
          ) : null;
        }}
      />
    </View>
  );
}
