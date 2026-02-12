"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AnalyticsSummary } from "@/types";

interface PriorityBarChartProps {
  summary: AnalyticsSummary;
}

export function PriorityBarChart({ summary }: PriorityBarChartProps) {
  const data = [
    { name: "Критический", value: summary.critical_count, fill: "#dc2626" },
    { name: "Высокий", value: summary.high_count, fill: "#ea580c" },
    { name: "Средний", value: summary.medium_count, fill: "#eab308" },
    { name: "Низкий", value: summary.low_count, fill: "#22c55e" },
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Распределение по приоритетам
      </h2>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value) => [value, "Кол-во"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
