import { Section } from "../api/types";
import { parseHtmlContent } from "./htmlToText";

export interface CompanyOverviewSlideData {
  slideType: "company_overview";
  title: string;
  companyName: string;
  businessDescription: string[];
  productsServices: string[];
  revenueSegmentation: Array<{ label: string; value: string }>;
  endMarkets: string[];
  keyCustomers: string[];
  watchpoints: string[];
}

function stripCitations(text: string): string {
  return text.replace(/\s*\[\d+\]/g, "").trim();
}

function bulletsFromHeading(
  headings: ReturnType<typeof parseHtmlContent>["headings"],
  headingName: string
): string[] {
  const match = headings.find(
    (h) => h.heading.toLowerCase() === headingName.toLowerCase()
  );
  if (!match) return [];

  return [...match.paragraphs, ...match.bullets]
    .filter(Boolean)
    .map(stripCitations);
}

function extractEndMarkets(
  headings: ReturnType<typeof parseHtmlContent>["headings"]
): string[] {
  const raw = bulletsFromHeading(headings, "End Markets");
  const markets: string[] = [];

  for (const line of raw) {
    if (line.includes(" - ")) {
      // "The company serves six end markets: - Airlines & Fleets - Business Aviation..."
      const parts = line.split(" - ").slice(1).map(s => s.trim()).filter(Boolean);
      markets.push(...parts);
    } else {
      markets.push(line);
    }
  }

  return markets;
}

function extractRevenueRows(lines: string[]): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];

  for (const line of lines) {
    const match = line.match(/^(.*?):\s*([0-9]+%[^[]*)/);
    if (match) {
      rows.push({
        label: match[1].trim(),
        value: match[2].trim().replace(/\.$/, ""),
      });
    }
  }

  return rows;
}

function takeFirstN(items: string[], n: number): string[] {
  return items.slice(0, n);
}

export function extractCompanyOverview(section: Section): CompanyOverviewSlideData {
  const html = section.value?.text || "";
  const parsed = parseHtmlContent(html);

  const businessDescription = takeFirstN(
    bulletsFromHeading(parsed.headings, "Business Description"),
    2
  );

  const productsServices = takeFirstN(
    bulletsFromHeading(parsed.headings, "Products/Services"),
    4
  );

  const revenueLines = bulletsFromHeading(parsed.headings, "Revenue Segmentation");
  const revenueSegmentation = extractRevenueRows(revenueLines).slice(0, 5);

  const endMarkets = takeFirstN(
    extractEndMarkets(parsed.headings),
    4
  );

  const keyCustomers = takeFirstN(
    [
      ...bulletsFromHeading(parsed.headings, "Key Customers"),
      ...bulletsFromHeading(parsed.headings, "Customer Concentration Risk"),
    ],
    4
  );

  const watchpoints = takeFirstN(
    bulletsFromHeading(parsed.headings, "Analyst Notes (Preliminary Risks / Watchpoints)"),
    4
  );

  return {
    slideType: "company_overview",
    title: section.title || "Company Overview",
    companyName: parsed.title || "Unknown Company",
    businessDescription,
    productsServices,
    revenueSegmentation,
    endMarkets,
    keyCustomers,
    watchpoints,
  };
}