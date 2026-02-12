"use client";

import type { ProblemStat } from "@/types";

interface TopProblemsProps {
  problems: ProblemStat[];
  limit?: number;
}

export function TopProblems({ problems, limit = 5 }: TopProblemsProps) {
  const items = problems.slice(0, limit);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Топ проблем
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Нет данных по проблемам
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((problem, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-5 flex-shrink-0">
                {i + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-foreground truncate">
                    {problem.problem}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {problem.count} ({problem.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${problem.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
