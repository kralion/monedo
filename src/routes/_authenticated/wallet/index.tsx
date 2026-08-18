import { createFileRoute } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import { Budget } from "@/components/wallet/budget";
import { useBudgetStore } from "@/stores/budget";
import { IBudget } from "@/interfaces";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/wallet/")({
  component: WalletPage,
});

function WalletPage() {
  const { budgets, getBudgets, addBudget, loading } = useBudgetStore();
  const { user } = useNeonUser();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (user?.id) getBudgets(user.id);
  }, [user?.id]);

  async function handleSubmit() {
    if (!description.trim() || !amount) return;

    await addBudget({
      description: description.trim(),
      amount: Number(amount),
      user_id: user?.id as string,
    } as IBudget);

    setDescription("");
    setAmount("");
    setOpen(false);
  }

  const total = budgets.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-4xl mx-auto overflow-y-auto pb-28">
      <div className="flex flex-row items-center justify-between px-4 pt-4 md:px-6">
        <h1 className="text-2xl font-bold">Billetera</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo presupuesto</DialogTitle>
              <DialogDescription>
                Registra un ingreso para tu billetera.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label>Descripción</Label>
              <Input
                placeholder="Ej: Salario mensual"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Monto (S/)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
          budgets.map((budget) => (
            <div
              key={budget.id}
              className="border-b border-zinc-200 dark:border-zinc-700 "
            >
              <Budget budget={budget} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
