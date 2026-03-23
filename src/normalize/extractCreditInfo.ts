import { Section } from "../api/types";
import { parseHtmlContent } from "./htmlToText";

export interface CreditRiskRow {
  risk: string;
  description: string;
  mitigant: string;
}

export interface CreditRisksSlideData {
  slideType: "credit_risks";
  title: string;
  rows: CreditRiskRow[];
}

export function extractCreditInfo(section: Section): CreditRisksSlideData {
  const html = section.value?.text || "";
  const parsed = parseHtmlContent(html);

  const rawBullets =
    parsed.headings.flatMap((h) => [...h.paragraphs, ...h.bullets]) || [];

  const bullets = rawBullets.filter(Boolean).slice(0, 4);

  const rows: CreditRiskRow[] = bullets.map((bullet, idx) => ({
    risk: `Risk ${idx + 1}`,
    description: bullet,
    mitigant: "Requires further diligence / mitigation assessment.",
  }));

  return {
    slideType: "credit_risks",
    title: section.title || "Credit Risks",
    rows,
  };
}