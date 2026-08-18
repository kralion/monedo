import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { IBudget } from "@/interfaces";

export function Budget({ budget }: { budget: IBudget }) {
  const date = new Date(budget.created_At);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="group flex flex-row items-center">
      <Link
        to="/wallet/edit/$id"
        params={{ id: String(budget.id) }}
        className="flex-1 flex flex-row justify-between items-center p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex flex-row items-center gap-2">
          <img
            src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000"
            alt=""
            className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5 object-contain"
          />
          <div className="flex flex-col">
            <p className="text-lg">
              {budget.description.length > 25
                ? `${budget.description.slice(0, 25)}...`
                : budget.description}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="font-bold text-xl ">S/ {budget.amount.toFixed(2)}</p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </Link>
    </div>
  );
}
