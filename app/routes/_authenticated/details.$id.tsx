import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { supabase } from "~/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/details/$id")({
  component: ExpenseDetailsPage,
});

function ExpenseDetailsPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const {
    expense,
    getExpenseById,
    loading,
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
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "expenses",
      }, () => getExpenseById(Number(id)))
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense?.categories?.label?.toLowerCase()
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
          <Text className="text-5xl tracking-tighter font-bold">
            S/ {expense?.amount}
          </Text>
          <Text className="text-lg text-muted-foreground">
            {expense.description}
          </Text>
        </div>
        <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
          <div className="flex flex-row justify-between items-center">
            <Text className="text-muted-foreground">Fecha</Text>
            <Text>
              {new Date(expense.date).toLocaleDateString("es-PE", {
                month: "long",
                day: "numeric",
              })}
            </Text>
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <Text className="text-muted-foreground">Hora</Text>
            <Text>
              {new Date(expense.date).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <Text className="text-muted-foreground">Categoria</Text>
            <Badge variant="outline">{expense?.categories?.label}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            <Progress
              value={Number((percentage / 10).toFixed(2))}
              className="w-full"
            />
            <div className="flex flex-row justify-between items-center">
              <Text>0%</Text>
              <Text>100%</Text>
            </div>
            <Text className="text-muted-foreground text-sm text-center">
              Consumido{" "}
              <Text className="font-bold text-primary">
                {Number((percentage / 10).toFixed(2))}%
              </Text>{" "}
              del presupuesto para el mes actual.
            </Text>
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
                  Esta acción eliminará el gasto seleccionado y no se puede deshacer
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
