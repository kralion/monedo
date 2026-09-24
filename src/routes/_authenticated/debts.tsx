import { createFileRoute, Link } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useMemo, useState } from "react";
import { useDebtStore } from "@/stores/debt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/helpers/dateFormatter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronRight, HandCoins, Plus, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { IDebt } from "@/interfaces";

type DebtFilter = "all" | "active" | "paid";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  active: { label: "Activa", variant: "default" },
  paid: { label: "Pagada", variant: "secondary" },
  overdue: { label: "Vencida", variant: "destructive" },
  partial: { label: "Parcial", variant: "outline" },
};

export const Route = createFileRoute("/_authenticated/debts")({
  component: DebtsPage,
  pendingComponent: DebtsPending,
});

function DebtListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-700"
        >
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function DebtsPending() {
  return (
    <div className="bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center p-4 pt-7">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
      <div className="overflow-y-auto pb-28 px-4">
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>
        <div className="mt-4">
          <DebtListSkeleton />
        </div>
      </div>
    </div>
  );
}

function DebtRow({ debt }: { debt: IDebt }) {
  const isMobile = useIsMobile();
  const displayName =
    debt.name.length > (isMobile ? 18 : 30)
      ? `${debt.name.slice(0, isMobile ? 18 : 30)}...`
      : debt.name;

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      <Link
        to="/debt/$id"
        params={{ id: String(debt.id) }}
        className="flex flex-1 py-2 flex-row gap-2 items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="size-10 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
          <HandCoins className="size-5 text-zinc-600 dark:text-zinc-300" />
        </div>
        <div className="flex flex-row justify-between items-center flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <h3 className="md:text-lg dark:text-white truncate">{displayName}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {debt.creditor
                ? `${debt.creditor} • ${formatDate(debt.created_at)}`
                : formatDate(debt.created_at)}
            </p>
            <Badge
              variant={statusLabels[debt.status]?.variant ?? "default"}
              className="mt-1 w-fit text-[10px] leading-none px-1.5 py-0.5"
            >
              {statusLabels[debt.status]?.label ?? debt.status}
            </Badge>
          </div>
          <div className="flex flex-row items-center gap-2 shrink-0 ml-2">
            <p className="md:text-xl font-semibold">S/ {debt.amount.toFixed(2)}</p>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </Link>
    </div>
  );
}

function DebtsPage() {
  const { user } = useNeonUser();
  const { debts, loading, getDebts } = useDebtStore();
  const [filter, setFilter] = useState<DebtFilter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.id) getDebts(user.id);
  }, [user?.id]);

  const filteredDebts = useMemo(() => {
    let result = debts;

    if (filter === "paid") result = result.filter((d) => d.status === "paid");
    else if (filter === "active") result = result.filter((d) => d.status !== "paid");

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((d) => d.name.toLowerCase().includes(q));
    }

    return result;
  }, [debts, filter, search]);

  return (
    <div className="bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center p-4 pt-7">
          <div>
            <h1 className="text-3xl font-bold md:text-5xl">Deudas</h1>
            <span className="text-sm md:text-md">
              Gestiona el dinero que te deben.
            </span>
          </div>
          <Link to="/add-debt" search={{ id: undefined }}>
            <Button size="icon">
              <Plus />
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-y-auto pb-28 px-4">
        <div className="flex flex-col gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as DebtFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Activas</TabsTrigger>
              <TabsTrigger value="paid">Pagadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-0 mt-4">
          {loading ? (
            <DebtListSkeleton />
          ) : filteredDebts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-xl text-muted-foreground md:text-2xl">
                {debts.length === 0
                  ? "No hay deudas registradas"
                  : search.trim()
                    ? `Sin resultados para "${search.trim()}"`
                    : filter === "active"
                      ? "No hay deudas activas"
                      : filter === "paid"
                        ? "No hay deudas pagadas"
                        : "No hay deudas registradas"}
              </p>
              <p className="text-center text-sm text-muted-foreground md:text-base">
                {debts.length === 0
                  ? 'Haz click en "+" para registrar una deuda'
                  : search.trim()
                    ? "Intenta con otro nombre"
                    : "No hay resultados para este filtro"}
              </p>
            </div>
          ) : (
            filteredDebts.map((debt) => <DebtRow key={debt.id} debt={debt} />)
          )}
        </div>
      </div>
    </div>
  );
}
