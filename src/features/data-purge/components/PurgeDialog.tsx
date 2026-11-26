"use client";

import { useState } from "react";
import { useNeonUser } from "@/hooks/useNeonUser";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePurgeStore } from "../stores/usePurgeStore";
import { PurgePreview } from "./PurgePreview";
import type { PurgeInput } from "../api/types";

type PurgeTypeLabel = Record<PurgeInput["type"], string>;

const PURGE_TYPE_LABELS: PurgeTypeLabel = {
  expenses: "Gastos",
  incomes: "Ingresos",
  both: "Gastos e Ingresos",
};

const PURGE_TYPE_OPTIONS: PurgeInput["type"][] = ["expenses", "incomes", "both"];

interface PurgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurgeDialog({ open, onOpenChange }: PurgeDialogProps) {
  const { user } = useNeonUser();
  const {
    type,
    setType,
    olderThanDays,
    preview,
    result,
    loading,
    error,
    getPreview,
    executePurgeAction,
    reset,
  } = usePurgeStore();

  const [confirmed, setConfirmed] = useState(false);

  if (!user?.id) return null;

  const handleConfirm = async () => {
    await executePurgeAction({ userId: user.id, type, olderThanDays });
  };

  const canPurge =
    !loading &&
    Boolean(preview) &&
    preview!.totalCount > 0 &&
    confirmed;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        reset();
        setConfirmed(false);
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purgar datos antiguos</DialogTitle>
          <DialogDescription>
            Eliminar registros con más de {olderThanDays} días de antigüedad.
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tipo de registro</Label>
            <div className="grid grid-cols-3 gap-1">
              {PURGE_TYPE_OPTIONS.map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={type === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t)}
                  className="flex-1"
                  disabled={loading}
                >
                  {PURGE_TYPE_LABELS[t]}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Días de antigüedad</Label>
            <span className="text-sm text-muted-foreground">
              {olderThanDays} días
            </span>
          </div>

          <div className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmed(false);
                getPreview(user.id);
              }}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Cargando..." : "Ver vista previa"}
            </Button>
          </div>

          {preview && <PurgePreview preview={preview} />}

          {preview && preview.totalCount > 0 && (
            <div className="flex items-center gap-2">
              <Switch
                id="confirm-purge"
                checked={confirmed}
                onCheckedChange={setConfirmed}
                disabled={loading}
              />
              <Label htmlFor="confirm-purge" className="text-sm cursor-pointer select-none">
                Entiendo que esta acción no se puede deshacer
              </Label>
            </div>
          )}

          {error && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive/50 text-destructive text-sm">
              {error}
            </div>
          )}
        </form>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canPurge || Boolean(result)}
            className="flex-1"
          >
            {loading ? "Purgando..." : result ? "Completado" : "Purgar datos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
