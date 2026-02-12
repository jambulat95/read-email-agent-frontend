"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSubscription() {
  return useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: () => api.billing.getSubscription(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["billing", "invoices"],
    queryFn: () => api.billing.getInvoices(),
  });
}

export function useUsage() {
  return useQuery({
    queryKey: ["billing", "usage"],
    queryFn: () => api.billing.getUsage(),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ plan, billingPeriod }: { plan: string; billingPeriod?: string }) =>
      api.billing.createCheckout(plan, billingPeriod),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function usePortalUrl() {
  return useMutation({
    mutationFn: () => api.billing.getPortalUrl(),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.billing.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}
