import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronsUpDown, Check } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { ICategory, IExpense } from "~/interfaces";
import { useBudgetStore } from "~/stores/budget";
import { useExpenseStore } from "~/stores/expense";
import { useCategoryStore } from "~/stores/category";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/add-expense")({
  component: AddExpensePage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
});

function AddExpensePage() {
  const { addExpense, loading, expense, updateExpense, getExpenseById } =
    useExpenseStore();
  const { id } = Route.useSearch();
  const { categories, getCategories } = useCategoryStore();
  const [openCollapsible, setOpenCollapsible] = useState(false);
  const { isOutOfBudget, checkBudget } = useBudgetStore();
  const [category, setCategory] = useState<ICategory | undefined>();
  const { user } = useUser();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors }, reset, setValue } =
    useForm<IExpense>();

  useEffect(() => {
    if (id && expense) {
      setValue("description", expense.description);
      setValue("amount", expense.amount);
      setValue("id_category", expense.id_category);
      setCategory(categories.find((c) => c.id === expense.id_category));
    }
  }, [id, expense]);

  useEffect(() => {
    if (user?.id) getCategories(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (id) getExpenseById(Number(id));
  }, [id]);

  async function onSubmit(data: IExpense) {
    if (isOutOfBudget) {
      toast.error("No tienes suficiente fondos para registrar este gasto");
      return;
    }
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
    if (user?.id) checkBudget(user.id);
  }

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-zinc-900 max-w-xl mx-auto p-4 pb-28">
      <div className="flex flex-col gap-6">
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
        <div className="flex flex-col gap-2">
          <Collapsible open={openCollapsible} onOpenChange={setOpenCollapsible}>
            <CollapsibleTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="justify-between flex flex-row dark:bg-zinc-700 dark:border-zinc-900"
              >
                {category?.label ? (
                  <span className="dark:text-white">{category.label}</span>
                ) : (
                  <span>Categoría</span>
                )}
                <ChevronsUpDown className="w-4 h-4 text-gray-500" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2 mt-4">
              {categories.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="lg"
                  className="flex flex-row items-center justify-between dark:bg-zinc-700 dark:border-zinc-900"
                  onClick={() => {
                    setCategory(item);
                    setOpenCollapsible(false);
                  }}
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                  {category?.id === item.id && (
                    <Check className="w-5 h-5 text-foreground" />
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
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
      </div>
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
    </div>
  );
}
