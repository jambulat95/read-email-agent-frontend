import {
  cn,
  formatDate,
  getSentimentColor,
  getSentimentLabel,
  getPriorityColor,
  getPriorityLabel,
  truncateText,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicts with tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("getSentimentColor", () => {
  it("returns green for positive", () => {
    expect(getSentimentColor("positive")).toContain("green");
  });

  it("returns red for negative", () => {
    expect(getSentimentColor("negative")).toContain("red");
  });

  it("returns gray for neutral", () => {
    expect(getSentimentColor("neutral")).toContain("gray");
  });

  it("returns default for null", () => {
    expect(getSentimentColor(null)).toContain("gray");
  });
});

describe("getSentimentLabel", () => {
  it("returns Russian labels", () => {
    expect(getSentimentLabel("positive")).toBe("Позитивный");
    expect(getSentimentLabel("negative")).toBe("Негативный");
    expect(getSentimentLabel("neutral")).toBe("Нейтральный");
  });

  it("returns default for null", () => {
    expect(getSentimentLabel(null)).toBe("Не определён");
  });
});

describe("getPriorityColor", () => {
  it("returns red for critical", () => {
    expect(getPriorityColor("critical")).toContain("red");
  });

  it("returns default for null", () => {
    expect(getPriorityColor(null)).toContain("gray");
  });
});

describe("getPriorityLabel", () => {
  it("returns Russian labels", () => {
    expect(getPriorityLabel("critical")).toBe("Критический");
    expect(getPriorityLabel("high")).toBe("Высокий");
  });

  it("returns default for null", () => {
    expect(getPriorityLabel(null)).toBe("Не определён");
  });
});

describe("truncateText", () => {
  it("returns full text if short enough", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("truncates long text with ellipsis", () => {
    const result = truncateText("This is a very long text that needs truncation", 20);
    expect(result.length).toBeLessThanOrEqual(23); // 20 + "..."
    expect(result).toContain("...");
  });
});

describe("formatDate", () => {
  it("formats date in Russian locale", () => {
    const result = formatDate("2024-01-15T12:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
