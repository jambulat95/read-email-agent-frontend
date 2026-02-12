"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAnalyticsSummary(period?: string) {
  return useQuery({
    queryKey: ["analytics", "summary", period],
    queryFn: () => api.analytics.summary(period),
  });
}

export function useAnalyticsTrends(period?: string) {
  return useQuery({
    queryKey: ["analytics", "trends", period],
    queryFn: () => api.analytics.trends(period),
  });
}

export function useAnalyticsProblems(period?: string) {
  return useQuery({
    queryKey: ["analytics", "problems", period],
    queryFn: () => api.analytics.problems(period),
  });
}
