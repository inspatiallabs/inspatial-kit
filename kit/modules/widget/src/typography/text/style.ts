// import { GoogleFontProps, PrimitiveFontProps } from "@in/style/font";
import { createStyle } from "@in/style";

//##############################################(FONT)##############################################//

const FontVariants = {
  // ...Object.fromEntries(GoogleFontProps.map((font) => [font.name, ""])),
  // ...Object.fromEntries(PrimitiveFontProps.map((font) => [font.name, ""])),
  // Add any additional custom fonts here if needed
};

// add more when you get the types e.g. GoogleFontsStartingWithB etc...
export type AllFontVariants = typeof FontVariants;

//##############################################(VARIANTS)##############################################//

export const TypographyStyle = createStyle({
  base: ["inline-flex", { web: { display: "inline-flex" } }],
  settings: {
    variant: {
      text: [""],
      quote: [""],
      code: [""],
    },
    format: {
      base: [""],
    },
  },
  defaultSettings: {
    variant: "text",
    format: "base",
  },
});
