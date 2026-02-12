"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { SentimentBadge } from "@/components/features/reviews/SentimentBadge";
import { PriorityBadge } from "@/components/features/reviews/PriorityBadge";
import type { ReviewListItem } from "@/types";

interface RecentCriticalProps {
  reviews: ReviewListItem[];
}

export function RecentCritical({ reviews }: RecentCriticalProps) {
  const critical = reviews.filter(
    (r) => r.sentiment === "negative" || r.priority === "critical" || r.priority === "high"
  );

  if (critical.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Критические отзывы
        </h2>
        <p className="text-sm text-muted-foreground text-center py-4">
          Критических отзывов нет
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        Критические отзывы
      </h2>
      <div className="space-y-3">
        {critical.slice(0, 5).map((review) => (
          <Link
            key={review.id}
            href={`/dashboard/reviews/${review.id}` as any}
            className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
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
                {truncateText(review.summary, 100)}
              </p>
            )}
            <div className="flex gap-1.5">
              <SentimentBadge sentiment={review.sentiment} />
              <PriorityBadge priority={review.priority} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
