import PptxGenJS from "pptxgenjs";
import { CompanyOverviewSlideData } from "../../normalize/extractCompanyOverview";
import { LAYOUTS } from "../layouts";
import { THEME } from "../theme";

function toBulletRuns(items: string[]) {
  return items.map((item) => ({
    text: item,
    options: { bullet: { indent: 10 } },
  }));
}

function addSectionBox(
  slide: PptxGenJS.Slide,
  title: string,
  items: string[],
  box: { x: number; y: number; w: number; h: number }
) {
  slide.addShape("rect", {
    ...box,
    fill: { color: "FFFFFF" },
    line: { color: THEME.colors.border, pt: 1 },
  });

  slide.addText(title, {
    x: box.x + 0.1,
    y: box.y + 0.08,
    w: box.w - 0.2,
    h: 0.25,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.sectionHeader,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addText(toBulletRuns(items), {
    x: box.x + 0.12,
    y: box.y + 0.42,
    w: box.w - 0.24,
    h: box.h - 0.52,
    fontFace: THEME.fonts.body,
    fontSize: THEME.fontSizes.body,
    color: THEME.colors.text,
    margin: 0.04,
    breakLine: false,
    valign: "top",
    fit: "shrink",
  });
}

export function renderCompanyOverviewSlide(
  pptx: PptxGenJS,
  data: CompanyOverviewSlideData
) {
  const slide = pptx.addSlide();

  slide.addText(data.title, {
    ...LAYOUTS.companyOverview.title,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.title,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addText(data.companyName, {
    ...LAYOUTS.companyOverview.companyName,
    fontFace: THEME.fonts.body,
    fontSize: THEME.fontSizes.sectionHeader,
    color: THEME.colors.muted,
    bold: true,
    margin: 0,
  });

  addSectionBox(
    slide,
    "Business Description",
    data.businessDescription,
    LAYOUTS.companyOverview.topLeft
  );

  addSectionBox(
    slide,
    "Products / Services",
    data.productsServices,
    LAYOUTS.companyOverview.topRight
  );

  const revenueItems = data.revenueSegmentation.map(
    (row) => `${row.label}: ${row.value}`
  );

  addSectionBox(
    slide,
    "Revenue Segmentation",
    revenueItems.length ? revenueItems : ["Not disclosed in documents."],
    LAYOUTS.companyOverview.bottomLeft
  );

  addSectionBox(
    slide,
    "Markets / Customers / Watchpoints",
    [...data.endMarkets, ...data.keyCustomers, ...data.watchpoints].slice(0, 8),
    LAYOUTS.companyOverview.bottomRight
  );
}