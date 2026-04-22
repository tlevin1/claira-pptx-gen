import { Section } from "../api/types";
import { parseHtmlContent } from "./htmlToText";

export interface FinancialsSlideData {
  slideType: "financials";
  title: string;
  columns: string[];
  rows: string[][];
  summaryBullets: string[];
}

function stripCitations(text: string): string {
  return text.replace(/\s*\[\d+\]/g, "").trim();
}

function looksNumeric(value: string): boolean {
  return /[%$(),0-9]/.test(value);
}

function tryParseMetricLine(line: string): [string, string] | null {
  const colonMatch = line.match(/^([^:]{2,}):\s*(.+)$/);
  if (colonMatch) {
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

  const ANALYST_HEADINGS = ["preliminary financial risks", "analyst notes", "risks"];
  const isAnalystSection = (h: string) =>
    ANALYST_HEADINGS.some((k) => h.toLowerCase().includes(k));

  const tableRows: string[][] = [];
  const summaryBullets: string[] = [];

  for (const heading of parsed.headings) {
    const lines = [...heading.paragraphs, ...heading.bullets].map(stripCitations);

    if (isAnalystSection(heading.heading)) {
      summaryBullets.push(...lines.filter((l) => !l.endsWith(":")));
    } else {
      for (const line of lines) {
        const metric = tryParseMetricLine(line);
        if (metric) {
          tableRows.push(metric);
        }
      }
    }
  }

  return {
    slideType: "financials",
    title,
    columns: ["Metric", "Value"],
    rows: tableRows.slice(0, 12),
    summaryBullets: summaryBullets.slice(0, 5),
  };
}