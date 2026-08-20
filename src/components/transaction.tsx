import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { expensesIdentifiers } from "@/constants/ExpensesIdentifiers";
import { formatDate } from "@/helpers/dateFormatter";
import { IExpense } from "@/interfaces";
export function Transaction({ expense }: { expense: IExpense }) {
  const assetIndentificador =
    expensesIdentifiers.find(
      (icon) =>
        icon.label.toLowerCase() === expense.categories?.label?.toLowerCase(),
    )?.iconHref ||
    "https://img.icons8.com/?size=160&id=MjAYkOMsbYOO&format=png";

  return (
    <Link
      to="/transaction/$id"
      params={{ id: String(expense.id) }}
      search={{ type: "expense" }}
      className="flex flex-1 py-2 flex-row gap-2 items-center  rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      <img
        src={assetIndentificador}
        alt=""
        className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5 object-contain"
      />
      <div className="flex flex-row justify-between items-center flex-1">
        <div className="flex flex-col">
          <h3 className="md:text-lg dark:text-white">
            {expense.description.length > 25
              ? `${expense.description.slice(0, 25)}...`
              : expense.description}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(expense?.date as Date)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <p className="md:text-xl font-semibold text-red-500 dark:text-red-400">
            S/{expense.amount.toFixed(2)}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </Link>
  );
}
