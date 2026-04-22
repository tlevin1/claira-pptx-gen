import * as cheerio from "cheerio";

export interface ParsedHtmlContent {
  title?: string;
  headings: Array<{
    heading: string;
    paragraphs: string[];
    bullets: string[];
  }>;
  plainText: string;
}

export function parseHtmlContent(html: string): ParsedHtmlContent {
  const $ = cheerio.load(html);
  const headings: ParsedHtmlContent["headings"] = [];

  let current: ParsedHtmlContent["headings"][number] | null = null;

  $("body")
    .children()
    .each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      const text = $(el).text().replace(/\s+/g, " ").trim();

      if (!text) return;

      if (tag === "h1") {
        return;
      }

      if (tag === "h2" || tag === "h3" || tag === "h4") {
        current = {
          heading: text,
          paragraphs: [],
          bullets: [],
        };
        headings.push(current);
        return;
      }

      if (tag === "p") {
        if (!current) {
          current = { heading: "Summary", paragraphs: [], bullets: [] };
          headings.push(current);
        }
        current.paragraphs.push(text);
        return;
      }

      if (tag === "ul" || tag === "ol") {
        if (!current) {
          current = { heading: "Summary", paragraphs: [], bullets: [] };
          headings.push(current);
        }

        $(el)
          .find("li")
          .each((__, li) => {
            const liText = $(li).text().replace(/\s+/g, " ").trim();
            if (liText) current!.bullets.push(liText);
          });
      }
    });

  const plainText = $.text().replace(/\s+/g, " ").trim();
  const title = $("h1").first().text().replace(/\s+/g, " ").trim() || undefined;

  return {
    title,
    headings,
    plainText,
  };
}