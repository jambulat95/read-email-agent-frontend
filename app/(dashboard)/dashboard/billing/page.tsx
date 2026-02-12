"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useSubscription,
  useInvoices,
  useUsage,
  useCreateCheckout,
  usePortalUrl,
  useCancelSubscription,
} from "@/hooks/useBilling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  starter: { monthly: 29, yearly: 290 },
  professional: { monthly: 79, yearly: 790 },
  enterprise: { monthly: 499, yearly: 0 },
};

const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    "50 писем/месяц",
    "1 email аккаунт",
    "Email уведомления",
    "Базовый анализ",
  ],
  starter: [
    "500 писем/месяц",
    "1 email аккаунт",
    "Email + Telegram",
    "1 черновик ответа",
  ],
  professional: [
    "2 000 писем/месяц",
    "3 email аккаунта",
    "Все каналы уведомлений",
    "3 черновика ответов",
    "Еженедельные отчёты",
  ],
  enterprise: [
    "10 000 писем/месяц",
    "10 email аккаунтов",
    "Все каналы уведомлений",
    "3 черновика ответов",
    "Еженедельные отчёты",
    "API доступ",
  ],
};

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    active: { label: "Активна", className: "bg-green-100 text-green-800" },
    past_due: { label: "Просрочена", className: "bg-red-100 text-red-800" },
    canceled: { label: "Отменена", className: "bg-gray-100 text-gray-800" },
    trialing: { label: "Пробный период", className: "bg-blue-100 text-blue-800" },
    incomplete: { label: "Не завершена", className: "bg-yellow-100 text-yellow-800" },
    none: { label: "Бесплатный", className: "bg-gray-100 text-gray-600" },
  };
  const v = variants[status] || variants.none;
  return <Badge className={v.className}>{v.label}</Badge>;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function BillingPage() {
  const { user } = useAuth({ requireAuth: true });
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: invoicesData, isLoading: invLoading } = useInvoices();
  const { data: usage, isLoading: usageLoading } = useUsage();

  const checkout = useCreateCheckout();
  const portal = usePortalUrl();
  const cancelSub = useCancelSubscription();

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Подписка оформлена!", description: "Спасибо за покупку." });
    }
    if (searchParams.get("canceled") === "true") {
      toast({ title: "Оплата отменена", description: "Вы можете попробовать снова." });
    }
  }, [searchParams, toast]);

  const currentPlan = user?.plan || "free";
  const invoices = invoicesData?.items || [];

  const usagePercent = usage
    ? Math.min(100, Math.round((usage.emails_used / usage.emails_limit) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Биллинг</h1>
        <p className="text-muted-foreground">
          Управление подпиской и платежами
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Текущий план
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {PLAN_LABELS[currentPlan] || currentPlan}
                </span>
                <StatusBadge status={subscription?.status || "none"} />
                {subscription?.cancel_at_period_end && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Отмена в конце периода
                  </Badge>
                )}
              </div>

              {subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Следующее списание: {formatDate(subscription.current_period_end)}
                </p>
              )}

              <div className="flex gap-3">
                {currentPlan !== "free" && (
                  <Button
                    variant="outline"
                    onClick={() => portal.mutate()}
                    disabled={portal.isPending}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Управлять подпиской
                  </Button>
                )}
                {currentPlan === "free" && (
                  <Button
                    onClick={() =>
                      checkout.mutate({ plan: "starter" })
                    }
                    disabled={checkout.isPending}
                  >
                    Перейти на Starter
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Использование</CardTitle>
        </CardHeader>
        <CardContent>
          {usageLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : usage ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Обработано писем</span>
                  <span className="font-medium">
                    {usage.emails_used} / {usage.emails_limit}
                  </span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent >= 90
                        ? "bg-red-500"
                        : usagePercent >= 70
                        ? "bg-yellow-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Email аккаунты</span>
                <span className="font-medium">
                  {usage.email_accounts_used} / {usage.email_accounts_limit}
                </span>
              </div>

              {usage.period_start && usage.period_end && (
                <p className="text-xs text-muted-foreground">
                  Период: {formatDate(usage.period_start)} — {formatDate(usage.period_end)}
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Тарифные планы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["free", "starter", "professional", "enterprise"] as const).map(
              (plan) => {
                const isCurrent = currentPlan === plan;
                const price = PLAN_PRICES[plan];
                return (
                  <div
                    key={plan}
                    className={`rounded-lg border p-4 ${
                      isCurrent ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <h3 className="font-semibold text-lg">
                      {PLAN_LABELS[plan]}
                    </h3>
                    <p className="text-2xl font-bold mt-1">
                      {price ? `$${price.monthly}` : "$0"}
                      <span className="text-sm font-normal text-muted-foreground">
                        /мес
                      </span>
                    </p>
                    <Separator className="my-3" />
                    <ul className="space-y-1.5 text-sm">
                      {PLAN_FEATURES[plan]?.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {isCurrent ? (
                        <Button variant="outline" className="w-full" disabled>
                          Текущий план
                        </Button>
                      ) : plan === "free" ? null : (
                        <Button
                          variant={plan === "professional" ? "default" : "outline"}
                          className="w-full"
                          onClick={() =>
                            checkout.mutate({ plan })
                          }
                          disabled={checkout.isPending}
                        >
                          {currentPlan === "free"
                            ? "Выбрать"
                            : "Сменить план"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            История платежей
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Нет платежей
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Квитанция</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {formatDate(invoice.paid_at || invoice.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {invoice.status === "paid" ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Оплачено
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {invoice.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          PDF
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
