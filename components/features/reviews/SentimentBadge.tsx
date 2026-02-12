"use client";

import { getSentimentColor, getSentimentLabel } from "@/lib/utils";
import type { Sentiment } from "@/types";

interface SentimentBadgeProps {
  sentiment: Sentiment | null;
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getSentimentColor(sentiment)}`}
    >
      {getSentimentLabel(sentiment)}
    </span>
  );
}
