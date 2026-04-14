import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Budget } from "@/components/wallet/budget";
import { useBudgetStore } from "@/stores/budget";

export const Route = createFileRoute("/_authenticated/wallet/")({
  component: WalletPage,
});

function WalletPage() {
  const { budgets, getBudgets } = useBudgetStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.id) getBudgets(user.id);
  }, [user?.id]);

  const total = budgets.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-4xl mx-auto overflow-y-auto pb-28">
      <div className="flex flex-col items-center py-8 bg-zinc-100 dark:bg-zinc-800 rounded-2xl m-4">
        <img
          src="https://img.icons8.com/?size=200&id=JQX2fDPyQq4E&format=png&color=000000"
          alt=""
          className="w-24 h-24 md:w-32 md:h-32"
        />
        <div className="p-4">
          <p className="mb-1 text-center text-muted-foreground md:text-lg">
            Total en billetera
          </p>
          <p className="text-center text-3xl font-bold md:text-4xl">
            S/ {total}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-xl p-4 md:px-6">
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-xl text-muted-foreground md:text-2xl">
              No hay presupuestos registrados
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Rellena el formulario y registra uno para el mes actual.
            </p>
          </div>
        ) : (
          budgets.map((budget) => <Budget key={budget.id} budget={budget} />)
        )}
      </div>
    </div>
  );
}
