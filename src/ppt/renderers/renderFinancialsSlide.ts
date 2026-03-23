import PptxGenJS from "pptxgenjs";
import { FinancialsSlideData } from "../../normalize/extractFinancials";
import { THEME } from "../theme";

function toBulletRuns(items: string[]) {
  return items.map((item) => ({
    text: item,
    options: { bullet: { indent: 10 } },
  }));
}

export function renderFinancialsSlide(
  pptx: PptxGenJS,
  data: FinancialsSlideData
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

  const bodyRows = (data.rows.length
    ? data.rows
    : [["Not disclosed", "Not disclosed in documents."]]
  ).map((row) =>
    row.map((cell) => ({
      text: String(cell),
    }))
  );

  const rows = [
    data.columns.map((col) => ({
      text: col,
      options: { bold: true, color: THEME.colors.white },
    })),
    ...bodyRows,
  ];

  slide.addTable(rows, {
    x: 0.5,
    y: 1.0,
    w: 8.0,
    h: 5.3,
    border: { type: "solid", pt: 1, color: THEME.colors.border },
    fill: { color: "FFFFFF" },
    color: THEME.colors.text,
    fontFace: THEME.fonts.body,
    fontSize: THEME.fontSizes.body,
    margin: 0.05,
    rowH: 0.4,
    colW: data.columns.length === 2 ? [4.0, 4.0] : undefined,
    valign: "middle",
  });

  slide.addShape("rect", {
    x: 8.8,
    y: 1.0,
    w: 3.8,
    h: 5.3,
    fill: { color: "FFFFFF" },
    line: { color: THEME.colors.border, pt: 1 },
  });

  slide.addText("Key Takeaways", {
    x: 8.95,
    y: 1.1,
    w: 2.5,
    h: 0.25,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.sectionHeader,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addText(
    toBulletRuns(
      data.summaryBullets.length
        ? data.summaryBullets
        : ["No additional summary commentary extracted."]
    ),
    {
      x: 8.95,
      y: 1.45,
      w: 3.35,
      h: 4.6,
      fontFace: THEME.fonts.body,
      fontSize: THEME.fontSizes.body,
      color: THEME.colors.text,
      margin: 0.04,
      breakLine: false,
      fit: "shrink",
      valign: "top",
    }
  );
}