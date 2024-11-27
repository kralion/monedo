import {
  BudgetContextProvider,
  ExpenseContextProvider,
  GoalContextProvider,
} from "@/context";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExpenseContextProvider>
      <GoalContextProvider>
        <BudgetContextProvider>{children}</BudgetContextProvider>
      </GoalContextProvider>
    </ExpenseContextProvider>
  );
}
