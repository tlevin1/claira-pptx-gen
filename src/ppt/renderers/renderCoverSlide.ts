import PptxGenJS from "pptxgenjs";
import { THEME } from "../theme";
import { LAYOUTS } from "../layouts";

export function renderCoverSlide(
  pptx: PptxGenJS,
  dealName: string,
  subtitle = "Credit Presentation"
) {
  const slide = pptx.addSlide();

  slide.background = { color: "FFFFFF" };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.7,
    fill: { color: THEME.colors.navy },
    line: { color: THEME.colors.navy },
  });

  slide.addText(dealName, {
    ...LAYOUTS.cover.title,
    fontFace: THEME.fonts.heading,
    fontSize: THEME.fontSizes.title + 6,
    bold: true,
    color: THEME.colors.navy,
    margin: 0,
  });

  slide.addText(subtitle, {
    ...LAYOUTS.cover.subtitle,
    fontFace: THEME.fonts.body,
    fontSize: THEME.fontSizes.sectionHeader,
    color: THEME.colors.muted,
    margin: 0,
  });
}