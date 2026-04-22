import PptxGenJS from "pptxgenjs";
import { THEME } from "../theme";

export function renderCoverSlide(
  pptx: PptxGenJS,
  dealName: string,
  date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
) {
  const slide = pptx.addSlide();

  slide.background = { color: THEME.colors.coverBlue };

  // "exos | Credit" branding top-left
  slide.addText([
    { text: "exos", options: { bold: true, color: "1A1A1A" } },
    { text: " | Credit", options: { bold: false, color: THEME.colors.white } },
  ], {
    x: 0.5,
    y: 0.35,
    w: 5.0,
    h: 0.65,
    fontFace: THEME.fonts.heading,
    fontSize: 36,
  });

  // Project name lower-left
  slide.addText(dealName, {
    x: 0.5,
    y: 3.8,
    w: 8.0,
    h: 0.75,
    fontFace: THEME.fonts.heading,
    fontSize: 32,
    bold: false,
    color: THEME.colors.white,
  });

  // Date below project name
  slide.addText(date, {
    x: 0.5,
    y: 4.6,
    w: 5.0,
    h: 0.4,
    fontFace: THEME.fonts.body,
    fontSize: 16,
    color: THEME.colors.white,
  });

  // Chevron shape bottom-right
  slide.addText("❯", {
    x: 10.2,
    y: 5.2,
    w: 1.2,
    h: 1.8,
    fontFace: THEME.fonts.heading,
    fontSize: 96,
    bold: true,
    color: "1A1A1A",
  });
}
