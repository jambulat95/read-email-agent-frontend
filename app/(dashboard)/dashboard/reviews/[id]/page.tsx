"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useReview,
  useUpdateReview,
  useReviewDrafts,
  useRegenerateDrafts,
} from "@/hooks/useReviews";
import { formatDateTime } from "@/lib/utils";
import { SentimentBadge } from "@/components/features/reviews/SentimentBadge";
import { PriorityBadge } from "@/components/features/reviews/PriorityBadge";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  RefreshCw,
  Brain,
  Lightbulb,
  AlertCircle,
  Mail,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: review, isLoading, isError } = useReview(id);
  const { data: drafts, isLoading: draftsLoading } = useReviewDrafts(id);
  const updateMutation = useUpdateReview();
  const regenerateMutation = useRegenerateDrafts();
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (review?.notes) {
      setNotes(review.notes);
    }
  }, [review?.notes]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-32 animate-pulse" />
        <div className="bg-white rounded-xl border border-border p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4 mb-3" />
          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-6 bg-muted rounded w-16" />
          </div>
          <div className="h-32 bg-muted rounded" />
        </div>
        <div className="bg-white rounded-xl border border-border p-6 animate-pulse">
          <div className="h-5 bg-muted rounded w-24 mb-4" />
          <div className="h-4 bg-muted rounded w-full mb-2" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Отзыв не найден</p>
        <button
          onClick={() => router.push("/dashboard/reviews")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  const handleMarkProcessed = () => {
    updateMutation.mutate({
      id,
      data: { is_processed: !review.is_processed },
    });
  };

  const handleSaveNotes = () => {
    updateMutation.mutate({ id, data: { notes } });
  };

  const handleCopyDraft = async (content: string, draftId: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(draftId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerateDrafts = () => {
    regenerateMutation.mutate({ reviewId: id });
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к отзывам
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Header */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-foreground">
                  {review.subject}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  От: {review.sender_name || review.sender_email} &middot;{" "}
                  {formatDateTime(review.received_at)}
                </p>
              </div>
              <button
                onClick={handleMarkProcessed}
                disabled={updateMutation.isPending}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg flex-shrink-0 transition-colors disabled:opacity-50 ${
                  review.is_processed
                    ? "text-green-700 bg-green-100 hover:bg-green-200"
                    : "text-white bg-primary hover:bg-primary/90"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {review.is_processed ? "Обработано" : "Отметить обработанным"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <SentimentBadge sentiment={review.sentiment} />
              <PriorityBadge priority={review.priority} />
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${review.is_processed ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"}`}
              >
                {review.is_processed ? "Обработан" : "Новый"}
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {review.body}
            </div>
          </div>

          {/* AI Analysis */}
          {review.summary && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Анализ
              </h2>

              <div className="mb-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {review.summary}
                </p>
              </div>

              {review.problems && review.problems.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Выявленные проблемы
                  </h3>
                  <ul className="space-y-1.5 ml-6">
                    {review.problems.map((problem, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground list-disc"
                      >
                        {problem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.suggestions && review.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Рекомендации
                  </h3>
                  <ul className="space-y-1.5 ml-6">
                    {review.suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground list-disc"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Draft Responses */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Варианты ответа
              </h2>
              <button
                onClick={handleRegenerateDrafts}
                disabled={regenerateMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${regenerateMutation.isPending ? "animate-spin" : ""}`}
                />
                Перегенерировать
              </button>
            </div>

            {draftsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-24 mb-3" />
                    <div className="h-3 bg-muted rounded w-full mb-2" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : drafts && drafts.length > 0 ? (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      draft.is_selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {draft.tone === "formal"
                          ? "Формальный"
                          : draft.tone === "friendly"
                            ? "Дружелюбный"
                            : "Профессиональный"}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyDraft(draft.content, draft.id)
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        {copied === draft.id ? "Скопировано!" : "Копировать"}
                      </button>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {draft.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Черновики ответов ещё не сгенерированы
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Информация
            </h2>
            <dl className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Отправитель</dt>
                  <dd className="text-sm text-foreground mt-0.5 break-all">
                    {review.sender_email}
                  </dd>
                </div>
              </div>
              {review.customer_name && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Имя клиента
                    </dt>
                    <dd className="text-sm text-foreground mt-0.5">
                      {review.customer_name}
                    </dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Получено</dt>
                  <dd className="text-sm text-foreground mt-0.5">
                    {formatDateTime(review.received_at)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Требует ответа
                  </dt>
                  <dd className="text-sm text-foreground mt-0.5">
                    {review.requires_response ? "Да" : "Нет"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Заметки
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Добавить заметку..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSaveNotes}
              disabled={updateMutation.isPending}
              className="mt-2 w-full py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
