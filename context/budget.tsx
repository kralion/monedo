import { IBudget, IBudgetContextProvider } from "@/interfaces";
import { router } from "expo-router";
import * as React from "react";
import { createContext, useContext } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase";
import { toast } from "sonner-native";
import { CheckCircle } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
export const BudgetContext = createContext<IBudgetContextProvider>({
  getBudgetById: async (id: string): Promise<IBudget> => ({} as IBudget),
  loading: false,
  addBudget: async () => {},
  getCurrentBudget: async () => ({} as IBudget),
  updateBudget: async () => {},
  budget: {} as IBudget,
  deleteBudget: async () => {},
  getBudgets: async (id: string) => [],
  budgets: [],
});

export const BudgetContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClerkSupabaseClient();
  const [budgets, setBudgets] = React.useState<IBudget[]>([]);
  const { user } = useUser();
  const [budget, setBudget] = React.useState({} as IBudget);
  const [loading, setLoading] = React.useState(false);

  const addBudget = async (budget: IBudget) => {
    await supabase.from("budgets").insert(budget);
  };

  const getCurrentBudget = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user?.id)
      .gte("created_At", startOfMonth.toISOString())
      .lte("created_At", endOfMonth.toISOString())
      .single();

    return data;
  };

  const getBudgetById = async (id: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", id)
      .single();
    setBudget(data);
    setLoading(false);
    return data;
  };

  const updateBudget = async (budget: IBudget) => {
    setLoading(true);
    await supabase.from("budgets").update(budget).eq("id", budget.id);
    toast.success("Presupuesto actualizado exitosamente", {
      icon: <CheckCircle color="green" size={20} />,
    });
    setLoading(false);
    router.back();
  };

  const deleteBudget = async (id: string) => {
    setLoading(true);
    await supabase.from("budgets").delete().eq("id", id);
    toast.success("Presupuesto eliminado exitosamente", {
      icon: <CheckCircle color="green" size={20} />,
    });
    router.push("/(tabs)/wallet");
    setLoading(false);
  };

  async function getBudgets(id: string) {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", id)
      .order("created_At", { ascending: false })
      .limit(3);
    setBudgets(JSON.parse(JSON.stringify(data)));
    return data;
  }

  return (
    <BudgetContext.Provider
      value={{
        addBudget,
        updateBudget,
        getBudgetById,
        loading,
        budget,
        deleteBudget,
        getCurrentBudget,
        getBudgets,
        budgets,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error(
      "useBudgetContext must be used within a BudgetContextProvider"
    );
  }
  return context;
};
