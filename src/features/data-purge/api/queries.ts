import { usePurgeStore } from "../stores/usePurgeStore";
import type { PurgeInput } from "./db";

/**
 * Thin hooks over the purge zustand store.
 * Kept here to satisfy the feature structure (db → services → queries → components).
 */
export const usePurgePreview = () => {
  const { getPreview, preview, loading } = usePurgeStore();
  return { getPreview, preview, loading };
};

export const useExecutePurge = () => {
  const { executePurgeAction: run, result, loading } = usePurgeStore();
  return { runPurge: (input: PurgeInput) => run(input), result, loading };
};
