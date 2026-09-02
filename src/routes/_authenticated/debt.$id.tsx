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
import { useDebtStore } from "@/stores/debt";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Activa", variant: "default" },
  paid: { label: "Pagada", variant: "secondary" },
  overdue: { label: "Vencida", variant: "destructive" },
  partial: { label: "Parcial", variant: "outline" },
};

export const Route = createFileRoute("/_authenticated/debt/$id")({
  component: DebtDetailsPage,
});

function DebtDetailsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const { debt, getDebtById, deleteDebt } = useDebtStore();

  useEffect(() => {
    getDebtById(Number(id));
  }, [id]);

  const isLoading = !debt;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const handleDelete = () => {
    deleteDebt(debt.id);
    navigate({ to: "/debts" });
  };

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
          <p className="text-5xl font-bold tracking-tighter">
            S/ {debt.amount.toFixed(2)}
          </p>
          <p className="text-lg text-muted-foreground">{debt.name}</p>
          <Badge variant={statusLabels[debt.status]?.variant ?? "default"}>
            {statusLabels[debt.status]?.label ?? debt.status}
          </Badge>
        </div>
        <div className="flex flex-col gap-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
          {debt.creditor && (
            <>
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Acreedor</span>
                <span>{debt.creditor}</span>
              </div>
              <Separator />
            </>
          )}
          {debt.original_amount && (
            <>
              <div className="flex flex-row justify-between items-center">
                <span className="text-muted-foreground">Monto original</span>
                <span>S/ {debt.original_amount.toFixed(2)}</span>
              </div>
              <Separator />
            </>
          )}

          <div className="flex flex-row justify-between items-center">
            <span className="text-muted-foreground">Fecha de creación</span>
            <span>
              {new Date(debt.created_at).toLocaleDateString("es-PE", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {debt.notes && (
            <>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Notas</span>
                <span>{debt.notes}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Link to="/add-debt" search={{ id: String(debt.id) }}>
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
                  Esta acción eliminará la deuda seleccionada y no se puede
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
