import PptxGenJS from "pptxgenjs";
import { CreditRisksSlideData } from "../../normalize/extractCreditRisks";
import { LAYOUTS } from "../layouts";
import { THEME } from "../theme";

export function renderCreditInfoSlide(
  pptx: PptxGenJS,
  data: CreditRisksSlideData
) {
  const slide = pptx.addSlide();

  slide.addText(data.title, {
    ...LAYOUTS.creditRisks.title,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.title,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  const rows = [
    [
      { text: "Risk", options: { bold: true, color: THEME.colors.white } },
      { text: "Description", options: { bold: true, color: THEME.colors.white } },
      { text: "Mitigant / Commentary", options: { bold: true, color: THEME.colors.white } },
    ],
    ...data.rows.map((row) => [
      { text: row.risk },
      { text: row.description },
      { text: row.mitigant },
    ]),
  ];

slide.addTable(rows, {
  ...LAYOUTS.creditRisks.table,
  border: { type: "solid", pt: 1, color: THEME.colors.border },
  fill: { color: "FFFFFF" },
  color: THEME.colors.text,
  fontFace: THEME.fonts.body,
  fontSize: THEME.fontSizes.body,
  margin: 0.05,
  rowH: 0.5,
  colW: [2.2, 6.0, 3.8],
  valign: "middle",
  bold: false,
});
}