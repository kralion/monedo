import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useEffect, useState } from "react";
import Card from "@/components/dashboard/card";
import { Transaction } from "@/components/transaction";
import { Income } from "@/components/wallet/income";
import {
  groupTransactionsByDate,
  Transaction as TransactionItem,
  transactionDate,
} from "@/helpers/groupTransactionsByDate";
import { useIncomeStore } from "@/stores/income";
import { useExpenseStore } from "@/stores/expense";
import { useColorScheme } from "@/lib/useColorScheme";
import { authClient } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { User, Bookmark, Sun, Moon, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function TransactionRow({ t }: { t: TransactionItem }) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      {t.kind === "income" ? (
        <Income income={t.income} />
      ) : (
        <Transaction expense={t.expense} />
      )}
    </div>
  );
}

function DashboardPage() {
  const { user } = useNeonUser();
  const { getIncomes, incomes } = useIncomeStore();
  const { getRecentExpenses, expenses } = useExpenseStore();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const { colorScheme, setColorScheme } = useColorScheme();
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate({ to: "/sign-in" });
  }

  useEffect(() => {
    if (user?.id) {
      getRecentExpenses(user.id);
      getIncomes(user.id);
    }
  }, [user?.id]);

  const parsedExpenses = (expenses ?? []).map((expense) => ({
    ...expense,
    date: new Date(expense.date),
  }));

  const transactions: TransactionItem[] = [
    ...(incomes ?? []).map((income) => ({ kind: "income" as const, income })),
    ...parsedExpenses.map((expense) => ({
      kind: "expense" as const,
      expense,
    })),
  ].sort((a, b) => transactionDate(b).getTime() - transactionDate(a).getTime());

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.kind === filter);

  if (!expenses) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 max-w-4xl mx-auto">
      {showAll ? (
        <div className="overflow-y-auto pb-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center p-4">
              <Select
                value={filter}
                onValueChange={(value) =>
                  setFilter(value as "all" | "expense" | "income")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>                   <SelectItem value="income">Ingresos</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowAll(false)}
                variant="ghost"
                className="text-muted-foreground"
              >
                Ver Menos
              </Button>
            </div>
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-xl text-muted-foreground md:text-2xl">
                  No hay transacciones registradas
                </p>
              </div>
            ) : (
              Object.entries(groupTransactionsByDate(filteredTransactions)).map(
              ([dateLabel, dateTransactions]) => (
                <div key={dateLabel} className="px-4 space-y-2">
                  <h2 className="text-muted-foreground">{dateLabel}</h2>
                  <div className="space-y-0">
                    {dateTransactions.map((t) => (
                      <TransactionRow
                        key={                           t.kind === "income"
                            ? `income-${t.income.id}`
                            : `expense-${t.expense.id}`
                        }
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              ),
            )
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto pb-28 px-4 md:px-6">
          <div className="flex flex-row justify-between items-center py-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold dark:text-white">
                Hola {user?.firstName ?? ""} 👋🏻
              </h1>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("es-PE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-9 cursor-pointer">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.firstName ?? ""} />
                  <AvatarFallback>
                    {(user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/personal-info" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mis datos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories" className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Categorías
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}>
                  {colorScheme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Tema {colorScheme === "light" ? "oscuro" : "claro"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className=" md:pb-8 pb-4">
            <Card />
          </div>

          <div className="flex flex-row justify-between items-center w-full md:mt-6">
            <h2 className=" font-semibold dark:text-white">
              Transacciones Recientes
            </h2>
            <Button
              onClick={() => setShowAll(true)}
              variant="ghost"
              className="text-muted-foreground"
            >
              Ver más
            </Button>
          </div>
          <div className="space-y-0 mt-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-xl text-muted-foreground md:text-2xl">
                  No hay transacciones registradas
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-base">
                  Haz click en el botón "+" para registrar una transacción
                </p>
              </div>
            ) : (
              transactions.map((t) => (
                <TransactionRow
                  key={
                    t.kind === "income"
                      ? `income-${t.income.id}`
                      : `expense-${t.expense.id}`
                  }
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
