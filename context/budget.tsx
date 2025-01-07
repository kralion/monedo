import { IBudget, IBudgetContextProvider } from "@/interfaces";
import { router } from "expo-router";
import * as React from "react";
import { createContext, useContext } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase";
import { toast } from "sonner-native";
import { CheckCircle, X } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
export const BudgetContext = createContext<IBudgetContextProvider>({
  getBudgetById: async (id: string): Promise<IBudget> => ({} as IBudget),
  loading: false,
  addBudget: async () => {},
  getCurrentBudget: async () => ({} as IBudget),
  updateBudget: async () => {},
  budget: {} as IBudget,
  deleteBudget: async () => {},
  getBudgets: async () => [],
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
    setLoading(true);
    const { error } = await supabase.from("budgets").insert({
      ...budget,
      user_id: user?.id,
    });
    if (error) {
      toast.error("Error al registrar presupuesto", {
        icon: <X color="red" size={20} />,
      });
      return;
    }
    setLoading(false);
  };
  //FIX: getCurrentBudget within the 30 days from the day it was created
  const getCurrentBudget = async () => {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user?.id)
      .limit(1)
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
    setLoading(false);
  };

  async function getBudgets() {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_At", { ascending: false });
    if (data) {
      setBudgets(data);
    }
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
