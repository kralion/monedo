import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IBudget } from "@/interfaces";

export function Budget({ budget }: { budget: IBudget }) {
  const isMobile = useIsMobile();
  const date = new Date(budget.created_at);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="group flex flex-row items-center">
      <Link
        to="/transaction/$id"
        params={{ id: String(budget.id) }}
        search={{ type: "budget" }}
        className="flex-1 flex flex-row justify-between items-center py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex flex-row items-center gap-2">
          <img
            src="https://img.icons8.com/?size=100&id=KV6GFslVNJhZ&format=png&color=000000"
            alt=""
            className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1.5 object-contain"
          />
          <div className="flex flex-col">
            <p className="md:text-lg">
              {budget.description.length > (isMobile ? 15 : 30)
                ? `${budget.description.slice(0, isMobile ? 15 : 30)}...`
                : budget.description}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="font-bold md:text-xl text-green-600 dark:text-green-400">
            S/. {budget.amount.toFixed(2)}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </Link>
    </div>
  );
}
