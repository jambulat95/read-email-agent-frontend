"use client";

import Link from "next/link";
import { User, Bell, Building2, Mail } from "lucide-react";

const settingsItems = [
  {
    name: "Профиль",
    description: "Имя, email и пароль",
    href: "/dashboard/settings/profile",
    icon: User,
  },
  {
    name: "Уведомления",
    description: "Email, Telegram и SMS уведомления",
    href: "/dashboard/settings/notifications",
    icon: Bell,
  },
  {
    name: "Компания",
    description: "Название, индустрия и тон ответов",
    href: "/dashboard/settings/company",
    icon: Building2,
  },
  {
    name: "Email аккаунты",
    description: "Подключённые Gmail аккаунты",
    href: "/dashboard/settings/accounts",
    icon: Mail,
  },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground mt-1">
          Управление аккаунтом и настройками платформы
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {settingsItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="bg-white rounded-xl border border-border p-6 hover:shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {item.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
