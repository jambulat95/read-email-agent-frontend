import type {
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
  Review,
  ReviewListItem,
  ReviewFilters,
  PaginatedResponse,
  DraftResponse,
  AnalyticsSummary,
  TrendPoint,
  ProblemStat,
  NotificationSettings,
  CompanySettings,
  ProfileSettings,
  EmailAccount,
  ToneType,
  SubscriptionInfo,
  InvoiceItem,
  UsageInfo,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });
        if (!retryResponse.ok) {
          throw await this.createError(retryResponse);
        }
        return retryResponse.json();
      }
      this.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw await this.createError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async createError(response: Response): Promise<Error> {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (Array.isArray(data.detail)) {
        message = data.detail.map((e: any) => e.msg).join(", ");
      } else {
        message = data.detail || message;
      }
    } catch {
      // ignore
    }
    const error = new Error(message);
    (error as any).status = response.status;
    return error;
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return false;

      const tokens: AuthTokens = await response.json();
      this.saveTokens(tokens);
      return true;
    } catch {
      return false;
    }
  }

  saveTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
    }
  }

  clearTokens() {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  loadTokens() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token");
    }
  }

  // Auth
  auth = {
    login: (data: LoginCredentials) => {
      const formData = new URLSearchParams();
      formData.append("username", data.email);
      formData.append("password", data.password);
      return this.request<AuthTokens>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
    },

    register: (data: RegisterData) =>
      this.request<AuthTokens>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    me: () => this.request<User>("/api/auth/me"),

    refresh: (refreshToken: string) =>
      this.request<AuthTokens>("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }),
  };

  // Reviews
  reviews = {
    list: (filters?: ReviewFilters & { page?: number; page_size?: number }) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
      }
      const query = params.toString();
      return this.request<PaginatedResponse<ReviewListItem>>(
        `/api/reviews${query ? `?${query}` : ""}`
      );
    },

    get: (id: string) => this.request<Review>(`/api/reviews/${id}`),

    update: (id: string, data: { is_processed?: boolean; notes?: string }) =>
      this.request<Review>(`/api/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    getDrafts: (reviewId: string) =>
      this.request<DraftResponse[]>(`/api/reviews/${reviewId}/drafts`),

    regenerateDrafts: (reviewId: string, tone?: ToneType) =>
      this.request<DraftResponse[]>(
        `/api/reviews/${reviewId}/drafts/regenerate`,
        {
          method: "POST",
          body: JSON.stringify(tone ? { tone } : {}),
        }
      ),

    selectDraft: (reviewId: string, draftId: string) =>
      this.request<DraftResponse>(
        `/api/reviews/${reviewId}/drafts/${draftId}`,
        { method: "PATCH", body: JSON.stringify({ is_selected: true }) }
      ),
  };

  // Analytics
  analytics = {
    summary: (period?: string) => {
      const query = period ? `?period=${period}` : "";
      return this.request<AnalyticsSummary>(`/api/analytics/summary${query}`);
    },

    trends: (period?: string) => {
      const query = period ? `?period=${period}` : "";
      return this.request<TrendPoint[]>(`/api/analytics/trends${query}`);
    },

    problems: (period?: string) => {
      const query = period ? `?period=${period}` : "";
      return this.request<ProblemStat[]>(`/api/analytics/problems${query}`);
    },
  };

  // Settings
  settings = {
    getNotifications: () =>
      this.request<NotificationSettings>("/api/settings/notifications"),

    updateNotifications: (data: Partial<NotificationSettings>) =>
      this.request<NotificationSettings>("/api/settings/notifications", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    getCompany: () => this.request<CompanySettings>("/api/settings/company"),

    updateCompany: (data: Partial<CompanySettings>) =>
      this.request<CompanySettings>("/api/settings/company", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    getProfile: () => this.request<ProfileSettings>("/api/settings/profile"),

    updateProfile: (data: Partial<ProfileSettings>) =>
      this.request<ProfileSettings>("/api/settings/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };

  // Billing
  billing = {
    getSubscription: () =>
      this.request<SubscriptionInfo>("/api/billing/subscription"),

    getInvoices: () =>
      this.request<{ items: InvoiceItem[] }>("/api/billing/invoices"),

    getUsage: () => this.request<UsageInfo>("/api/billing/usage"),

    createCheckout: (plan: string, billingPeriod: string = "monthly") =>
      this.request<{ url: string }>("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan, billing_period: billingPeriod }),
      }),

    getPortalUrl: () =>
      this.request<{ url: string }>("/api/billing/portal"),

    cancelSubscription: () =>
      this.request<{ message: string }>("/api/billing/cancel", {
        method: "POST",
      }),
  };

  // Email Accounts
  emailAccounts = {
    list: () =>
      this.request<{ accounts: EmailAccount[]; total: number }>("/api/gmail/accounts"),

    connectUrl: (redirectTo?: string) => {
      const query = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
      return this.request<{ authorization_url: string }>(`/api/gmail/connect${query}`);
    },

    disconnect: (id: string) =>
      this.request<void>(`/api/gmail/accounts/${id}`, {
        method: "DELETE",
      }),
  };
}

export const api = new ApiClient();
