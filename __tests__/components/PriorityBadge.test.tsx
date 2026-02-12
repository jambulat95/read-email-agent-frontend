import { render, screen } from "@testing-library/react";
import { PriorityBadge } from "@/components/features/reviews/PriorityBadge";

describe("PriorityBadge", () => {
  it("renders critical priority", () => {
    render(<PriorityBadge priority="critical" />);
    expect(screen.getByText("Критический")).toBeInTheDocument();
  });

  it("renders high priority", () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText("Высокий")).toBeInTheDocument();
  });

  it("renders null priority", () => {
    render(<PriorityBadge priority={null} />);
    expect(screen.getByText("Не определён")).toBeInTheDocument();
  });

  it("applies correct color class for critical", () => {
    const { container } = render(<PriorityBadge priority="critical" />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("red");
  });
});
