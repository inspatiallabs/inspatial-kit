import { createStyle } from "@in/style";
import { ThemeEffect, ThemeRadius } from "@in/widget/theme/index.ts";

/*###################################(STYLE)###################################*/
export const ImageStyle = createStyle({
  base: [
    {
      web: { display: "block" },
    },
  ],
  settings: {
    fit: {
      contain: [{ web: { objectFit: "contain" } }],
      cover: [{ web: { objectFit: "cover" } }],
      fill: [{ web: { objectFit: "fill" } }],
      none: [{ web: { width: "auto", height: "auto" } }],
    },
    radius: ThemeRadius,
    aspect: {
      auto: [""],
      "1/1": [{ web: { aspectRatio: "1 / 1" } }],
      "3/2": [{ web: { aspectRatio: "3 / 2" } }],
      "16/9": [{ web: { aspectRatio: "16 / 9" } }],
    },
    effect: ThemeEffect,
    inline: {
      true: ["inline-block"],
      false: ["block"],
    },
  },
  defaultSettings: {
    fit: "none",
    radius: "none",
    aspect: "auto",
    effect: "none",
    inline: true,
  },
});
