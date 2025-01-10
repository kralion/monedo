import { BudgetContextProvider, ExpenseContextProvider } from "@/context";
import NetInfo from "@react-native-community/netinfo";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { XCircle } from "lucide-react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { toast, Toaster } from "sonner-native";
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new QueryClient();
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        toast.success("No tienes conexión a internet", {
          icon: <XCircle color="red" size={20} />,
        });
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={client}>
        <ExpenseContextProvider>
          <BudgetContextProvider>
            <Toaster />
            {children}
          </BudgetContextProvider>
        </ExpenseContextProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
