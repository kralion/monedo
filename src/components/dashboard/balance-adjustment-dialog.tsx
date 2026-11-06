"use client";

import { useState } from "react";
import { useBalanceAdjustmentStore } from "@/stores/balance-adjustment";
import { useNeonUser } from "@/hooks/useNeonUser";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

export function BalanceAdjustmentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user } = useNeonUser();
  const { balanceAdjustment, setBalanceAdjustment, clearBalanceAdjustment, loading } = useBalanceAdjustmentStore();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const value = Number(amount);
    if (isNaN(value)) {
      toast.error("Monto inválido");
      return;
    }
    await setBalanceAdjustment(user.id, value, description || undefined);
    onOpenChange(false);
  };

  const handleClear = async () => {
    if (!user?.id) return;
    setIsClearing(true);
    await clearBalanceAdjustment(user.id);
    setAmount("");
    setDescription("");
    onOpenChange(false);
    setIsClearing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rebalance de Balance</DialogTitle>
          <DialogDescription>
            Ajusta manualmente tu balance actual. Puede ser positivo o negativo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto del reajuste (S/.)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Ej: 50.00 o -25.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Valor positivo aumenta el balance, negativo lo disminuye.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="Motivo del reajuste..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            {balanceAdjustment !== 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                <XIcon className="w-4 h-4" />
                <span>Reajuste actual: S/. {balanceAdjustment.toFixed(2)}</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            {balanceAdjustment !== 0 && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleClear}
                disabled={loading || isClearing}
                className="flex-1"
              >
                {isClearing ? "Eliminando..." : "Eliminar reajuste"}
              </Button>
            )}
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : balanceAdjustment !== 0 ? "Actualizar" : "Aplicar reajuste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}