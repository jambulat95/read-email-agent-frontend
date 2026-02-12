"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowLeft, Mail, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default function AccountsSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["emailAccounts"],
    queryFn: () => api.emailAccounts.list(),
  });
  const accounts = data?.accounts;

  const connectMutation = useMutation({
    mutationFn: () => api.emailAccounts.connectUrl(),
    onSuccess: (data) => {
      window.location.href = data.authorization_url;
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => api.emailAccounts.disconnect(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailAccounts"] });
    },
  });

  return (
    <div>
      <Link
        href="/dashboard/settings"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Настройки
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Email аккаунты
          </h1>
          <p className="text-muted-foreground mt-1">
            Управление подключёнными Gmail аккаунтами
          </p>
        </div>
        <button
          onClick={() => connectMutation.mutate()}
          disabled={connectMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Подключить Gmail
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border p-6 animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-48" />
            </div>
          ))}
        </div>
      ) : accounts && accounts.length > 0 ? (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl border border-border p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {account.email}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-xs font-medium ${account.is_active ? "text-green-600" : "text-red-600"}`}
                    >
                      {account.is_active ? "Активен" : "Отключён"}
                    </span>
                    {account.last_sync_at && (
                      <span className="text-xs text-muted-foreground">
                        Синхронизация:{" "}
                        {formatDateTime(account.last_sync_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => disconnectMutation.mutate(account.id)}
                disabled={disconnectMutation.isPending}
                className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Нет подключённых аккаунтов
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Подключите Gmail аккаунт для начала мониторинга отзывов
          </p>
          <button
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Подключить Gmail
          </button>
        </div>
      )}
    </div>
  );
}
