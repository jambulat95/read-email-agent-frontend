"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-9 w-9 bg-muted rounded-lg" />
      </div>
      <div className="h-8 bg-muted rounded w-16 mt-2" />
      <div className="h-3 bg-muted rounded w-20 mt-2" />
    </div>
  );
}
