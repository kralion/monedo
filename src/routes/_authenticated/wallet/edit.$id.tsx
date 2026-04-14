import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBudget } from "@/interfaces";
import { useBudgetStore } from "@/stores/budget";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/wallet/edit/$id")({
  component: EditBudgetPage,
});

function EditBudgetPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const { budget, getBudgetById, updateBudget } = useBudgetStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IBudget>();

  useEffect(() => {
    getBudgetById(Number(id));
  }, [id]);

  useEffect(() => {
    if (budget) {
      reset({
        description: budget.description,
        amount: budget.amount,
      });
    }
  }, [budget, reset]);

  async function onSubmit(data: IBudget) {
    if (!user?.id) return;
    await updateBudget({
      ...budget!,
      ...data,
      user_id: user.id,
      id: Number(id),
      created_At: budget!.created_At,
    });
    navigate({ to: "/wallet" });
  }

  if (!budget) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Descripción</Label>
          <Input
            {...register("description", { required: true })}
            placeholder="Ej: Salario mensual"
          />
          {errors.description && (
            <p className="text-sm text-red-500">Campo requerido</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Monto (S/)</Label>
          <Input
            type="number"
            {...register("amount", {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-500">Monto inválido</p>
          )}
        </div>
        <Button type="submit" size="lg">
          Guardar
        </Button>
      </form>
    </div>
  );
}
