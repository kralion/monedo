import { IBudget, IBudgetContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/clerk-expo";
import * as React from "react";
import { createContext, useContext } from "react";

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
  const [budgets, setBudgets] = React.useState<IBudget[]>([]);

  const addBudget = async (budget: IBudget) => {
    await supabase.from("presupuestos").insert(budget);
  };

  const updateBudget = async (budget: IBudget) => {
    await supabase.from("presupuestos").update(budget).eq("id", budget.id);
  };

  const deleteBudget = async (id: string) => {
    await supabase.from("presupuestos").delete().eq("id", id);
  };

  async function getRecentBudgets(id: string) {
    const { data, error } = await supabase
      .from("presupuestos")
      .select("*")
      .eq("usuario_id", id)
      .order("fecha_registro", { ascending: false });
    // .limit(3);
    if (!data) return [];
    setBudgets(JSON.parse(JSON.stringify(data)));
    if (error) console.log(error);
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
