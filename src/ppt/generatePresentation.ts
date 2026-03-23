import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";
import { Deal, Section } from "../api/types";
import { classifySection } from "../normalize/classifySection";
import { extractCompanyOverview } from "../normalize/extractCompanyOverview";
import { extractCreditRisks } from "../normalize/extractCreditRisks";
import { extractCreditInfo } from "../normalize/extractCreditInfo";
import { extractTransactionOverview } from "../normalize/extractTransactionOverview";
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

  renderCoverSlide(pptx, deal.asset_name);

  for (const section of allSections) {
    const kind = classifySection(section);

    if (kind === "company_overview") {
      renderCompanyOverviewSlide(pptx, extractCompanyOverview(section));
    }  else if (kind === "financials") {
      renderFinancialsSlide(pptx, extractFinancials(section));
    }else if (kind === "transaction_overview") {
      renderTransactionOverviewSlide(pptx, extractTransactionOverview(section));
    }
    else if (kind === "credit_info") {
      renderCreditInfoSlide(pptx, extractCreditInfo(section));
    } 
    else if (kind === "credit_risks") {
      renderCreditRisksSlide(pptx, extractCreditRisks(section));
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