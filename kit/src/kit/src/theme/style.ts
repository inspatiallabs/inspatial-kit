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

//##############################################(THEME [BOX] SIZE)##############################################//

export const ThemeBoxSize = {
  "2xs": [
    "h-[28px]",
    "min-w-[28px]",
    "min-h-[28px]",
    "max-h-[28px]",
    "max-w-full",
    "px-4",
    {
      web: {
        height: "28px",
        minWidth: "28px",
        minHeight: "28px",
        maxHeight: "28px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  xs: [
    "h-[32px]",
    "min-w-[32px]",
    "min-h-[32px]",
    "max-h-[32px]",
    "max-w-full",
    {
      web: {
        height: "32px",
        minWidth: "32px",
        minHeight: "32px",
        maxHeight: "32px",
        maxWidth: "100%",
      },
    },
  ],
  sm: [
    "h-[36px]",
    "min-w-[36px]",
    "min-h-[36px]",
    "max-h-[36px]",
    "max-w-full",
    "px-4",
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
    "h-[40px]",
    "min-w-[40px]",
    "min-h-[40px]",
    "max-h-[40px]",
    "max-w-full",
    "px-4",
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
    "h-[48px]",
    "min-w-[48px]",
    "min-h-[48px]",
    "max-h-[48px]",
    "max-w-full",
    "px-4",
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
    "h-[52px]",
    "min-w-[52px]",
    "min-h-[52px]",
    "max-h-[52px]",
    "max-w-full",
    "px-4",
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
  "2xl": [
    "h-[56px]",
    "min-w-[56px]",
    "min-h-[56px]",
    "max-h-[56px]",
    "max-w-full",
    "px-4",
    {
      web: {
        height: "56px",
        minWidth: "56px",
        minHeight: "56px",
        maxHeight: "56px",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  "3xl": [
    "h-[64px]",
    "min-w-[64px]",
    "min-h-[64px]",
    "max-h-[64px]",
    "max-w-full",
    "px-4",
    {
      web: {
        height: "64px",
        minWidth: "64px",
        minHeight: "64px",
        maxHeight: "64px",
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

//##############################################(THEME AXIS)##############################################//

export const ThemeAxis = {
  x: ["flex flex-row", { web: { display: "flex", flexDirection: "row" } }],
  y: [
    "flex flex-col rotate-90",
    { web: { display: "flex", flexDirection: "column" } },
  ],
  z: [
    "flex flex-row-reverse perspective-[-3000px] transform-3d skew-x-12",
    { web: { display: "flex", flexDirection: "row-reverse" } },
  ],
} as const;

//##############################################(THEME DISABLED)##############################################//

export const ThemeDisabled = {
  true: [
    "opacity-disabled opacity-50",
    "text-(--muted)",
    "pointer-events-none",
    "cursor-disabled",
    {
      web: {
        opacity: 0.5,
        color: "var(--muted)",
        pointerEvents: "none",
        cursor: "disabled",
      },
    },
  ],
  false: [""],
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
    size: ThemeBoxSize,
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
