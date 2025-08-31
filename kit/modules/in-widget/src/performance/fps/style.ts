import { createStyle } from "@in/style";
import { ThemeBoxSize, ThemeRadius } from "@in/widget/theme/index.ts";

export const FPSStyle = createStyle({
  base: [
    "absolute",
    {
      web: {
        position: "absolute",
      },
    },
  ],

  settings: {
    format: {
      base: [
        "bg-(--surface)",
        "text-(--primary)",
        "text-xs",
        "bottom-0",
        "right-0",
        "z-50",
        "material-tilted",
        {
          web: {
            backgroundColor: "var(--surface)",
            color: "var(--primary)",
            fontSize: "var(--text-xs)",
            bottom: "0px",
            right: "0px",
            zIndex: "50",
          },
        },
      ],
    },
    size: ThemeBoxSize,
    radius: ThemeRadius,
  },

  defaultSettings: {
    format: "base",
    size: "fit",
    radius: "none",
  },
});
