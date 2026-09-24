import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { Transaction as TransactionComponent } from "@/components/transaction";
import { Income } from "@/components/wallet/income";
import {
  groupTransactionsByDate,
  transactionDate,
  type Transaction as TransactionItem,
} from "@/helpers/groupTransactionsByDate";
import { Skeleton } from "@/components/ui/skeleton";

type FlatRow =
  | { type: "header"; label: string }
  | { type: "transaction"; transaction: TransactionItem };

const PAGE_SIZE = 20;

export function AllTransactionsVirtualList({
  userId,
  filter,
}: {
  userId: string;
  filter: "all" | "expense" | "income";
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { getIncomesPaginated } = useIncomeStore();
  const { getExpensesPaginated } = useExpenseStore();

  const [incomesAcc, setIncomesAcc] = useState<TransactionItem[]>([]);
  const [expensesAcc, setExpensesAcc] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchPage = useCallback(
    async (pageToFetch: number) => {
      if (!userId) return;
      setIsFetching(true);
      try {
        const offset = pageToFetch * PAGE_SIZE;
        let incomes: TransactionItem[] = [];
        let expenses: TransactionItem[] = [];

        if (filter === "all" || filter === "income") {
          const data = await getIncomesPaginated(userId, PAGE_SIZE, offset);
          incomes = data.map((income) => ({ kind: "income" as const, income }));
        }
        if (filter === "all" || filter === "expense") {
          const data = await getExpensesPaginated(userId, PAGE_SIZE, offset);
          const parsed = data.map((e) => ({ ...e, date: e.date ? new Date(e.date as string) : new Date() }));
          expenses = parsed.map((expense) => ({
            kind: "expense" as const,
            expense: expense as unknown as typeof expense & { date: Date },
          }));
        }

        if (pageToFetch === 0) {
          setIncomesAcc(incomes);
          setExpensesAcc(expenses);
        } else {
          setIncomesAcc((prev) => [...prev, ...incomes]);
          setExpensesAcc((prev) => [...prev, ...expenses]);
        }

        const hasMoreIncomes = filter === "income" || filter === "all" ? incomes.length === PAGE_SIZE : false;
        const hasMoreExpenses = filter === "expense" || filter === "all" ? expenses.length === PAGE_SIZE : false;
        // hasMore if any source still has data
        if (filter === "all") {
          setHasMore(hasMoreIncomes || hasMoreExpenses);
        } else if (filter === "income") {
          setHasMore(hasMoreIncomes);
        } else {
          setHasMore(hasMoreExpenses);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetching(false);
        setInitialLoading(false);
      }
    },
    [userId, filter, getIncomesPaginated, getExpensesPaginated]
  );

  // reset on filter/user change
  useEffect(() => {
    setPage(0);
    setIncomesAcc([]);
    setExpensesAcc([]);
    setHasMore(true);
    setInitialLoading(true);
    fetchPage(0);
  }, [filter, userId, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  }, [hasMore, isFetching, page, fetchPage]);

  const transactions: TransactionItem[] = useMemo(() => {
    const all = [...incomesAcc, ...expensesAcc];
    return all.sort((a, b) => transactionDate(b).getTime() - transactionDate(a).getTime());
  }, [incomesAcc, expensesAcc]);

  const flatRows: FlatRow[] = useMemo(() => {
    if (transactions.length === 0) return [];
    const grouped = groupTransactionsByDate(transactions);
    const rows: FlatRow[] = [];
    for (const [label, items] of Object.entries(grouped)) {
      rows.push({ type: "header", label });
      for (const t of items) {
        rows.push({ type: "transaction", transaction: t });
      }
    }
    return rows;
  }, [transactions]);

  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (flatRows[index]?.type === "header" ? 36 : 72),
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // infinite scroll trigger when near end
  useEffect(() => {
    if (flatRows.length === 0) return;
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    if (lastItem.index >= flatRows.length - 6 && hasMore && !isFetching) {
      loadMore();
    }
  }, [virtualItems, flatRows.length, hasMore, isFetching, loadMore]);

  if (initialLoading) {
    return (
      <div className="px-4 space-y-3 py-4">
        <Skeleton className="h-4 w-24 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-700"
          >
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
        <Skeleton className="h-4 w-24 mt-4 mb-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`s-${i}`}
            className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-700"
          >
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>
    );
  }

  if (flatRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-center text-xl text-muted-foreground md:text-2xl">
          No hay transacciones registradas
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ height: "calc(100dvh - 180px)" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const row = flatRows[virtualItem.index];
          if (!row) return null;
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {row.type === "header" ? (
                <div className="px-4 py-2 bg-white dark:bg-zinc-900 sticky top-0">
                  <h2 className="text-muted-foreground text-sm font-medium">{row.label}</h2>
                </div>
              ) : (
                <div className="px-4 border-b border-zinc-200 dark:border-zinc-700">
                  {row.transaction.kind === "income" ? (
                    <Income income={row.transaction.income} />
                  ) : (
                    <TransactionComponent expense={row.transaction.expense} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isFetching && (
        <div className="px-4 space-y-3 py-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-700"
            >
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      )}
      {!hasMore && flatRows.length > 0 && (
        <div className="flex justify-center py-4">
          <p className="text-sm text-muted-foreground">No hay más transacciones</p>
        </div>
      )}
    </div>
  );
}
