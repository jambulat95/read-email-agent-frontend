"use client";

import { useState } from "react";
import {
  useAnalyticsSummary,
  useAnalyticsTrends,
  useAnalyticsProblems,
} from "@/hooks/useAnalytics";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/features/analytics/StatCard";
import { SentimentChart } from "@/components/features/analytics/SentimentChart";
import { SentimentPieChart } from "@/components/features/analytics/SentimentPieChart";
import { PriorityBarChart } from "@/components/features/analytics/PriorityBarChart";
import { ProblemsBarChart } from "@/components/features/analytics/ProblemsBarChart";

const periods = [
  { label: "7 дней", value: "7d" },
  { label: "30 дней", value: "30d" },
  { label: "90 дней", value: "90d" },
  { label: "Все время", value: "all" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const { data: summary, isLoading, isError } = useAnalyticsSummary(period);
  const { data: trends } = useAnalyticsTrends(period);
  const { data: problems } = useAnalyticsProblems(period);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Аналитика</h1>
          <p className="text-muted-foreground mt-1">
            Статистика и тренды отзывов
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p.value
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center mb-6">
          <p className="text-sm text-red-600">
            Не удалось загрузить данные. Попробуйте обновить страницу.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Всего отзывов"
            value={summary.total_reviews}
            subtitle={`${summary.unprocessed_count} не обработано`}
            icon={BarChart3}
            iconColor="text-blue-600 bg-blue-100"
          />
          <StatCard
            title="Позитивных"
            value={summary.positive_reviews}
            subtitle={
              summary.total_reviews > 0
                ? `${Math.round((summary.positive_reviews / summary.total_reviews) * 100)}% от всех`
                : undefined
            }
            icon={TrendingUp}
            iconColor="text-green-600 bg-green-100"
          />
          <StatCard
            title="Негативных"
            value={summary.negative_reviews}
            subtitle={
              summary.total_reviews > 0
                ? `${Math.round((summary.negative_reviews / summary.total_reviews) * 100)}% от всех`
                : undefined
            }
            icon={TrendingDown}
            iconColor="text-red-600 bg-red-100"
          />
          <StatCard
            title="Критических"
            value={summary.critical_count}
            subtitle="Требуют внимания"
            icon={AlertTriangle}
            iconColor="text-orange-600 bg-orange-100"
          />
        </div>
      ) : null}

      {/* Trends Chart */}
      {trends && trends.length > 0 && (
        <div className="mb-6">
          <SentimentChart data={trends} />
        </div>
      )}

      {/* Pie + Priority Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {summary && <SentimentPieChart summary={summary} />}
        {summary && <PriorityBarChart summary={summary} />}
      </div>

      {/* Problems Bar Chart */}
      {problems && problems.length > 0 && (
        <div className="mb-6">
          <ProblemsBarChart problems={problems} limit={10} />
        </div>
      )}

      {/* Average Response Time */}
      {summary && summary.avg_response_time_hours !== null && (
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg text-blue-600 bg-blue-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Среднее время обработки
              </p>
              <p className="text-2xl font-bold text-foreground">
                {summary.avg_response_time_hours.toFixed(1)} ч.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
