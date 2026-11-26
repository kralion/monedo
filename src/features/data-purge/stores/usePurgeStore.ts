import { create } from "zustand";
import { toast } from "sonner";
import {
  executePurge,
  getPurgePreview,
  type PurgeInput,
  type PurgePreview,
  type PurgeResult,
} from "../api/services";

interface PurgeState {
  // UI state
  open: boolean;
  type: PurgeInput["type"];
  olderThanDays: number;

  // Data state
  preview: PurgePreview | null;
  result: PurgeResult | null;
  loading: boolean;
  error: string | null;

  // Actions
  openDialog: (type: PurgeInput["type"]) => void;
  closeDialog: () => void;
  setType: (type: PurgeInput["type"]) => void;
  getPreview: (userId: string) => Promise<void>;
  executePurgeAction: (input: PurgeInput) => Promise<void>;
  reset: () => void;
}

export const usePurgeStore = create<PurgeState>((set, get) => ({
  open: false,
  type: "expenses",
  olderThanDays: 30,

  preview: null,
  result: null,
  loading: false,
  error: null,

  openDialog: (type) => {
    set({ open: true, type, preview: null, result: null, error: null });
  },

  closeDialog: () => {
    set({ open: false, preview: null, result: null, error: null });
  },

  setType: (type) => {
    set({ type, preview: null, result: null });
  },

  getPreview: async (userId) => {
    const { type, olderThanDays } = get();
    set({ loading: true, error: null });
    try {
      const preview = await getPurgePreview(userId, type, olderThanDays);
      set({ preview, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      toast.error("Error al obtener la vista previa");
    }
  },

  executePurgeAction: async (input) => {
    set({ loading: true, error: null });
    try {
      const result = await executePurge(input);
      set({ result, loading: false });
      if (result.success) {
        toast.success(
          `Se eliminaron ${result.totalPurged} registro(s) antiguo(s)`,
        );
      } else {
        toast.error("No se pudo completar la purga");
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      toast.error((error as Error).message || "Error al purgar datos");
    }
  },

  reset: () => {
    set({ open: false, preview: null, result: null, loading: false, error: null });
  },
}));
