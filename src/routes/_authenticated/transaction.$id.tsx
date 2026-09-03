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
import { Separator } from "@/components/ui/separator";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { useDebtStore } from "@/stores/debt";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

const transactionTypeSchema = z.object({
  type: z.enum(["income", "expense"]).default("expense"),
});

export const Route = createFileRoute("/_authenticated/transaction/$id")({
  validateSearch: transactionTypeSchema,
  component: TransactionDetailsPage,
});

function TransactionDetailsPage() {
  const { id } = Route.useParams();
  const { type } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate();
  const { expense, getExpenseById, deleteExpense } = useExpenseStore();
  const { income, getIncomeById, deleteIncome } = useIncomeStore();
  const { debt, getDebtById } = useDebtStore();

  useEffect(() => {
    if (type === "expense") {
      getExpenseById(Number(id));
    } else {
      getIncomeById(Number(id));
    }
  }, [id, type]);

  useEffect(() => {
    if (type === "income" && income?.id_debt) {
      getDebtById(income.id_debt);
    }
  }, [type, income?.id_debt]);

  const isLoading = type === "expense" ? !expense : !income;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const handleDelete = async () => {
    if (type === "expense") {
      await deleteExpense(expense?.id as number);
    } else {
      await deleteIncome(income?.id as number);
    }
    navigate({ to: "/" });
  };

  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense?.categories?.label?.toLowerCase(),
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  const formattedIncomeDate = income?.created_at
    ? new Date(income.created_at).toLocaleDateString("es-PE", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

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
        {type === "expense" && expense ? (
          <>
            <div className="flex flex-col gap-4 items-center">
              <img
                src={assetIndentificador}
                alt=""
                className="size-36 bg-zinc-100 dark:bg-zinc-800 rounded-full p-6 object-contain"
              />
              <p className="text-5xl font-bold tracking-tighter">
                S/. {expense?.amount.toFixed(2)}
              </p>
              <p className="text-lg text-muted-foreground">
                {expense.description}
              </p>
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
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/add-transaction" search={{ id: String(expense.id) }}>
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
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 items-center">
              <img
                src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000"
                alt=""
                className="size-36 bg-zinc-100 dark:bg-zinc-800 rounded-full p-6 object-contain"
              />
              <p className="text-5xl font-bold tracking-tighter">
                S/ {income?.amount.toFixed(2)}
              </p>
              <p className="text-lg text-muted-foreground">
                {income?.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Fecha</span>
                <span>{formattedIncomeDate}</span>
              </div>
              <Separator />
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Tipo</span>
                <span>Ingreso</span>
              </div>
              {income?.id_debt && debt && (
                <>
                  <Separator />
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-muted-foreground">Deuda</span>
                    <Badge variant="outline">{debt.name}</Badge>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/edit/$id" params={{ id: String(income?.id) }}>
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
