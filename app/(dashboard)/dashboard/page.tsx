"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import {
  useAnalyticsSummary,
  useAnalyticsTrends,
  useAnalyticsProblems,
} from "@/hooks/useAnalytics";
import {
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/features/analytics/StatCard";
import { SentimentChart } from "@/components/features/analytics/SentimentChart";
import { TopProblems } from "@/components/features/analytics/TopProblems";
import { RecentCritical } from "@/components/features/analytics/RecentCritical";

const periods = [
  { label: "День", value: "1d" },
  { label: "Неделя", value: "7d" },
  { label: "Месяц", value: "30d" },
  { label: "Все время", value: "all" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState("30d");

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(period);
  const { data: trends } = useAnalyticsTrends(period);
  const { data: problems } = useAnalyticsProblems(period);

  const { data: recentReviews } = useQuery({
    queryKey: ["reviews", { page: 1, page_size: 20 }],
    queryFn: () => api.reviews.list({ page: 1, page_size: 20 }),
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Добро пожаловать, {user?.full_name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Обзор активности
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

      {/* Stats Grid */}
      {summaryLoading ? (
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
            icon={MessageSquare}
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
            icon={AlertTriangle}
            iconColor="text-red-600 bg-red-100"
          />
          <StatCard
            title="Обработано"
            value={summary.processed_count}
            subtitle={
              summary.total_reviews > 0
                ? `${Math.round((summary.processed_count / summary.total_reviews) * 100)}% обработано`
                : undefined
            }
            icon={CheckCircle}
            iconColor="text-purple-600 bg-purple-100"
          />
        </div>
      ) : null}

      {/* Chart + Top Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {trends && trends.length > 0 ? (
            <SentimentChart data={trends} />
          ) : (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Динамика отзывов
              </h2>
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                Нет данных за выбранный период
              </div>
            </div>
          )}
        </div>
        <div>
          <TopProblems problems={problems || []} limit={5} />
        </div>
      </div>

      {/* Recent Critical Reviews */}
      {recentReviews?.items && (
        <RecentCritical reviews={recentReviews.items} />
      )}
    </div>
  );
}
