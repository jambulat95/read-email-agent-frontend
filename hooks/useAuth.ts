"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useAuth({ requireAuth = true } = {}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  return { user, isLoading, isAuthenticated };
}
