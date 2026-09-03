import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { ICategory, IExpense } from "@/interfaces";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { useCategoryStore } from "@/stores/category";
import { useDebtStore } from "@/stores/debt";

export const Route = createFileRoute("/_authenticated/add-transaction")({
  component: AddTransactionPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
});

function AddTransactionPage() {
  const { addExpense, loading, expense, updateExpense, getExpenseById } =
    useExpenseStore();
  const {
    addIncome,
    loading: incomeLoading,
  } = useIncomeStore();
  const { id } = Route.useSearch();
  const { categories, getCategories } = useCategoryStore();
  const [category, setCategory] = useState<ICategory | undefined>();
  const { user } = useNeonUser();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setValue } = useForm<IExpense>({
    defaultValues: { date: new Date() },
  });
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [incomeDebtId, setIncomeDebtId] = useState<number | null>(null);
  const { debts, getDebts } = useDebtStore();

  useEffect(() => {
    if (id && expense) {
      setValue("description", expense.description);
      setValue("amount", expense.amount);
      setValue("id_category", expense.id_category);
      setValue("date", new Date(expense.date));
      setCategory(categories.find((c) => c.id === expense.id_category));
    }
  }, [id, expense]);

  useEffect(() => {
    if (user?.id) {
      getCategories(user.id);
      getDebts(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (id) getExpenseById(Number(id));
  }, [id]);

  async function onSubmit(data: IExpense) {
    if (!category?.id) {
      toast.error("Debes seleccionar una categoría");
      return;
    }

    if (id) {
      await updateExpense({
        ...data,
        id_category: category.id,
        user_id: user?.id as string,
        id: Number(id),
      });
    } else {
      await addExpense({
        ...data,
        currency: data.currency ?? "Soles",
        user_id: user?.id as string,
        id_category: category.id,
      });
    }

    reset();
    navigate({ to: "/" });
  }

  async function onIncomeSubmit() {
    if (!incomeDescription.trim() || !incomeAmount) return;

    await addIncome({
      description: incomeDescription.trim(),
      amount: Number(incomeAmount),
      user_id: user?.id as string,
      created_at: incomeDate,
      id_debt: incomeDebtId,
    });
    setIncomeDescription("");
    setIncomeAmount("");
    setIncomeDate(new Date());
    setIncomeDebtId(null);
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 max-w-xl mx-auto p-4 pb-28">
      <Tabs defaultValue="gasto" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="gasto" className="flex-1">
            Gasto
          </TabsTrigger>
          <TabsTrigger value="ingreso" className="flex-1">
            Ingreso
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gasto" className="flex flex-col gap-4 mt-6">
          <Controller
            control={control}
            name="amount"
            rules={{ required: true, min: 1 }}
            render={({ field: { onChange, value } }) => (
              <input
                type="number"
                autoFocus
                className="h-36 text-5xl text-center font-bold dark:text-white bg-transparent border-none focus:outline-none w-full"
                placeholder="S/ 50.00"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              />
            )}
          />
          <Select
            value={category?.id ? String(category.id) : undefined}
            onValueChange={(value) =>
              setCategory(categories.find((c) => String(c.id) === value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  <div className="flex flex-row gap-3 items-center">
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Textarea
                placeholder="Nota de gasto..."
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[100px]"
              />
            )}
          />
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                date={value ? new Date(value) : undefined}
                onDateChange={onChange}
              />
            )}
          />
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
              navigate({ to: "/" });
            }}
          >
            Cancelar
          </Button>
        </TabsContent>
        <TabsContent value="ingreso" className="flex flex-col gap-6 mt-6">
          <input
            type="number"
            autoFocus
            className="h-36 text-5xl text-center font-bold dark:text-white bg-transparent border-none focus:outline-none w-full"
            placeholder="S/ 50.00"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Ej: Salario mensual"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Vincular a deuda (opcional)</Label>
            <Select
              value={incomeDebtId ? String(incomeDebtId) : "none"}
              onValueChange={(value) =>
                setIncomeDebtId(value === "none" ? null : Number(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ninguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna</SelectItem>
                {debts
                  .filter((d) => d.status !== "paid")
                  .map((debt) => (
                    <SelectItem key={debt.id} value={String(debt.id)}>
                      {debt.name} — S/. {debt.amount.toFixed(2)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Fecha</Label>
            <DatePicker date={incomeDate} onDateChange={(d) => setIncomeDate(d ?? new Date())} />
          </div>
          <Button
            className="rounded-full"
            onClick={onIncomeSubmit}
            size="lg"
            disabled={incomeLoading}
          >
            {incomeLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <span className="dark:text-black">Registrar</span>
            )}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full"
            onClick={() => navigate({ to: "/" })}
          >
            Cancelar
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
