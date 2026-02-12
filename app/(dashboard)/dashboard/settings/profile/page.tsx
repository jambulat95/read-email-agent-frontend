"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: () => api.settings.getProfile(),
  });

  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.settings.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
      fetchUser();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-xl" />;
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

      <h1 className="text-2xl font-bold text-foreground mb-6">Профиль</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Имя
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
          <p className="text-sm text-green-600">Профиль обновлён</p>
        )}
      </form>
    </div>
  );
}
