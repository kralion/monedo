import { BudgetContextProvider, ExpenseContextProvider } from "@/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GestureHandlerRootView>
      <ExpenseContextProvider>
        <BudgetContextProvider>
          <Toaster />
          {children}
        </BudgetContextProvider>
      </ExpenseContextProvider>
    </GestureHandlerRootView>
  );
}
