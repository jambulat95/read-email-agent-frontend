import { render, screen } from "@testing-library/react";
import { SentimentBadge } from "@/components/features/reviews/SentimentBadge";

describe("SentimentBadge", () => {
  it("renders positive sentiment", () => {
    render(<SentimentBadge sentiment="positive" />);
    expect(screen.getByText("Позитивный")).toBeInTheDocument();
  });

  it("renders negative sentiment", () => {
    render(<SentimentBadge sentiment="negative" />);
    expect(screen.getByText("Негативный")).toBeInTheDocument();
  });

  it("renders neutral sentiment", () => {
    render(<SentimentBadge sentiment="neutral" />);
    expect(screen.getByText("Нейтральный")).toBeInTheDocument();
  });

  it("renders null sentiment", () => {
    render(<SentimentBadge sentiment={null} />);
    expect(screen.getByText("Не определён")).toBeInTheDocument();
  });

  it("applies correct color classes for positive", () => {
    const { container } = render(<SentimentBadge sentiment="positive" />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("green");
  });

  it("applies correct color classes for negative", () => {
    const { container } = render(<SentimentBadge sentiment="negative" />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("red");
  });
});
