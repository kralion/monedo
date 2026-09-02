import { createFileRoute, Link } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect } from "react";
import { useDebtStore } from "@/stores/debt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Activa", variant: "default" },
  paid: { label: "Pagada", variant: "secondary" },
  overdue: { label: "Vencida", variant: "destructive" },
  partial: { label: "Parcial", variant: "outline" },
};

export const Route = createFileRoute("/_authenticated/debts")({
  component: DebtsPage,
});

function DebtsPage() {
  const { user } = useNeonUser();
  const { debts, loading, getDebts } = useDebtStore();

  useEffect(() => {
    if (user?.id) getDebts(user.id);
  }, [user?.id]);

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center p-4 pt-7">
          <h1 className="text-4xl font-bold md:text-5xl">Deudas</h1>
          <Link to="/add-debt" search={{ id: undefined }}>
            <Button size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-y-auto pb-28 px-4">
        <div className="flex flex-col gap-4 mt-4">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : debts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-xl text-muted-foreground md:text-2xl">
                No hay deudas registradas
              </p>
              <p className="text-center text-sm text-muted-foreground md:text-base">
                Haz click en "+" para registrar una deuda
              </p>
            </div>
          ) : (
            debts.map((debt) => (
              <Link
                key={debt.id}
                to="/debt/$id"
                params={{ id: String(debt.id) }}
                className="flex flex-col gap-3 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold">{debt.name}</p>
                    {debt.creditor && (
                      <p className="text-sm text-muted-foreground">{debt.creditor}</p>
                    )}
                  </div>
                  <Badge variant={statusLabels[debt.status]?.variant ?? "default"}>
                    {statusLabels[debt.status]?.label ?? debt.status}
                  </Badge>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-2xl font-bold">S/ {debt.amount.toFixed(2)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
