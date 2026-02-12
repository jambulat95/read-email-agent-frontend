"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Building2, Bell, Check, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToneType } from "@/types";

const STEPS = [
  { id: 1, title: "Подключите Gmail", icon: Mail },
  { id: 2, title: "О компании", icon: Building2 },
  { id: 3, title: "Уведомления", icon: Bell },
];

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gmailConnected, setGmailConnected] = useState(false);

  // Step 2: Company
  const [companyName, setCompanyName] = useState("");
  const [responseTone, setResponseTone] = useState<ToneType>("professional");
  const [savingCompany, setSavingCompany] = useState(false);

  // Step 3: Notifications
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if user already has email accounts
        const data = await api.emailAccounts.list();
        if (data.accounts && data.accounts.length > 0) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // No accounts - continue with setup
      }

      // Handle OAuth return
      const stepParam = searchParams.get("step");
      const gmailParam = searchParams.get("gmail");

      if (stepParam) {
        setCurrentStep(Number(stepParam));
      }
      if (gmailParam === "connected") {
        setGmailConnected(true);
      }

      setLoading(false);
    };

    init();
  }, [router, searchParams]);

  const handleConnectGmail = async () => {
    try {
      const data = await api.emailAccounts.connectUrl("setup");
      window.location.href = data.authorization_url;
    } catch (err: any) {
      console.error("Failed to get connect URL:", err);
    }
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    try {
      await api.settings.updateCompany({
        company_name: companyName || null,
        response_tone: responseTone,
      });
    } catch {
      // Ignore errors on setup, user can configure later
    } finally {
      setSavingCompany(false);
      setCurrentStep(3);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await api.settings.updateNotifications({
        email_enabled: emailEnabled,
        telegram_enabled: telegramEnabled,
      });
    } catch {
      // Ignore errors on setup
    } finally {
      setSavingNotifications(false);
      router.push("/dashboard");
    }
  };

  const handleSkip = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                step.id < currentStep
                  ? "bg-primary text-white"
                  : step.id === currentStep
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                step.id
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-1 ${
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Gmail */}
      {currentStep === 1 && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle>Подключите Gmail</CardTitle>
            <CardDescription>
              Подключите рабочий Gmail для автоматического анализа отзывов из входящих писем
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gmailConnected ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Check className="h-5 w-5" />
                <span className="font-medium">Gmail успешно подключён!</span>
              </div>
            ) : (
              <Button
                onClick={handleConnectGmail}
                className="w-full"
                size="lg"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Подключить Gmail
              </Button>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={handleSkip}>
                Пропустить
              </Button>
              {gmailConnected && (
                <Button onClick={() => setCurrentStep(2)}>
                  Далее
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Company */}
      {currentStep === 2 && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle>О компании</CardTitle>
            <CardDescription>
              Укажите информацию о компании для более точных ответов на отзывы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Название компании</Label>
              <Input
                id="company-name"
                placeholder="Например, ООО «Ромашка»"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="response-tone">Тон ответов</Label>
              <Select
                value={responseTone}
                onValueChange={(value) => setResponseTone(value as ToneType)}
              >
                <SelectTrigger id="response-tone">
                  <SelectValue placeholder="Выберите тон" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Формальный</SelectItem>
                  <SelectItem value="friendly">Дружелюбный</SelectItem>
                  <SelectItem value="professional">Профессиональный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={handleSkip}>
                Пропустить
              </Button>
              <Button onClick={handleSaveCompany} disabled={savingCompany}>
                {savingCompany ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Далее
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Notifications */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bell className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
              Настройте уведомления, чтобы не пропустить важные отзывы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Email-уведомления</p>
                <p className="text-xs text-muted-foreground">
                  Получать уведомления на почту
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailEnabled}
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  emailEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    emailEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Telegram</p>
                <p className="text-xs text-muted-foreground">
                  Получать уведомления в Telegram
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={telegramEnabled}
                onClick={() => setTelegramEnabled(!telegramEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  telegramEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    telegramEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={handleSkip}>
                Пропустить
              </Button>
              <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
                {savingNotifications ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Завершить
                <Check className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
