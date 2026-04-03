import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "~/helpers/dateFormatter";
import { IExpense } from "~/interfaces";
export function Expense({ expense }: { expense: IExpense }) {
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense.categories?.label?.toLowerCase()
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  return (
    <Link
      to="/details/$id"
      params={{ id: expense.id }}
      className="flex flex-row gap-2 items-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
    >
      <img
        src={assetIndentificador}
        alt=""
        className="w-12 h-12 md:w-14 md:h-14 bg-zinc-100 dark:bg-zinc-800 rounded-full p-2 object-contain"
      />
      <div className="flex flex-row justify-between items-center flex-1 py-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold dark:text-white">
            {expense.categories?.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {expense.description.length > 25
              ? `${expense.description.slice(0, 25)}...`
              : expense.description}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl font-semibold text-red-500 dark:text-red-400">
              - S/{expense.amount}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(expense?.date as Date)}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </Link>
  );
}
