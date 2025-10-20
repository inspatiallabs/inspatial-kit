import { createStyle } from "@in/style";
import {
  ThemeAxis,
  ThemeDisabled,
  ThemeRadius,
  ThemeBoxSize,
  ThemeScale,
} from "@in/widget/theme/index.ts";
import { ThemeMaterial } from "@in/widget/theme/style.ts";

/*##################################(BUTTON FORMAT)##################################*/
export const ButtonFormat = {
  base: [
    {
      web: {
        backgroundColor: "var(--brand)",
        color: "var(--color-white)",
        boxShadow: "var(--shadow-effect)",
        "&:hover": {
          boxShadow: "var(--shadow-prime)",
          backgroundColor: "var(--brand)",
        },
      },
    },
  ],
  outline: [
    "outline outline-2 outline-(--brand) bg-inherit hover:bg-(--brand) text-primary hover:text-white",
    {
      web: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        // outlineColor intentionally left to classes for override
      },
    },
  ],
  outlineSurface: [
    {
      web: {
        borderWidth: "2px",
        boxShadow: "var(--shadow-subtle)",
        borderColor: "var(--surface)",
        "&:hover": {
          backgroundColor: "var(--surface)",
        },
      },
    },
  ],
  outlineBackground: [
    {
      web: {
        borderWidth: "2px",
        boxShadow: "var(--shadow-subtle)",
        borderColor: "var(--background)",
        "&:hover": {
          backgroundColor: "var(--surface)",
          borderColor: "var(--brand)",
          borderTopWidth: "4px",
          borderBottomWidth: "0.5px",
          borderLeftWidth: "2px",
          borderRightWidth: "2px",
          color: "var(--primary)",
        },
      },
    },
  ],
  outlineMuted: [
    {
      web: {
        borderWidth: "2px",
        // borderColor/backgroundColor via classes for override
        boxShadow: "var(--shadow-subtle)",
        borderColor: "var(--muted)",
      },
    },
  ],
  ghost: [{ web: { backgroundColor: "transparent", boxShadow: "none" } }],
  background: [
    {
      web: {
        backgroundColor: "var(--background)",
        boxShadow: "none",
        color: "var(--secondary)",
        "&:hover": {
          backgroundColor: "var(--surface)",
          borderWidth: "2px",
          borderColor: "var(--background)",
        },
      },
    },
  ],
  surface: [
    {
      web: {
        backgroundColor: "var(--surface)",
        boxShadow: "none",
        color: "var(--secondary)",
        "&:hover": {
          backgroundColor: "var(--surface)",
        },
      },
    },
  ],
  underline: [
    {
      web: {
        textDecorationThickness: "4px",
        textDecorationColor: "var(--brand)",
        textUnderlineOffset: "4px",
        // decoration color via class
      },
    },
  ],
  //     barrow: "",
  //     segmented: "",
  //     inline: "",
  //     urban: "",
} as const;

/*##################################(BUTTON STYLE)##################################*/
export const ButtonStyle = {
  wrapper: createStyle({
    name: "button-wrapper",
    /*******************************(Base)********************************/
    base: [
      {
        web: {
          display: "inline-flex",
          outline: "none",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          "&:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
            backgroundBlendMode: "color-dodge, normal, normal",
          },
        },
      },
    ],

    /*******************************(Settings)********************************/
    settings: {
      format: ButtonFormat,
      material: ThemeMaterial,
      size: ThemeBoxSize, // Always set max and min values this restrains the size of the button especially when using InSpatial Widgets to keep them from mirroring the parent container sizing
      scale: ThemeScale,
      radius: ThemeRadius,
      axis: ThemeAxis,
      disabled: ThemeDisabled,
    },

    /*******************************(Default Settings)********************************/
    defaultSettings: {
      format: "base",
      material: "flat",
      size: "base",
      radius: "md",
      scale: "none",
      axis: "x",
      disabled: false,
    },
  }),

  //##############################################(LOADER)##############################################//

  loader: createStyle({
    name: "button-loader",
    base: [
      {
        web: {
          display: "inline-flex",
          cursor: "pointer",
          pointerEvents: "none",
          shrink: "0",
          gap: "1.5",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
    ],
  }),
};
