"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ProblemStat } from "@/types";

interface ProblemsBarChartProps {
  problems: ProblemStat[];
  limit?: number;
}

export function ProblemsBarChart({ problems, limit = 8 }: ProblemsBarChartProps) {
  const data = problems.slice(0, limit).map((p) => ({
    name: p.problem.length > 20 ? p.problem.slice(0, 20) + "..." : p.problem,
    fullName: p.problem,
    count: p.count,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Тренды проблем
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
        Тренды проблем
      </h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
              formatter={(value) => [value, "Упоминаний"]}
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload?.fullName) {
                  return payload[0].payload.fullName;
                }
                return "";
              }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
