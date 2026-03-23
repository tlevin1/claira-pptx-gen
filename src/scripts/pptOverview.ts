import PptxGenJS from "pptxgenjs";
import { loadCredentials } from "../api/credentials";
import { authenticate } from "../api/auth";
import { ClairaClient } from "../api/clairaClient";

async function main() {
  const creds = loadCredentials();
  const token = await authenticate(creds.auth_url, creds.email, creds.password);
  const client = new ClairaClient(creds.api_url, token);

  const deals = await client.listDeals();
  const deal = deals[0];
  const dashboards = deal ? await client.getDashboards(deal.id) : [];
  const sections = dashboards[0] ? await client.getSections(dashboards[0].id) : [];

  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  // Template-like styling (match your template visually)
  slide.addText("Company Overview", { x: 0.5, y: 0.3, fontSize: 32, bold: true, color: "003366" });
  slide.addText(`Deal: ${deal?.asset_name ?? "N/A"}`, { x: 0.5, y: 1.0, fontSize: 20 });
  slide.addText(`Deals: ${deals.length}`, { x: 0.5, y: 1.6, fontSize: 16 });
  slide.addText(`Dashboards: ${dashboards.length}`, { x: 0.5, y: 2.0, fontSize: 16 });
  slide.addText(`Sections: ${sections.length}`, { x: 0.5, y: 2.4, fontSize: 16 });

  if (dashboards.length) {
    slide.addText(`Top dashboard: ${dashboards[0].title ?? "N/A"}`, { x: 0.5, y: 2.9, fontSize: 14 });
  }

  const rows = sections.slice(0, 8).map((s) => [
    { text: s.id },
    { text: s.title ?? "Untitled" },
  ]);

  if (rows.length) {
    slide.addTable(
      [
        [
          { text: "Section ID", options: { bold: true } },
          { text: "Section Title", options: { bold: true } },
        ],
        ...rows,
      ],
      {
        x: 0.5,
        y: 3.5,
        w: 9,
        border: { pt: 0.5, color: "DDDDDD" },
      }
    );
  }

  await pptx.writeFile({ fileName: "company-overview.pptx" });
  console.log("Saved company-overview.pptx");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});