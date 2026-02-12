// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  plan: UserPlan;
  is_active: boolean;
  created_at: string;
}

export type UserPlan = "free" | "starter" | "pro" | "enterprise";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Review types
export type Sentiment = "positive" | "negative" | "neutral" | "mixed";
export type Priority = "critical" | "high" | "medium" | "low";

export interface Review {
  id: string;
  email_account_id: string;
  message_id: string;
  subject: string;
  sender_email: string;
  sender_name: string | null;
  body: string;
  received_at: string;
  sentiment: Sentiment | null;
  priority: Priority | null;
  summary: string | null;
  problems: string[] | null;
  suggestions: string[] | null;
  customer_name: string | null;
  requires_response: boolean;
  is_processed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewListItem {
  id: string;
  subject: string;
  sender_email: string;
  sender_name: string | null;
  received_at: string;
  sentiment: Sentiment | null;
  priority: Priority | null;
  summary: string | null;
  is_processed: boolean;
}

export interface ReviewFilters {
  sentiment?: Sentiment;
  priority?: Priority;
  is_processed?: boolean;
  email_account_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Draft Response types
export type ToneType = "formal" | "friendly" | "professional";

export interface DraftResponse {
  id: string;
  review_id: string;
  tone: ToneType;
  content: string;
  is_selected: boolean;
  created_at: string;
}

// Analytics types
export interface AnalyticsSummary {
  total_reviews: number;
  positive_reviews: number;
  negative_reviews: number;
  neutral_reviews: number;
  mixed_reviews: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  avg_response_time_hours: number | null;
  processed_count: number;
  unprocessed_count: number;
}

export interface TrendPoint {
  date: string;
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface ProblemStat {
  problem: string;
  count: number;
  percentage: number;
}

// Settings types
export interface NotificationSettings {
  email_enabled: boolean;
  email_address: string | null;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
  sms_enabled: boolean;
  phone_number: string | null;
  notify_on_negative: boolean;
  notify_on_critical: boolean;
  weekly_report: boolean;
}

export interface CompanySettings {
  company_name: string | null;
  industry: string | null;
  response_tone: ToneType;
  custom_instructions: string | null;
}

export interface ProfileSettings {
  name: string;
  email: string;
}

// Email Account types
export interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
}

// Billing types
export interface SubscriptionInfo {
  id?: string;
  plan: string;
  status: string;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  created_at?: string;
}

export interface InvoiceItem {
  id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface UsageInfo {
  emails_used: number;
  emails_limit: number;
  email_accounts_used: number;
  email_accounts_limit: number;
  period_start: string | null;
  period_end: string | null;
}

// API Error types
export interface ApiError {
  detail: string;
  status_code?: number;
}
