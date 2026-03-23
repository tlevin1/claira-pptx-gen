import { Section } from "../api/types";
import { parseHtmlContent } from "./htmlToText";

export interface FinancialsSlideData {
  slideType: "financials";
  title: string;
  columns: string[];
  rows: string[][];
  summaryBullets: string[];
}

function looksNumeric(value: string): boolean {
  return /[%$(),0-9]/.test(value);
}

function tryParseMetricLine(line: string): [string, string] | null {
  const colonMatch = line.match(/^([^:]{2,}):\s*(.+)$/);
  if (colonMatch && looksNumeric(colonMatch[2])) {
    return [colonMatch[1].trim(), colonMatch[2].trim()];
  }

  const dashMatch = line.match(/^(.+?)\s+[–-]\s+(.+)$/);
  if (dashMatch && looksNumeric(dashMatch[2])) {
    return [dashMatch[1].trim(), dashMatch[2].trim()];
  }

  return null;
}

export function extractFinancials(section: Section): FinancialsSlideData {
  const title = section.title || "Financials";

  if (
    section.type?.toLowerCase() === "metrics" &&
    Array.isArray(section.value?.metrics)
  ) {
    const rows = section.value.metrics
      .map((m: any) => [
        String(m.label ?? m.name ?? "Metric"),
        String(m.value ?? m.display_value ?? ""),
      ])
      .slice(0, 12);

    return {
      slideType: "financials",
      title,
      columns: ["Metric", "Value"],
      rows,
      summaryBullets: [],
    };
  }

  const html = section.value?.text || "";
  const parsed = parseHtmlContent(html);

  const allLines = parsed.headings.flatMap((h) => [...h.paragraphs, ...h.bullets]);

  const tableRows: string[][] = [];
  const summaryBullets: string[] = [];

  for (const line of allLines) {
    const metric = tryParseMetricLine(line);
    if (metric) {
      tableRows.push(metric);
    } else {
      summaryBullets.push(line);
    }
  }

  return {
    slideType: "financials",
    title,
    columns: ["Metric", "Value"],
    rows: tableRows.slice(0, 12),
    summaryBullets: summaryBullets.slice(0, 4),
  };
}