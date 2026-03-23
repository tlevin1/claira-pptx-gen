import { Section, SlideKind } from "../api/types";

export function classifySection(section: Section): SlideKind | "transaction_overview" | "financials" {
  const title = (section.title || "").toLowerCase();
  const type = (section.type || "").toLowerCase();

  if (title.includes("company overview")) return "company_overview";
  if (title.includes("risk") || title.includes("watchpoint")) return "credit_risks";

  if (
    title.includes("transaction") ||
    title.includes("deal overview") ||
    title.includes("capital structure") ||
    title.includes("use of proceeds")
  ) {
    return "transaction_overview";
  }

  if (
    title.includes("financial") ||
    title.includes("comps") ||
    title.includes("performance") ||
    type === "metrics"
  ) {
    return "financials";
  }

  if (type.includes("rich_text") || type.includes("rich text")) {
    return "generic_narrative";
  }

  return "unsupported";
}