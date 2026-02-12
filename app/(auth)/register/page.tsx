"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Check } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import type { UserPlan } from "@/types";

const plans: { id: UserPlan; name: string; price: string; desc: string }[] = [
  { id: "free", name: "Free", price: "$0/мес", desc: "50 отзывов" },
  { id: "starter", name: "Starter", price: "$29/мес", desc: "500 отзывов" },
  { id: "pro", name: "Pro", price: "$99/мес", desc: "2000 отзывов" },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$499/мес",
    desc: "Безлимит",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>("free");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Необходимо принять условия использования");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ email, password, name });
      router.push("/setup");
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-xl shadow-sm border border-border p-8">
        <div className="flex items-center justify-center mb-8">
          <Mail className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold">ReviewAI</span>
        </div>

        <h1 className="text-2xl font-semibold text-center text-foreground mb-2">
          Создать аккаунт
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Зарегистрируйтесь для начала работы
        </p>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Иван Иванов"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Минимум 8 символов"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Plan selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Тарифный план
            </label>
            <div className="grid grid-cols-2 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-3 rounded-lg border text-left text-sm transition-colors ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                  )}
                  <p className="font-medium text-foreground">{plan.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {plan.price} &middot; {plan.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm text-muted-foreground"
            >
              Я согласен с{" "}
              <Link href="#" className="text-primary hover:text-primary/80">
                условиями использования
              </Link>{" "}
              и{" "}
              <Link href="#" className="text-primary hover:text-primary/80">
                политикой конфиденциальности
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-input rounded-lg hover:bg-muted transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            Зарегистрироваться через Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
