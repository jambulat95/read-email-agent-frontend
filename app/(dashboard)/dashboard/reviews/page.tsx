"use client";

import { useState } from "react";
import Link from "next/link";
import { useReviews } from "@/hooks/useReviews";
import {
  formatRelativeTime,
  truncateText,
} from "@/lib/utils";
import { SentimentBadge } from "@/components/features/reviews/SentimentBadge";
import { PriorityBadge } from "@/components/features/reviews/PriorityBadge";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import type { Sentiment, Priority } from "@/types";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [isProcessed, setIsProcessed] = useState<string>("");

  const { data, isLoading, isError } = useReviews({
    page,
    page_size: 20,
    search: search || undefined,
    sentiment: sentiment || undefined,
    priority: priority || undefined,
    is_processed:
      isProcessed === "" ? undefined : isProcessed === "true",
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Отзывы</h1>
        <p className="text-muted-foreground mt-1">
          Все входящие отзывы клиентов
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по теме или отправителю..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={sentiment}
            onChange={(e) => {
              setSentiment(e.target.value as Sentiment | "");
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Все тональности</option>
            <option value="positive">Позитивный</option>
            <option value="negative">Негативный</option>
            <option value="neutral">Нейтральный</option>
            <option value="mixed">Смешанный</option>
          </select>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as Priority | "");
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Все приоритеты</option>
            <option value="critical">Критический</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
          <select
            value={isProcessed}
            onChange={(e) => {
              setIsProcessed(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Все статусы</option>
            <option value="true">Обработан</option>
            <option value="false">Не обработан</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
          <p className="text-sm text-red-600">
            Не удалось загрузить данные. Попробуйте обновить страницу.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Отзыв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Тональность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading &&
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!isLoading && data?.items?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Нет отзывов за выбранный период
                    </p>
                  </td>
                </tr>
              )}
              {data?.items?.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/reviews/${review.id}` as any}
                      className="block"
                    >
                      <p className="text-sm font-medium text-foreground truncate max-w-xs">
                        {review.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.sender_name || review.sender_email}
                      </p>
                      {review.summary && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {truncateText(review.summary, 80)}
                        </p>
                      )}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <SentimentBadge sentiment={review.sentiment} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={review.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${review.is_processed ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"}`}
                    >
                      {review.is_processed ? "Обработан" : "Новый"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(review.received_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {isLoading &&
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          {!isLoading && data?.items?.length === 0 && (
            <div className="p-8 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Нет отзывов за выбранный период
              </p>
            </div>
          )}
          {data?.items?.map((review) => (
            <Link
              key={review.id}
              href={`/dashboard/reviews/${review.id}` as any}
              className="block p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {review.subject}
                </p>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatRelativeTime(review.received_at)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {review.sender_name || review.sender_email}
              </p>
              {review.summary && (
                <p className="text-xs text-muted-foreground mb-2">
                  {truncateText(review.summary, 120)}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                <SentimentBadge sentiment={review.sentiment} />
                <PriorityBadge priority={review.priority} />
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${review.is_processed ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"}`}
                >
                  {review.is_processed ? "Обработан" : "Новый"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Показано {(page - 1) * 20 + 1}-
              {Math.min(page * 20, data.total)} из {data.total}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {page} / {data.total_pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.total_pages}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
