import { endOfMonth, formatISO, set, startOfMonth } from "date-fns";
import * as React from "react";
import { createContext, useContext } from "react";
import { IExpenseContextProvider, IExpense } from "@/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { createClerkSupabaseClient } from "~/lib/supabase";

export const ExpenseContext = createContext<IExpenseContextProvider>({
  addExpense: () => {},
  updateExpense: () => {},
  loading: false,
  sumOfAllOfExpensesMonthly: async () => 0,
  getExpenseById: async (id: string): Promise<IExpense> => ({} as IExpense),
  getWeeklyExpenses: async (): Promise<IExpense[]> => [],
  getExpensesByUser: async (id: string) => [],
  expenses: [],
  expense: {} as IExpense,
  getTopExpenses: async (): Promise<IExpense[]> => [],
  getRecentExpenses: async (): Promise<IExpense[]> => [],
  getExpensesByPeriodicity: async (): Promise<IExpense[]> => [],
  deleteExpense: () => {},
});

export const ExpenseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = React.useState<IExpense[]>([]);
  const [expense, setExpense] = React.useState<IExpense>({} as IExpense);
  const [loading, setLoading] = React.useState(false);
  const supabase = createClerkSupabaseClient();
  const { user } = useUser();
  const addExpense = async (expense: IExpense) => {
    await supabase.from("expenses").insert(expense);
  };

  async function getExpensesByUser(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", id);
    if (error) throw error;
    setExpenses(data);
    setLoading(false);
    return data;
  }

  async function getWeeklyExpenses() {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user?.id)
      .order("date", { ascending: false });
    // .limit(7);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function sumOfAllOfExpensesMonthly() {
    const now = new Date();
    const startOfThisMonth = formatISO(startOfMonth(now), {
      representation: "date",
    });
    const endOfThisMonth = formatISO(endOfMonth(now), {
      representation: "date",
    });

    const { data } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", user?.id)
      .gte("date", startOfThisMonth)
      .lte("date", endOfThisMonth);

    if (data) {
      const sum = data.reduce(
        (total, expense) => total + Number(expense.amount),
        0
      );
      return sum;
    }
    return 0;
  }

  const updateExpense = async (expense: IExpense) => {
    setLoading(true);
    await supabase.from("expenses").update(expense).eq("id", expense.id);
    setLoading(false);
  };

  const deleteExpense = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    setLoading(false);
    console.log("Expense deleted", error);
  };

  async function getTopExpenses({
    startTimeOfQuery,
    endTimeOfQuery,
  }: {
    startTimeOfQuery: Date;
    endTimeOfQuery: Date;
  }) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .gte("date", startTimeOfQuery.toISOString())
        .lte("date", endTimeOfQuery.toISOString())
        .order("amount", { ascending: false })
        .limit(15);
      return data;
    } catch (error) {
      console.log("ERROR in getTopExpenses", error);
      return [];
    } finally {
      setLoading(false);
    }
    setLoading(false);
  }
  async function getRecentExpenses() {
    setLoading(true);
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user?.id)
      .order("date", { ascending: false })
      .limit(15);
    setLoading(false);
    if (!data) return [];
    return data;
  }
  async function getExpensesByPeriodicity() {
    setLoading(true);
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user?.id)
      .eq("periodicity", true)
      .limit(15);
    setLoading(false);
    if (!data) return [];
    return data;
  }

  async function getExpenseById(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setExpense(data);
    setLoading(false);
    return data;
  }
  return (
    <ExpenseContext.Provider
      value={{
        getExpensesByUser,
        expenses,
        loading,
        deleteExpense,
        getWeeklyExpenses,
        getExpenseById,
        addExpense,
        sumOfAllOfExpensesMonthly,
        updateExpense,
        getTopExpenses,
        expense,
        getRecentExpenses,
        getExpensesByPeriodicity,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within a ExpenseProvider");
  }
  return context;
};
