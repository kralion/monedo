import { IBudget, IBudgetContextProvider } from "@/interfaces";
import * as React from "react";
import { createContext, useContext } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase";

export const BudgetContext = createContext<IBudgetContextProvider>({
  addBudget: async () => {},
  getMonthlyBudget: async () => 0,
  updateBudget: async () => {},
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

  const addBudget = async (budget: IBudget) => {
    await supabase.from("budgets").insert(budget);
  };

  const getMonthlyBudget = async () => {
    const { data } = await supabase.from("budgets").select("amount").limit(1);
    return data ? data[0].amount : 0;
  };

  const updateBudget = async (budget: IBudget) => {
    await supabase.from("budgets").update(budget).eq("id", budget.id);
  };

  const deleteBudget = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
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
        deleteBudget,
        getMonthlyBudget,
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
