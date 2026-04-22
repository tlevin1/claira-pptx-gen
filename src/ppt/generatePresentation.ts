import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";
import { Deal, Section } from "../api/types";
import { classifySection } from "../normalize/classifySection";
import { extractCreditInfo } from "../normalize/extractCreditInfo";
import { extractStructuredSlideData } from "../llm/extractStructuredSlideData";
import { extractFinancials } from "../normalize/extractFinancials";
import { renderCoverSlide } from "./renderers/renderCoverSlide";
import { renderCompanyOverviewSlide } from "./renderers/renderCompanyOverviewSlide";
import { renderCreditRisksSlide } from "./renderers/renderCreditRisksSlide";
import { renderCreditInfoSlide } from "./renderers/renderCreditInfoSlide";
import { renderTransactionOverviewSlide } from "./renderers/renderTransactionOverviewSlide";
import { renderFinancialsSlide } from "./renderers/renderFinancialsSlide";

export async function generatePresentation(
  deal: Deal,
  allSections: Section[],
  outputDir = "output"
): Promise<string> {
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Tehila Levin";
  pptx.company = "Claira Take Home";
  pptx.subject = deal.asset_name;
  pptx.title = `${deal.asset_name} Credit Presentation`;

  const SLIDE_ORDER = [
    "company_overview",
    "financials",
    "transaction_overview",
    "credit_info",
    "credit_risks",
  ];

  const classified = allSections.map((s) => ({ section: s, kind: classifySection(s) }));
  console.log("Sections:", classified.map((c) => `${c.kind}: "${c.section.title}"`));
  const sorted = SLIDE_ORDER.flatMap((kind) =>
    classified.filter((c) => c.kind === kind).map((c) => c.section)
  );

  renderCoverSlide(pptx, deal.asset_name);

  for (const section of sorted) {
    const kind = classifySection(section);

    if (kind === "company_overview") {
      const data = await extractStructuredSlideData({
        sectionTitle: section.title ?? "",
        sectionType: kind,
        rawHtml: section.value?.text ?? "",
        targetSchema: "company_overview",
      });
      renderCompanyOverviewSlide(pptx, { slideType: "company_overview", title: section.title ?? "Company Overview", ...data });
    } else if (kind === "financials") {
      renderFinancialsSlide(pptx, extractFinancials(section));
    } else if (kind === "transaction_overview") {
      const data = await extractStructuredSlideData({
        sectionTitle: section.title ?? "",
        sectionType: kind,
        rawHtml: section.value?.text ?? "",
        targetSchema: "transaction_overview",
      });
      renderTransactionOverviewSlide(pptx, { slideType: "transaction_overview", title: section.title ?? "Transaction Overview", ...data });
    } else if (kind === "credit_info") {
      renderCreditInfoSlide(pptx, extractCreditInfo(section));
    } else if (kind === "credit_risks") {
      const data = await extractStructuredSlideData({
        sectionTitle: section.title ?? "",
        sectionType: kind,
        rawHtml: section.value?.text ?? "",
        targetSchema: "credit_risks",
      });
      renderCreditRisksSlide(pptx, { slideType: "credit_risks", title: section.title ?? "Credit Risks", ...data });
    }
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeName = deal.asset_name.replace(/[^a-z0-9]+/gi, "_");
  const outputPath = path.join(outputDir, `${safeName}.pptx`);

  await pptx.writeFile({ fileName: outputPath });
  return outputPath;
}