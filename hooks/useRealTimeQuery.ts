import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "~/lib/supabase";
export function useRealtimeQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  table: string
) {
  const queryClient = useQueryClient();

  const query = useQuery<T>({
    queryKey,
    queryFn,
  });

  useEffect(() => {
    const channel = supabase
      .channel("realtime-" + table)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryKey, table, queryClient]);

  return query;
}
