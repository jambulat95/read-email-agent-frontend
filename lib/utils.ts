import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return formatDate(date);
}

export function getSentimentColor(sentiment: string | null): string {
  switch (sentiment) {
    case "positive":
      return "text-green-600 bg-green-100";
    case "negative":
      return "text-red-600 bg-red-100";
    case "neutral":
      return "text-gray-600 bg-gray-100";
    case "mixed":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-gray-400 bg-gray-50";
  }
}

export function getSentimentLabel(sentiment: string | null): string {
  switch (sentiment) {
    case "positive":
      return "Позитивный";
    case "negative":
      return "Негативный";
    case "neutral":
      return "Нейтральный";
    case "mixed":
      return "Смешанный";
    default:
      return "Не определён";
  }
}

export function getPriorityColor(priority: string | null): string {
  switch (priority) {
    case "critical":
      return "text-red-700 bg-red-200";
    case "high":
      return "text-orange-600 bg-orange-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "low":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-400 bg-gray-50";
  }
}

export function getPriorityLabel(priority: string | null): string {
  switch (priority) {
    case "critical":
      return "Критический";
    case "high":
      return "Высокий";
    case "medium":
      return "Средний";
    case "low":
      return "Низкий";
    default:
      return "Не определён";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
