"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { AnalyticsSummary } from "@/types";

interface SentimentPieChartProps {
  summary: AnalyticsSummary;
}

const COLORS = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#9ca3af",
  mixed: "#eab308",
};

const LABELS: Record<string, string> = {
  positive: "Позитивные",
  negative: "Негативные",
  neutral: "Нейтральные",
  mixed: "Смешанные",
};

export function SentimentPieChart({ summary }: SentimentPieChartProps) {
  const data = [
    { name: "positive", value: summary.positive_reviews },
    { name: "negative", value: summary.negative_reviews },
    { name: "neutral", value: summary.neutral_reviews },
    { name: "mixed", value: summary.mixed_reviews },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Распределение тональности
        </h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          Нет данных
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Распределение тональности
      </h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${LABELS[name || ""] || name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                value,
                LABELS[name as string] || name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
