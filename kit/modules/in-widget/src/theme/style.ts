import { createStyle } from "@in/style";
import type {
  ITypographyProps,
  TypographyStyleProps,
} from "@in/style/font/types.ts";

//##############################################(THEME VIEW)##############################################//

export const ThemeView = {
  floating: [""],
  compact: [""],
  base: [""],
} as const;

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
  none: [
    "h-[0px]",
    "w-[0px]",
    {
      web: {
        height: "0px",
        width: "0px",
      },
    },
  ],
  "12xs": [
    "h-[2px]",
    "min-w-[2px]",
    "min-h-[2px]",
    "max-h-[2px]",
    "max-w-full",
    {
      web: {
        height: "2px",
        minWidth: "2px",
        minHeight: "2px",
        maxHeight: "2px",
        maxWidth: "100%",
      },
    },
  ],
  "11xs": [
    "h-[4px]",
    "min-w-[4px]",
    "min-h-[4px]",
    "max-h-[4px]",
    "max-w-full",
    {
      web: {
        height: "4px",
        minWidth: "4px",
        minHeight: "4px",
        maxHeight: "4px",
        maxWidth: "100%",
      },
    },
  ],
  "10xs": [
    "h-[6px]",
    "min-w-[6px]",
    "min-h-[6px]",
    "max-h-[6px]",
    "max-w-full",
    {
      web: {
        height: "6px",
        minWidth: "6px",
        minHeight: "6px",
        maxHeight: "6px",
        maxWidth: "100%",
      },
    },
  ],
  "9xs": [
    "h-[8px]",
    "min-w-[8px]",
    "min-h-[8px]",
    "max-h-[8px]",
    "max-w-full",
    {
      web: {
        height: "8px",
        minWidth: "8px",
        minHeight: "8px",
        maxHeight: "8px",
        maxWidth: "100%",
      },
    },
  ],
  "8xs": [
    "h-[10px]",
    "min-w-[10px]",
    "min-h-[10px]",
    "max-h-[10px]",
    "max-w-full",
    {
      web: {
        height: "10px",
        minWidth: "10px",
        minHeight: "10px",
        maxHeight: "10px",
        maxWidth: "100%",
      },
    },
  ],
  "7xs": [
    "h-[12px]",
    "min-w-[12px]",
    "min-h-[12px]",
    "max-h-[12px]",
    "max-w-full",
    {
      web: {
        height: "12px",
        minWidth: "12px",
        minHeight: "12px",
        maxHeight: "12px",
        maxWidth: "100%",
      },
    },
  ],
  "6xs": [
    "h-[14px]",
    "min-w-[14px]",
    "min-h-[14px]",
    "max-h-[14px]",
    "max-w-full",
    {
      web: {
        height: "14px",
        minWidth: "14px",
        minHeight: "14px",
        maxHeight: "14px",
        maxWidth: "100%",
      },
    },
  ],
  "5xs": [
    "h-[16px]",
    "min-w-[16px]",
    "min-h-[16px]",
    "max-h-[16px]",
    "max-w-full",
    {
      web: {
        height: "16px",
        minWidth: "16px",
        minHeight: "16px",
        maxHeight: "16px",
        maxWidth: "100%",
      },
    },
  ],
  "4xs": [
    "h-[20px]",
    "min-w-[20px]",
    "min-h-[20px]",
    "max-h-[20px]",
    "max-w-full",
    {
      web: {
        height: "20px",
        minWidth: "20px",
        minHeight: "20px",
        maxHeight: "20px",
        maxWidth: "100%",
      },
    },
  ],
  "3xs": [
    "h-[24px]",
    "min-w-[24px]",
    "min-h-[24px]",
    "max-h-[24px]",
    "max-w-full",

    {
      web: {
        height: "24px",
        minWidth: "24px",
        minHeight: "24px",
        maxHeight: "24px",
        maxWidth: "100%",
      },
    },
  ],
  "2xs": [
    "h-[28px]",
    "min-w-[28px]",
    "min-h-[28px]",
    "max-h-[28px]",
    "max-w-full",
    {
      web: {
        height: "28px",
        minWidth: "28px",
        minHeight: "28px",
        maxHeight: "28px",
        maxWidth: "100%",
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
    {
      web: {
        height: "36px",
        minWidth: "36px",
        minHeight: "36px",
        maxHeight: "36px",
        maxWidth: "100%",
      },
    },
  ],
  md: [
    "h-[40px]",
    "min-w-[40px]",
    "min-h-[40px]",
    "max-h-[40px]",
    "max-w-full",
    {
      web: {
        height: "40px",
        minWidth: "40px",
        minHeight: "40px",
        maxHeight: "40px",
        maxWidth: "100%",
      },
    },
  ],
  fit: [
    "h-fit",
    "min-w-fit",
    "min-h-fit",
    "max-w-full",
    "px-4",
    {
      web: {
        height: "fit-content",
        minWidth: "fit-content",
        minHeight: "fit-content",
        maxWidth: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ],
  base: [
    "h-[48px]",
    "min-w-fit",
    "min-h-[48px]",
    "w-auto",
    "max-w-full",
    "px-5 py-3",
    {
      web: {
        height: "48px",
        minWidth: "fit-content",
        minHeight: "48px",
        width: "auto",
        maxWidth: "100%",
        padding: "12px 20px",
      },
    },
  ],
  auto: [
    "h-[48px]",
    "min-w-fit",
    "min-h-[48px]",
    "w-full",
    "max-w-full",
    "px-5 py-3",
    {
      web: {
        height: "48px",
        minWidth: "fit-content",
        minHeight: "48px",
        width: "100%",
        maxWidth: "100%",
        padding: "12px 20px",
      },
    },
  ],
  lg: [
    "h-[48px]",
    "min-w-[48px]",
    "min-h-[48px]",
    "max-h-[48px]",
    "max-w-full",
    {
      web: {
        height: "48px",
        minWidth: "48px",
        minHeight: "48px",
        maxHeight: "48px",
        maxWidth: "100%",
      },
    },
  ],
  xl: [
    "h-[52px]",
    "min-w-[52px]",
    "min-h-[52px]",
    "max-h-[52px]",
    "max-w-full",
    {
      web: {
        height: "52px",
        minWidth: "52px",
        minHeight: "52px",
        maxHeight: "52px",
        maxWidth: "100%",
      },
    },
  ],
  "2xl": [
    "h-[56px]",
    "min-w-[56px]",
    "min-h-[56px]",
    "max-h-[56px]",
    "max-w-full",
    {
      web: {
        height: "56px",
        minWidth: "56px",
        minHeight: "56px",
        maxHeight: "56px",
        maxWidth: "100%",
      },
    },
  ],
  "3xl": [
    "h-[64px]",
    "min-w-[64px]",
    "min-h-[64px]",
    "max-h-[64px]",
    "max-w-full",
    {
      web: {
        height: "64px",
        minWidth: "64px",
        minHeight: "64px",
        maxHeight: "64px",
        maxWidth: "100%",
      },
    },
  ],
} as const;

//##############################################(THEME SPACING)##############################################//

export const ThemeSpacing = {
  none: [""],
} as const;

//##############################################(THEME CURSOR)##############################################//

export const ThemeCursor = {
  auto: [""],
  base: [""],
  select: ["cursor-select", { web: { cursor: "select" } }],
  Orbit: ["cursor-orbit", { web: { cursor: "orbit" } }],
  pointer: ["cursor-pointer", { web: { cursor: "pointer" } }],
  pan: ["cursor-pan", { web: { cursor: "pan" } }],
  panning: ["cursor-panning", { web: { cursor: "panning" } }],
  loading: ["cursor-loading", { web: { cursor: "loading" } }],
  Help: ["cursor-help", { web: { cursor: "help" } }],
  disabled: ["cursor-disabled", { web: { cursor: "disabled" } }],
  textX: ["cursor-text-x", { web: { cursor: "text-x" } }],
  textY: ["cursor-text-y", { web: { cursor: "text-y" } }],
  cross: ["cursor-cross", { web: { cursor: "cross" } }],
  zoomIn: ["cursor-zoom-in", { web: { cursor: "zoom-in" } }],
  zoomOut: ["cursor-zoom-out", { web: { cursor: "zoom-out" } }],
  copy: ["cursor-copy", { web: { cursor: "copy" } }],
  move: ["cursor-move", { web: { cursor: "move" } }],
  resizeY: ["cursor-resize-y", { web: { cursor: "resize-y" } }],
  resizeX: ["cursor-resize-x", { web: { cursor: "resize-x" } }],
  resizeT: ["cursor-resize-t", { web: { cursor: "resize-t" } }],
  resizeR: ["cursor-resize-r", { web: { cursor: "resize-r" } }],
  resizeB: ["cursor-resize-b", { web: { cursor: "resize-b" } }],
  resizeL: ["cursor-resize-l", { web: { cursor: "resize-l" } }],
  resizeTLBR: ["cursor-resize-tlbr", { web: { cursor: "resize-tlbr" } }],
  resizeTRBL: ["cursor-resize-trbl", { web: { cursor: "resize-trbl" } }],
  resizeTL: ["cursor-resize-tl", { web: { cursor: "resize-tl" } }],
  resizeTR: ["cursor-resize-tr", { web: { cursor: "resize-tr" } }],
  resizeBL: ["cursor-resize-bl", { web: { cursor: "resize-bl" } }],
  resizeBR: ["cursor-resize-br", { web: { cursor: "resize-br" } }],
} as const;

//##############################################(THEME FORMAT)##############################################//
export const ThemeFormat = {
  inspatialKit: [""],
  weddingClub: [""],
  appleCupertino: [""],
  googleMaterial: [""],
  microsoftFluent: [""],
  lavender: [""],
  blossom: [""],
  sky: [""],
  sunset: [""],
  forest: [""],
  ocean: [""],
  midnight: [""],
  autumn: [""],
  polar: [""],
  mocha: [""],
  neon: [""],
  pastel: [""],
  monochrome: [""],
  metropolis: [""],
  cyberpunk: [""],
  earth: [""],
  retro: [""],
  noire: [""],
  tropical: [""],
  nordic: [""],
  steampunk: [""],
  breeze: [""],
  emerald: [""],
  dusk: [""],
  amethyst: [""],
  cherry: [""],
  rustic: [""],
  arctic: [""],
  expresso: [""],
  sherbet: [""],
  mamal: [""],
  terra: [""],
  vintage: [""],
  noir: [""],
  island: [""],
  fjord: [""],
  brass: [""],
  unoclub: [""],
  duoclub: [""],
  tresclub: [""],
  zinc: [""],
} as const;

//##############################################(THEME EFFECT)##############################################//

export const ThemeEffect = {
  base: [""],
  hollow: [""],
  brutal: [""],
  soft: [""],
  chasm: [""],
  cool: [""],
  prime: [""],
  line: [""],
  inn: [""],
} as const;

//##############################################(THEME MODE)##############################################//

export const ThemeMode = {
  auto: [""],
  light: [""],
  dark: [""],
} as const;

//##############################################(THEME MATERIAL)##############################################//

export const ThemeMaterial = {
  tilted: ["material-tilted"],
  translucent: [""],
  flat: [""], // Default
} as const;

//##############################################(THEME TYPOGRAPHY)##############################################//

export const ThemeTypography = {
  base: [""],
} as ITypographyProps | TypographyStyleProps;

//##############################################(THEME SCALE)##############################################//

export const ThemeScale = {
  none: [""],
  "12xs": ["p-[2px]", { web: { padding: "2px" } }],
  "11xs": ["p-[4px]", { web: { padding: "4px" } }],
  "10xs": ["p-[6px]", { web: { padding: "6px" } }],
  "9xs": ["p-[8px]", { web: { padding: "8px" } }],
  "8xs": ["p-[10px]", { web: { padding: "10px" } }],
  "7xs": ["p-[12px]", { web: { padding: "12px" } }],
  "6xs": ["p-[14px]", { web: { padding: "14px" } }],
  "5xs": ["p-[16px]", { web: { padding: "16px" } }],
  "4xs": ["p-[20px]", { web: { padding: "20px" } }],
  "3xs": ["p-[24px]", { web: { padding: "24px" } }],
  "2xs": ["p-[28px]", { web: { padding: "28px" } }],
  xs: ["p-[32px]", { web: { padding: "32px" } }],
  sm: ["p-[36px]", { web: { padding: "36px" } }],
  md: ["p-[40px]", { web: { padding: "40px" } }],
  fit: ["px-4", { web: { paddingLeft: "1rem", paddingRight: "1rem" } }],
  base: ["px-5 py-3", { web: { padding: "12px 20px" } }],
  auto: ["px-5 py-3", { web: { padding: "12px 20px" } }],
  lg: ["p-[48px]", { web: { padding: "48px" } }],
  xl: ["p-[52px]", { web: { padding: "52px" } }],
  "2xl": ["p-[56px]", { web: { padding: "56px" } }],
  "3xl": ["p-[64px]", { web: { padding: "64px" } }],
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
    "cursor-not-allowed",
    {
      web: {
        opacity: 0.5,
        color: "var(--muted)",
        pointerEvents: "none",
        cursor: "not-allowed",
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
    effect: ThemeEffect,
    cursor: ThemeCursor,
    format: ThemeFormat as typeof ThemeFormat,
    typography: typeof ThemeTypography as
      | ITypographyProps
      | TypographyStyleProps,
    scale: ThemeScale,
    size: ThemeBoxSize,
    spacing: ThemeSpacing,
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
    effect: "base",
    format: "inspatialKit",
    mode: "auto",
    material: "tilted",
    spacing: "none",
    cursor: "auto",
    radius: "base",
    size: "base",
    scale: "none",
    typography: "base",
    disabled: false,
  },

  /*******************************(Variable Composition)********************************/
  // Move the composition from the variables.ts file here
  // composition: {},
});
