import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDebt } from "@/interfaces";
import { useDebtStore } from "@/stores/debt";

export const Route = createFileRoute("/_authenticated/add-debt")({
  component: AddDebtPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
});

function AddDebtPage() {
  const { addDebt, loading, debt, updateDebt, getDebtById } = useDebtStore();
  const { id } = Route.useSearch();
  const { user } = useNeonUser();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setValue } = useForm<IDebt>({
    defaultValues: {
      status: "active",
    },
  });

  useEffect(() => {
    if (id && debt) {
      setValue("name", debt.name);
      setValue("amount", debt.amount);
      setValue("original_amount", debt.original_amount ?? undefined);
      setValue("creditor", debt.creditor ?? undefined);
      setValue("notes", debt.notes ?? undefined);
      setValue("status", debt.status);
    }
  }, [id, debt]);

  useEffect(() => {
    if (id) getDebtById(Number(id));
  }, [id]);

  async function onSubmit(data: IDebt) {
    if (!data.name?.trim()) {
      toast.error("Debes ingresar un nombre");
      return;
    }

    if (id) {
      await updateDebt({
        ...data,
        user_id: user?.id as string,
        id: Number(id),
        created_at: debt?.created_at ?? new Date(),
      });
    } else {
      await addDebt({
        ...data,
        user_id: user?.id as string,
        status: data.status ?? "active",
      });
    }

    reset();
    navigate({ to: "/debts" });
  }

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 max-w-xl mx-auto p-4 pb-28">
      <h1 className="text-2xl font-bold">{id ? "Editar Deuda" : "Nueva Deuda"}</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Nombre *</Label>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Ej: Juan Pérez"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Monto *</Label>
          <Controller
            control={control}
            name="amount"
            rules={{ required: true, min: 1 }}
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                placeholder="S/ 500.00"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Monto original</Label>
          <Controller
            control={control}
            name="original_amount"
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                placeholder="S/ 1000.00"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value) || undefined)}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Deudor</Label>
          <Controller
            control={control}
            name="creditor"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Ej: Banco XYZ"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Estado</Label>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                  <SelectItem value="partial">Parcial</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Notas</Label>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Textarea
                placeholder="Detalles adicionales..."
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[100px]"
              />
            )}
          />
        </div>
        <Button
          className="rounded-full"
          onClick={handleSubmit(onSubmit)}
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <span className="dark:text-black">
              {id ? "Guardar Cambios" : "Registrar"}
            </span>
          )}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full"
          onClick={() => {
            reset();
            navigate({ to: "/debts" });
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
