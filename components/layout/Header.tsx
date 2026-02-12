"use client";

import { useAuthStore } from "@/stores/authStore";
import { LogOut, User, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Главная", href: "/dashboard" as const, icon: LayoutDashboard },
  { name: "Отзывы", href: "/dashboard/reviews" as const, icon: MessageSquare },
  { name: "Аналитика", href: "/dashboard/analytics" as const, icon: BarChart3 },
  { name: "Настройки", href: "/dashboard/settings" as const, icon: Settings },
];

export function Header() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center">
          <Mail className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">ReviewAI</span>
        </div>

        {/* Spacer for desktop */}
        <div className="hidden md:block" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:block text-foreground font-medium">
              {user?.name || user?.email}
            </span>
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-20 py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                    {user?.plan}
                  </span>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border px-2 py-2 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
