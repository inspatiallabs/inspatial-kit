import { createStyle } from "@in/style/index.ts";
import {
  ThemeBoxSize,
  ThemeDisabled,
  ThemeMaterial,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";
import { ThemeSpacing } from "@in/widget/theme/index.ts";

//##############################################(BADGE STYLE)##############################################//
export const BadgeStyle = createStyle({
  base: ["inline-flex items-center text-sm"],

  settings: {
    //##############################################(FORMAT PROP)##############################################//
    format: {
      base: ["bg-(--brand)/20 text-white dark:text-white"],
      muted: ["bg-(--muted)/20 text-(--primary)"],
      surface: ["bg-(--surface) text-(--secondary)"],
      primary: ["bg-(--primary) text-white"],
      secondary: ["bg-(--secondary) text-white"],

      success: ["bg-green/20 text-green"],
      warning: ["bg-yellow/20 text-yellow"],
      error: ["bg-red/20 text-red"],
    },

    //##############################################(SIZE PROP)##############################################//
    size: ThemeBoxSize,

    //##############################################(SCALE PROP)##############################################//
    scale: ThemeScale,

    //##############################################(MATERIAL PROP)##############################################//
    material: ThemeMaterial,

    //##############################################(RADIUS PROP)##############################################//
    radius: ThemeRadius,

    //##############################################(SPACING PROP)##############################################//
    spacing: ThemeSpacing,

    //##############################################(DISABLED PROP)##############################################//
    disabled: ThemeDisabled,
  },

  defaultSettings: {
    format: "base",
    size: "fit",
    scale: "12xs",
    material: "flat",
    radius: "full",
    spacing: "none",
    disabled: false,
  },
});
