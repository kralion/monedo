import { z } from "zod";

export const purgeConfirmSchema = z.object({
  confirm: z.literal(true, {
    required_error: "Debes confirmar para continuar",
  }),
});

export type PurgeConfirmInput = z.infer<typeof purgeConfirmSchema>;
