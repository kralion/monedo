import { IGoal, IGoalContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import * as React from "react";
import { createContext, useContext } from "react";

export const GoalContext = createContext<IGoalContextProvider>({
  addGoal: () => {},
  goals: [],
  updateGoal: () => {},
  getRecentGoals: async (): Promise<IGoal[]> => [],
});

export const GoalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [goals, setGoals] = React.useState<IGoal[]>([]);

  const addGoal = async (goal: IGoal) => {
    await supabase.from("metas").insert(goal);
  };

  const updateGoal = async (goal: IGoal) => {
    await supabase.from("metas").update(goal).eq("id", goal.id);
  };

  async function getRecentGoals() {
    const { data, error } = await supabase.from("metas").select("*").limit(3);
    if (!data) return [];
    setGoals(JSON.parse(JSON.stringify(data)));
    if (error) console.log(error);
    return data;
  }

  return (
    <GoalContext.Provider
      value={{
        getRecentGoals,
        goals,
        addGoal,
        updateGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoalsContext = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoalsContext must be used within a GoalsProvider");
  }
  return context;
};
