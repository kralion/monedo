import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IIncome } from "@/interfaces";
import { useIncomeStore } from "@/stores/income";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/edit/$id")({
  component: EditIncomePage,
});

function EditIncomePage() {
  const { id } = Route.useParams();
  const { user } = useNeonUser();
  const { income, getIncomeById, updateIncome, deleteIncome } =
    useIncomeStore();
  const navigate = useNavigate();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IIncome>();

  useEffect(() => {
    getIncomeById(Number(id));
  }, [id]);

  useEffect(() => {
    if (income) {
      reset({
        description: income.description,
        amount: income.amount,
      });
    }
  }, [income, reset]);

  async function onSubmit(data: IIncome) {
    if (!user?.id) return;
    await updateIncome({
      ...income!,
      ...data,
      user_id: user.id,
      id: Number(id),
      created_at: income!.created_at,
    });
    navigate({ to: "/" });
  }

  const handleDelete = () => {
    deleteIncome(Number(id));
    navigate({ to: "/" });
  };

  if (!income) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const formattedDate = new Date(income.created_at).toLocaleDateString(
    "es-PE",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-xl mx-auto pb-20">
      <div className="flex flex-col gap-8 p-4">
        <Button
          variant="link"
          className="w-fit pl-0"
          onClick={() => router.history.back()}
        >
          <ArrowLeft />
          Volver atras
        </Button>
        <div className="flex flex-col gap-4 items-center">
          <img
            src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000"
            alt=""
            className="size-36 bg-zinc-100 dark:bg-zinc-800 rounded-full p-6 object-contain"
          />
        </div>
        {isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
              <input
                type="number"
                className="h-36 text-5xl text-center font-bold dark:text-white bg-transparent border-none focus:outline-none w-full"
                placeholder="S/ 50.00"
                {...register("amount", {
                  required: true,
                  min: 1,
                  valueAsNumber: true,
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">Monto inválido</p>
              )}
            </div>
            <Button type="submit" size="lg">
              Guardar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                reset({
                  description: income.description,
                  amount: income.amount,
                });
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
          </form>
        ) : (
          <>
            <div className="flex flex-col gap-4 items-center">
              <p className="text-5xl font-bold tracking-tighter">
                S/ {income.amount.toFixed(2)}
              </p>
              <p className="text-lg text-muted-foreground">
                {income.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Fecha</span>
                <span>{formattedDate}</span>
              </div>
              <Separator />
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Tipo</span>
                <span>Ingreso</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="w-full">
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará el ingreso seleccionado y no se
                      puede deshacer
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-white"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
