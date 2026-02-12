"use client";

import { useAuth } from "@/hooks/useAuth";
import { Mail } from "lucide-react";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth({ requireAuth: true });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="animate-pulse text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4 py-8">
      <div className="flex items-center mb-8">
        <Mail className="h-8 w-8 text-primary" />
        <span className="ml-2 text-2xl font-bold">ReviewAI</span>
      </div>
      {children}
    </div>
  );
}
