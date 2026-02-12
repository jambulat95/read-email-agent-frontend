import { api } from "./api";
import type { AuthTokens } from "@/types";

export function initializeAuth() {
  api.loadTokens();
}

export function handleLoginSuccess(tokens: AuthTokens) {
  api.saveTokens(tokens);
}

export function handleLogout() {
  api.clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}
