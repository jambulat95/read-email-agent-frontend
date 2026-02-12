"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ToneType } from "@/types";

export default function CompanySettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", "company"],
    queryFn: () => api.settings.getCompany(),
  });

  const [form, setForm] = useState({
    company_name: "",
    industry: "",
    response_tone: "professional" as ToneType,
    custom_instructions: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name || "",
        industry: settings.industry || "",
        response_tone: settings.response_tone,
        custom_instructions: settings.custom_instructions || "",
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.settings.updateCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "company"] });
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

      <h1 className="text-2xl font-bold text-foreground mb-6">
        Настройки компании
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Название компании
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) =>
                setForm({ ...form, company_name: e.target.value })
              }
              placeholder="ООО Компания"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Индустрия
            </label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="E-commerce, SaaS, и т.д."
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Тон ответов
            </label>
            <select
              value={form.response_tone}
              onChange={(e) =>
                setForm({
                  ...form,
                  response_tone: e.target.value as ToneType,
                })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="formal">Формальный</option>
              <option value="friendly">Дружелюбный</option>
              <option value="professional">Профессиональный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Дополнительные инструкции для AI
            </label>
            <textarea
              value={form.custom_instructions}
              onChange={(e) =>
                setForm({ ...form, custom_instructions: e.target.value })
              }
              placeholder="Особые указания для генерации ответов..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
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
          <p className="text-sm text-green-600">Настройки сохранены</p>
        )}
      </form>
    </div>
  );
}
