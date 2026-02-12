"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: () => api.settings.getNotifications(),
  });

  const [form, setForm] = useState({
    email_enabled: false,
    email_address: "",
    telegram_enabled: false,
    telegram_chat_id: "",
    sms_enabled: false,
    phone_number: "",
    notify_on_negative: true,
    notify_on_critical: true,
    weekly_report: false,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        email_enabled: settings.email_enabled,
        email_address: settings.email_address || "",
        telegram_enabled: settings.telegram_enabled,
        telegram_chat_id: settings.telegram_chat_id || "",
        sms_enabled: settings.sms_enabled,
        phone_number: settings.phone_number || "",
        notify_on_negative: settings.notify_on_negative,
        notify_on_critical: settings.notify_on_critical,
        weekly_report: settings.weekly_report,
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.settings.updateNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-xl" />;
  }

  return (
    <div>
      <Link
        href="/dashboard/settings"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Настройки
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Уведомления</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Email */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Email уведомления
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.email_enabled}
                onChange={(e) =>
                  setForm({ ...form, email_enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
          {form.email_enabled && (
            <input
              type="email"
              value={form.email_address}
              onChange={(e) =>
                setForm({ ...form, email_address: e.target.value })
              }
              placeholder="email@example.com"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          )}
        </div>

        {/* Telegram */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Telegram уведомления
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.telegram_enabled}
                onChange={(e) =>
                  setForm({ ...form, telegram_enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
          {form.telegram_enabled && (
            <input
              type="text"
              value={form.telegram_chat_id}
              onChange={(e) =>
                setForm({ ...form, telegram_chat_id: e.target.value })
              }
              placeholder="Chat ID"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          )}
        </div>

        {/* Triggers */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Триггеры
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notify_on_negative}
                onChange={(e) =>
                  setForm({ ...form, notify_on_negative: e.target.checked })
                }
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-sm text-foreground">
                Негативные отзывы
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notify_on_critical}
                onChange={(e) =>
                  setForm({ ...form, notify_on_critical: e.target.checked })
                }
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-sm text-foreground">
                Критические обращения
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.weekly_report}
                onChange={(e) =>
                  setForm({ ...form, weekly_report: e.target.checked })
                }
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-sm text-foreground">
                Еженедельный отчёт
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {mutation.isPending ? "Сохранение..." : "Сохранить"}
        </button>

        {mutation.isSuccess && (
          <p className="text-sm text-green-600">Настройки сохранены</p>
        )}
      </form>
    </div>
  );
}
