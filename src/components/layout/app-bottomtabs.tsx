import { Link, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Tabs = [
  { name: "index", title: "Dashboard", href: "/", icon: Home },
  { name: "statistics", title: "Estadísticas", href: "/statistics", icon: BarChart3 },
  { name: "wallet", title: "Billetera", href: "/wallet", icon: Wallet },
  { name: "profile", title: "Perfil", href: "/profile", icon: User },
];

function TabItem({ tab, isActive }: { tab: (typeof Tabs)[number]; isActive: boolean }) {
  const Icon = tab.icon;

  return (
    <Link
      to={tab.href}
      className={cn(
        "relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-2 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
      aria-label={tab.title}
    >
      {isActive && (
        <span className="bg-primary absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full" />
      )}
      <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
      <span className="text-[10px] font-medium">{tab.title}</span>
    </Link>
  );
}

export default function AppBottomTabs() {
  const location = useLocation();
  const pathname = location.pathname || "/";

  const isItemActive = (href: string): boolean =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div
      className="md:hidden bg-background/70 border-border fixed right-0 bottom-0 left-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex h-[72px] items-stretch justify-around gap-1 px-2">
        {Tabs.map((tab) => (
          <TabItem key={tab.name} tab={tab} isActive={isItemActive(tab.href)} />
        ))}
      </div>
    </div>
  );
}
