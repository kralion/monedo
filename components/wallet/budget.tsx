import { Link } from "@tanstack/react-router";
import { ChevronRight, Trash } from "lucide-react";
import { IBudget } from "@/interfaces";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import { useBudgetStore } from "~/stores/budget";
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
} from "../ui/alert-dialog";

export function Budget({ budget }: { budget: IBudget }) {
  const date = new Date(budget.created_At);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const { deleteBudget } = useBudgetStore();

  const onDelete = () => {
    deleteBudget(budget.id as number);
  };

  return (
    <>
      <div className="group flex flex-row items-center">
        <Link
          to="/wallet/edit/$id"
          params={{ id: String(budget.id) }}
          className="flex-1 flex flex-row justify-between items-center py-3 md:py-4 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="flex flex-row items-center gap-2">
            <div className="w-12 h-12 bg-brand/20 rounded-full p-2 flex items-center justify-center">
              <img
                src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000"
                alt=""
                className="w-8 h-8"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Text className="text-lg md:text-xl">
                {budget.description.length > 25
                  ? `${budget.description.slice(0, 25)}...`
                  : budget.description}
              </Text>
              <Text className="text-muted-foreground text-sm">{formattedDate}</Text>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <Text className="font-bold text-xl text-brand md:text-2xl">
              + S/ {budget.amount}
            </Text>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 text-destructive shrink-0"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará el presupuesto seleccionado y no se puede deshacer
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-white">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />
    </>
  );
}
