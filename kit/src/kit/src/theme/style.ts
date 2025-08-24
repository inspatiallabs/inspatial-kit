import { createStyle } from "@in/style";

//##############################################(THEME RADIUS)##############################################//

export const ThemeRadius = {
  none: ["rounded-none", { web: { borderRadius: "0px" } }],
  xs: ["rounded-xs", { web: { borderRadius: "2px" } }],
  sm: ["rounded-sm", { web: { borderRadius: "6px" } }],
  md: ["rounded-md", { web: { borderRadius: "8px" } }],
  base: ["rounded-base", { web: { borderRadius: "12px" } }],
  lg: ["rounded-lg", { web: { borderRadius: "16px" } }],
  xl: ["rounded-xl", { web: { borderRadius: "20px" } }],
  "2xl": ["rounded-2xl", { web: { borderRadius: "24px" } }],
  "3xl": ["rounded-3xl", { web: { borderRadius: "32px" } }],
  "4xl": ["rounded-4xl", { web: { borderRadius: "50px" } }],
  "5xl": ["rounded-5xl", { web: { borderRadius: "100px" } }],
  full: ["rounded-full", { web: { borderRadius: "1000px" } }],
} as const;

//##############################################(THEME SIZE)##############################################//

export const ThemeSize = {
  base: [
    "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4 ",
    {
      web: {
        height: "40px",
        minWidth: "40px",
        minHeight: "40px",
        maxHeight: "40px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  sm: [
    "h-[36px] min-w-[36px] min-h-[36px] max-h-[36px] max-w-full px-4",
    {
      web: {
        height: "36px",
        minWidth: "36px",
        minHeight: "36px",
        maxHeight: "36px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  md: [
    "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4",
    {
      web: {
        height: "40px",
        minWidth: "40px",
        minHeight: "40px",
        maxHeight: "40px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  lg: [
    "h-[48px] min-w-[48px] min-h-[48px] max-h-[48px] max-w-full px-4",
    {
      web: {
        height: "48px",
        minWidth: "48px",
        minHeight: "48px",
        maxHeight: "48px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  xl: [
    "h-[52px] min-w-[52px] min-h-[52px] max-h-[52px] max-w-full px-4",
    {
      web: {
        height: "52px",
        minWidth: "52px",
        minHeight: "52px",
        maxHeight: "52px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
} as const;

//##############################################(THEME VARIANT)##############################################//

export const ThemeVariant = {
  flat: [""],
  hollow: [""],
} as const;

//##############################################(THEME FORMAT)##############################################//
// TODO(@benemma): extend from Theme Variables
export const ThemeFormat = {
  inspatial: [""],
  amethyst: [""],
} as const;

//##############################################(THEME MODE)##############################################//

export const ThemeMode = {
  base: [""],
} as const;

//##############################################(THEME MATERIAL)##############################################//

export const ThemeMaterial = {
  tilted: [""],
  translucent: [""],
} as const;

//##############################################(THEME TYPOGRAPHY)##############################################//

export const ThemeTypography = {
  base: [""],
} as const;

//##############################################(THEME SCALE)##############################################//

export const ThemeScale = {
  base: [""],
} as const;

/*################################(THEME STYLE)################################*/
// For the <ThemeController> Widget as well as global theme settings
//#############################################################################
export const ThemeStyle = createStyle({
  /*******************************(Base)********************************/

  base: [""],

  /*******************************(Settings)********************************/
  settings: {
    mode: ThemeMode,
    material: ThemeMaterial,
    variant: ThemeVariant,
    format: ThemeFormat,
    typography: ThemeTypography,
    scale: ThemeScale,
    size: ThemeSize,
    radius: ThemeRadius,
    disabled: {
      true: [
        "opacity-disabled opacity-50 text-(--muted) pointer-events-none cursor-disabled",
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
            color: "var(--muted)",
          },
        },
      ],
      false: [""],
    },
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    mode: "base",
    material: "tilted",
    variant: "flat",
    format: "inspatial",
    size: "base",
    radius: "base",
    disabled: false,
  },
});
