import { IBudget, IBudgetContextProvider } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { createContext, useContext } from "react";
import { createClerkSupabaseClient } from "~/lib/supabase";

export const BudgetContext = createContext<IBudgetContextProvider>({
  addBudget: async () => {},
  updateBudget: async () => {},
  deleteBudget: async () => {},
  getRecentBudgets: async (id: string) => [],
  budgets: [],
});

export const BudgetContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user: userData } = useUser();
  const supabase = createClerkSupabaseClient();
  const [budgets, setBudgets] = React.useState<IBudget[]>([]);

  const addBudget = async (budget: IBudget) => {
    await supabase.from("budgets").insert(budget);
  };

  const updateBudget = async (budget: IBudget) => {
    await supabase.from("budgets").update(budget).eq("id", budget.id);
  };

  const deleteBudget = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
  };

  async function getRecentBudgets(id: string) {
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
        getRecentBudgets,
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
