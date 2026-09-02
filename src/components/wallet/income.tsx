import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IIncome } from "@/interfaces";
import { Badge } from "@/components/ui/badge";

export function Income({ income }: { income: IIncome }) {
  const isMobile = useIsMobile();
  const date = new Date(income.created_at);
  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="group flex flex-row items-center">
      <Link
        to="/transaction/$id"
        params={{ id: String(income.id) }}
        search={{ type: "income" }}
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
              {income.description.length > (isMobile ? 15 : 30)
                ? `${income.description.slice(0, isMobile ? 15 : 30)}...`
                : income.description}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
            {income.id_debt && (
              <Badge variant="outline" className="mt-1 w-fit text-[10px]">Deuda</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="font-bold md:text-xl text-green-600 dark:text-green-400">
            S/. {income.amount.toFixed(2)}
          </p>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </Link>
    </div>
  );
}
