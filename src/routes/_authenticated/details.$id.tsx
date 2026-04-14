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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { supabase } from "@/lib/supabase";
import { useBudgetStore } from "@/stores/budget";
import { useExpenseStore } from "@/stores/expense";
import { useUser } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/details/$id")({
  component: ExpenseDetailsPage,
});

function ExpenseDetailsPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const {
    expense,
    getExpenseById,
    sumOfAllOfExpenses,
    totalExpenses,
    deleteExpense,
  } = useExpenseStore();
  const { getTotalBudget, totalBudget } = useBudgetStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getTotalBudget(user.id);
      sumOfAllOfExpenses(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    getExpenseById(Number(id));
    const channel = supabase
      .channel("realtime-expenses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
        },
        () => getExpenseById(Number(id)),
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense?.categories?.label?.toLowerCase(),
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const handleDelete = () => {
    deleteExpense(expense?.id as number);
    navigate({ to: "/" });
  };

  if (!expense) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-xl mx-auto pt-16 pb-28">
      <div className="flex flex-col gap-8 p-4">
        <div className="flex flex-col gap-4 items-center">
          <img
            src={assetIndentificador}
            alt=""
            className="w-[150px] h-[150px] bg-zinc-100 dark:bg-zinc-800 rounded-full p-8 object-contain"
          />
          <p className="text-5xl font-bold tracking-tighter">
            S/ {expense?.amount}
          </p>
          <p className="text-lg text-muted-foreground">{expense.description}</p>
        </div>
        <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
          <div className="flex flex-row justify-between items-center">
            <span className="text-muted-foreground">Fecha</span>
            <span>
              {new Date(expense.date).toLocaleDateString("es-PE", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <span className="text-muted-foreground">Hora</span>
            <span>
              {new Date(expense.date).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <span className="text-muted-foreground">Categoria</span>
            <Badge variant="outline">{expense?.categories?.label}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            <Progress
              value={Number((percentage / 10).toFixed(2))}
              className="w-full"
            />
            <div className="flex flex-row justify-between items-center">
              <span>0%</span>
              <span>100%</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Consumido{" "}
              <span className="font-bold text-primary">
                {Number((percentage / 10).toFixed(2))}%
              </span>{" "}
              del presupuesto para el mes actual.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/add-expense" search={{ id: String(expense.id) }}>
            <Button size="lg" className="w-full">
              Editar
            </Button>
          </Link>
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
                  Esta acción eliminará el gasto seleccionado y no se puede
                  deshacer
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
      </div>
    </div>
  );
}
