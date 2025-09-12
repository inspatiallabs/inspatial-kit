import { createStyle } from "@in/style";
import type {
  ITypographyProps,
  TypographyStyleProps,
} from "@in/style/font/types.ts";

//##############################################(THEME VIEW)##############################################//

export const ThemeView = {
  base: [""],
  floating: [""],
  compact: [""],

  padLeft: [{ web: { float: "right", width: "91.666667%" } }],
  padRight: [{ web: { float: "left", width: "91.666667%" } }],
} as const;

//##############################################(THEME RADIUS)##############################################//

export const ThemeRadius = {
  none: [{ web: { borderRadius: "0px" } }],
  xs: [{ web: { borderRadius: "2px" } }],
  sm: [{ web: { borderRadius: "6px" } }],
  md: [{ web: { borderRadius: "8px" } }],
  base: [{ web: { borderRadius: "12px" } }],
  lg: [{ web: { borderRadius: "16px" } }],
  xl: [{ web: { borderRadius: "20px" } }],
  "2xl": [{ web: { borderRadius: "24px" } }],
  "3xl": [{ web: { borderRadius: "32px" } }],
  "4xl": [{ web: { borderRadius: "50px" } }],
  "5xl": [{ web: { borderRadius: "100px" } }],
  full: [{ web: { borderRadius: "1000px" } }],
} as const;

//##############################################(THEME [BOX] SIZE)##############################################//

export const ThemeBoxSize = {
  none: [
    {
      web: {
        height: "0px",
        width: "0px",
      },
    },
  ],
  "12xs": [
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
  "4xl": [
    {
      web: {
        height: "72px",
        minWidth: "72px",
        minHeight: "72px",
        maxHeight: "72px",
        maxWidth: "100%",
      },
    },
  ],
  "5xl": [
    {
      web: {
        height: "80px",
        minWidth: "80px",
        minHeight: "80px",
        maxHeight: "80px",
        maxWidth: "100%",
      },
    },
  ],
  "6xl": [
    {
      web: {
        height: "88px",
        minWidth: "88px",
        minHeight: "88px",
        maxHeight: "88px",
        maxWidth: "100%",
      },
    },
  ],
  "7xl": [
    {
      web: {
        height: "96px",
        minWidth: "96px",
        minHeight: "96px",
        maxHeight: "96px",
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
// Make sure to hardcode values to remove reliance on kit.css styles
// This is most likely going to go into a new createTheme() api in the future
export const ThemeFormat = {
  inspatial: [
    {
      brand: [
        { web: { color: "var(--brand)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--brand-dark, var(--brand-200))",
            },
          },
        },
      ],
      brandBubble: [
        { web: { color: "var(--brand-bubble)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--brand-bubble-dark, var(--brand-bubble-200))",
            },
          },
        },
      ],
      brandOrb: [
        { web: { color: "var(--brand-orb)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--brand-orb-dark, var(--brand-orb-200))",
            },
          },
        },
      ],

      window: [
        { web: { color: "var(--window)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--window-dark, var(--window-200))",
            },
          },
        },
      ],
      surface: [
        { web: { color: "var(--surface)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--surface-dark, var(--surface-200))",
            },
          },
        },
      ],
      background: [
        { web: { color: "var(--background)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--background-dark, var(--background-200))",
            },
          },
        },
      ],
      muted: [
        { web: { color: "var(--muted)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--muted-dark, var(--muted-300))",
            },
          },
        },
      ],
      invert: [
        { web: { color: "var(--invert)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--invert-dark, var(--invert-100))",
            },
          },
        },
      ],

      primary: [
        { web: { color: "var(--primary)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--primary-dark, var(--primary-200))",
            },
          },
        },
      ],
      secondary: [
        { web: { color: "var(--secondary)" } },
        {
          web: {
            "@media (prefers-color-scheme: dark)": {
              color: "var(--secondary-dark, var(--secondary-200))",
            },
          },
        },
      ],
      // tertiary: same pattern if/when enabled
    },
  ],
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
  none: [""],
  base: [{ web: { shadow: "var(--shadow-base)" } }],
  effect: [{ web: { shadow: "var(--shadow-effect)" } }],
  hollow: [{ web: { shadow: "var(--shadow-hollow)" } }],
  brutal: [""],
  soft: [{ web: { shadow: "var(--shadow-soft)" } }],
  chasm: [{ web: { shadow: "var(--shadow-chasm)" } }],
  cool: [{ web: { shadow: "var(--shadow-cool)" } }],
  prime: [{ web: { shadow: "var(--shadow-prime)" } }],
  line: [{ web: { shadow: "var(--shadow-line)" } }],
  inn: [{ web: { shadow: "var(--shadow-inn)" } }],
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
  "12xs": [{ web: { padding: "2px" } }],
  "11xs": [{ web: { padding: "4px" } }],
  "10xs": [{ web: { padding: "6px" } }],
  "9xs": [{ web: { padding: "8px" } }],
  "8xs": [{ web: { padding: "10px" } }],
  "7xs": [{ web: { padding: "12px" } }],
  "6xs": [{ web: { padding: "14px" } }],
  "5xs": [{ web: { padding: "16px" } }],
  "4xs": [{ web: { padding: "20px" } }],
  "3xs": [{ web: { padding: "24px" } }],
  "2xs": [{ web: { padding: "28px" } }],
  xs: [{ web: { padding: "32px" } }],
  sm: [{ web: { padding: "36px" } }],
  md: [{ web: { padding: "40px" } }],
  fit: [{ web: { paddingLeft: "1rem", paddingRight: "1rem" } }],
  base: [{ web: { padding: "12px 20px" } }],
  auto: [{ web: { padding: "12px 20px" } }],
  lg: [{ web: { padding: "48px" } }],
  xl: [{ web: { padding: "52px" } }],
  "2xl": [{ web: { padding: "56px" } }],
  "3xl": [{ web: { padding: "64px" } }],
} as const;

//##############################################(THEME AXIS)##############################################//

export const ThemeAxis = {
  x: [{ web: { display: "flex", flexDirection: "row" } }],
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
    {
      web: {
        opacity: 0.5,
        color: "var(--muted)",
        pointerEvents: "none",
        cursor: ThemeCursor.disabled,
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
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: ThemeCursor.disabled,
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
    format: "inspatial",
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
  // This File will also replace all kit.css styles making it InSpatial Theme a full replacement for css
  // Users will still be able to use css if they want but not required to create base style variables.
  // composition: {},
});
