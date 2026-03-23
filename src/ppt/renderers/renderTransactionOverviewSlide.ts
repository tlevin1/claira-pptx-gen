import PptxGenJS from "pptxgenjs";
import { TransactionOverviewSlideData } from "../../normalize/extractTransactionOverview";
import { THEME } from "../theme";

function toBulletRuns(items: string[]) {
  return items.map((item) => ({
    text: item,
    options: { bullet: { indent: 10 } },
  }));
}

export function renderTransactionOverviewSlide(
  pptx: PptxGenJS,
  data: TransactionOverviewSlideData
) {
  const slide = pptx.addSlide();

  slide.addText(data.title, {
    x: 0.5,
    y: 0.3,
    w: 6.0,
    h: 0.4,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.title,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addShape("rect", {
    x: 0.5,
    y: 1.0,
    w: 5.0,
    h: 5.6,
    fill: { color: "FFFFFF" },
    line: { color: THEME.colors.border, pt: 1 },
  });

  slide.addText("Summary", {
    x: 0.65,
    y: 1.1,
    w: 2.0,
    h: 0.25,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.sectionHeader,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addText(toBulletRuns(data.summaryBullets.length ? data.summaryBullets : ["Not disclosed in documents."]), {
    x: 0.65,
    y: 1.45,
    w: 4.65,
    h: 4.9,
    fontFace: THEME.fonts.body,
    fontSize: THEME.fontSizes.body,
    color: THEME.colors.text,
    margin: 0.04,
    breakLine: false,
    fit: "shrink",
    valign: "top",
  });


  const rows = [
  [
    { text: "Field", options: { bold: true, color: THEME.colors.white } },
    { text: "Value", options: { bold: true, color: THEME.colors.white } },
  ],
  ...(data.transactionDetails.length
    ? data.transactionDetails.map((row) => [
        { text: row.label },
        { text: row.value },
      ])
    : [[
        { text: "Not disclosed" },
        { text: "Not disclosed in documents." },
      ]]),
];

  slide.addTable(rows, {
    x: 5.8,
    y: 1.0,
    w: 6.6,
    h: 5.6,
  });
}