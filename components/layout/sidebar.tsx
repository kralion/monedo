import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  BarChart3,
  User,
  Wallet,
  Plus,
} from "lucide-react";
import { cn } from "~/lib/utils";

const Tabs = [
  { name: "index", title: "Dashboard", href: "/", icon: Home },
  { name: "statistics", title: "Estadísticas", href: "/statistics", icon: BarChart3 },
  { name: "profile", title: "Perfil", href: "/profile", icon: User },
  { name: "wallet", title: "Billetera", href: "/wallet", icon: Wallet },
];

export function Sidebar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-[260px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 sticky top-0 h-screen flex-col">
        <div className="p-4 flex items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">M</span>
          </div>
          <span className="text-xl font-bold">Monedo</span>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          {Tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== "/" && pathname.startsWith(tab.href));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors",
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-700"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <Icon
                  className={cn("w-5 h-5", isActive ? "text-primary" : "opacity-70")}
                />
                <span
                  className={cn(
                    "text-base",
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {tab.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav - visible only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl flex items-center justify-around z-50">
        {Tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4",
                isActive ? "text-primary" : "text-zinc-500"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{tab.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* FAB - Add expense */}
      <Link
        to="/add-expense"
        className="fixed right-4 bottom-28 md:right-8 md:bottom-32 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-40"
      >
        <Plus className="w-8 h-8 text-white" />
      </Link>
    </>
  );
}
