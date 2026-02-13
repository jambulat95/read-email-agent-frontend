import Link from "next/link";
import {
  Mail,
  BarChart3,
  Bell,
  MessageSquare,
  Shield,
  Zap,
  Star,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";

const stats = [
  { value: "2,500+", label: "Активных пользователей", icon: Users },
  { value: "150+", label: "Компаний", icon: Building2 },
  { value: "1.2M+", label: "Проанализированных отзывов", icon: TrendingUp },
  { value: "4.9/5", label: "Средняя оценка", icon: Star },
];

const companies = [
  "Ozon", "Wildberries", "Яндекс.Маркет", "СберМаркет", "Lamoda", "МВидео",
];

const features = [
  {
    icon: Mail,
    title: "Мониторинг email",
    description: "Автоматическое отслеживание входящих отзывов через Gmail",
  },
  {
    icon: BarChart3,
    title: "AI-анализ",
    description:
      "Определение тональности, приоритета и ключевых проблем с помощью AI",
  },
  {
    icon: Bell,
    title: "Уведомления",
    description: "Мгновенные оповещения через Email, Telegram и SMS",
  },
  {
    icon: MessageSquare,
    title: "Автоответы",
    description: "Генерация черновиков ответов на отзывы клиентов",
  },
  {
    icon: Shield,
    title: "Приоритизация",
    description: "Автоматическое определение критичных обращений",
  },
  {
    icon: Zap,
    title: "Аналитика",
    description: "Тренды, статистика и отчёты по отзывам",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "1 email аккаунт",
      "50 отзывов/мес",
      "Базовый анализ",
      "Email уведомления",
    ],
  },
  {
    name: "Starter",
    price: "$29",
    popular: true,
    features: [
      "3 email аккаунта",
      "500 отзывов/мес",
      "Полный AI анализ",
      "Email + Telegram",
      "1 вариант ответа",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    features: [
      "10 email аккаунтов",
      "2000 отзывов/мес",
      "Полный AI анализ",
      "Все каналы уведомлений",
      "3 варианта ответа",
      "API доступ",
    ],
  },
  {
    name: "Enterprise",
    price: "$499",
    features: [
      "Безлимитные аккаунты",
      "Безлимитные отзывы",
      "Приоритетная поддержка",
      "Выделенный менеджер",
      "SLA 99.9%",
    ],
  },
];

const testimonials = [
  {
    quote: "ReviewAI сократил время обработки отзывов на 80%. Теперь мы отвечаем клиентам в течение часа, а не дней.",
    author: "Алексей Петров",
    role: "Head of Support",
    company: "TechStore",
  },
  {
    quote: "Благодаря AI-анализу мы выявили системную проблему с доставкой, которую не замечали месяцами.",
    author: "Мария Козлова",
    role: "CEO",
    company: "FreshMarket",
  },
  {
    quote: "Автоматические ответы экономят нам 20+ часов в неделю. Качество при этом только выросло.",
    author: "Дмитрий Волков",
    role: "Customer Success Lead",
    company: "CloudServices",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">ReviewAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            AI-агент для анализа
            <br />
            <span className="text-primary">отзывов клиентов</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Автоматический мониторинг email, анализ тональности, приоритизация
            обращений и генерация ответов с помощью искусственного интеллекта.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Попробовать бесплатно
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 text-base font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10">
            Нам доверяют компании по всей России и СНГ
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Используют для работы с отзывами
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {companies.map((company) => (
              <span
                key={company}
                className="text-lg font-semibold text-muted-foreground/50"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Возможности платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Что говорят наши клиенты
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white p-6 rounded-xl border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Тарифы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white p-6 rounded-xl border flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-lg ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
                    Популярный
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/мес</span>
                </p>
                <ul className="mt-6 space-y-3 flex-grow">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start text-sm text-muted-foreground"
                    >
                      <svg
                        className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 block w-full text-center py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Готовы автоматизировать работу с отзывами?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Начните бесплатно и подключите свой первый email за 2 минуты.
            Без кредитной карты.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block px-8 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Начать бесплатно
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 ReviewAI. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
