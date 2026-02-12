"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendPoint } from "@/types";

interface SentimentChartProps {
  data: TrendPoint[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  const formatted = data.map((point) => ({
    ...point,
    date: new Date(point.date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Динамика отзывов
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="positive"
              name="Позитивные"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              name="Негативные"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              name="Нейтральные"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Всего"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
