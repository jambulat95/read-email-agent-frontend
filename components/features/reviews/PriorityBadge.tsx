"use client";

import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import type { Priority } from "@/types";

interface PriorityBadgeProps {
  priority: Priority | null;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
}
