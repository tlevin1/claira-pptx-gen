import { Section } from "../api/types";
import { parseHtmlContent } from "./htmlToText";

export interface TransactionOverviewSlideData {
  slideType: "transaction_overview";
  title: string;
  summaryBullets: string[];
  transactionDetails: Array<{ label: string; value: string }>;
}

function splitKeyValue(line: string): { label: string; value: string } | null {
  const colonMatch = line.match(/^([^:]{2,}):\s*(.+)$/);
  if (colonMatch) {
    return {
      label: colonMatch[1].trim(),
      value: colonMatch[2].trim(),
    };
  }

  return null;
}

function dedupe(items: string[]): string[] {
  return [...new Set(items.map((x) => x.trim()).filter(Boolean))];
}

export function extractTransactionOverview(
  section: Section
): TransactionOverviewSlideData {
  const html = section.value?.text || "";
  const parsed = parseHtmlContent(html);

  const allLines = dedupe(
    parsed.headings.flatMap((h) => [...h.paragraphs, ...h.bullets])
  );

  const transactionDetails: Array<{ label: string; value: string }> = [];
  const summaryBullets: string[] = [];

  for (const line of allLines) {
    const kv = splitKeyValue(line);
    if (kv && kv.label.length < 40 && kv.value.length < 160) {
      transactionDetails.push(kv);
    } else {
      summaryBullets.push(line);
    }
  }

  return {
    slideType: "transaction_overview",
    title: section.title || "Transaction Overview",
    summaryBullets: summaryBullets.slice(0, 6),
    transactionDetails: transactionDetails.slice(0, 8),
  };
}