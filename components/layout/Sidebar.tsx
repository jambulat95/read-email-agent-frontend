"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  Mail,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Главная", href: "/dashboard" as const, icon: LayoutDashboard },
  { name: "Отзывы", href: "/dashboard/reviews" as const, icon: MessageSquare },
  { name: "Аналитика", href: "/dashboard/analytics" as const, icon: BarChart3 },
  { name: "Биллинг", href: "/dashboard/billing" as const, icon: CreditCard },
  { name: "Настройки", href: "/dashboard/settings" as const, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-border overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Mail className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">
            ReviewAI
          </span>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
