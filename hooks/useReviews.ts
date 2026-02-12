"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReviewFilters } from "@/types";

export function useReviews(
  filters?: ReviewFilters & { page?: number; page_size?: number }
) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => api.reviews.list(filters),
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => api.reviews.get(id),
    enabled: !!id,
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { is_processed?: boolean; notes?: string };
    }) => api.reviews.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", id] });
    },
  });
}

export function useReviewDrafts(reviewId: string) {
  return useQuery({
    queryKey: ["drafts", reviewId],
    queryFn: () => api.reviews.getDrafts(reviewId),
    enabled: !!reviewId,
  });
}

export function useRegenerateDrafts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      tone,
    }: {
      reviewId: string;
      tone?: "formal" | "friendly" | "professional";
    }) => api.reviews.regenerateDrafts(reviewId, tone),
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ["drafts", reviewId] });
    },
  });
}
