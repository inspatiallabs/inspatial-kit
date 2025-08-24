import { createStyle } from "@in/style";
import { ThemeRadius } from "../theme/style.ts";

//##############################################(PRESENTATION STYLE)##############################################//
export const PresentationStyle = createStyle({
  base: [
    "pointer-events-auto",
    {
      web: {
        pointerEvents: "auto",
      },
    },
  ],
});

//##############################################(MODAL STYLE)##############################################//

export const ModalStyle = {
  /*******************************(Overlay)********************************/
  overlay: createStyle({
    base: [
      "fixed inset-0 pointer-events-auto",
      {
        web: {
          position: "fixed",
          inset: 0,
          minHeight: "100vh",
          minWidth: "100vw",
          pointerEvents: "auto",
          zIndex: 2147483646,
        },
      },
    ],
    settings: {
      overlayFormat: {
        none: [
          "hidden",
          {
            web: {
              display: "none",
            },
          },
        ],
        tilted: [
          "material-tilted",
          {
            web: {
              background: "var(--surface)",
              backdropFilter: "blur(var(--blur-base))",
            },
          },
        ],
        rgb: [
          "bg-black/40",
          {
            web: {
              background: "rgba(0, 0, 0, 0.4)",
            },
          },
        ],
        transparent: [
          "bg-transparent",
          {
            web: {
              background: "transparent",
            },
          },
        ],
      },
    },
    defaultSettings: {
      overlayFormat: "tilted",
    },
  }),
  /*******************************(Wrapper)********************************/
  wrapper: createStyle({
    base: [
      "fixed",
      "inset-0",
      "flex",
      "items-center",
      "justify-center",
      "pointer-events-none",
      "z-[2147483647]",
      {
        web: {
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 2147483647,
        },
      },
    ],
  }),
  /*******************************(View)********************************/
  view: createStyle({
    base: [
      "pointer-events-auto",
      "bg-(--window)",
      "material-tilted",
      "border border-(--muted)",
      "shadow-effect",
      {
        web: {
          pointerEvents: "auto",
          background: "var(--window)",
          border: "1px solid var(--muted)",
          boxShadow: "shadow(var(--shadow-effect))",
          backdropFilter: "blur(var(--blur-base))",
        },
      },
    ],
    settings: {
      size: {
        base: [
          "w-[50%]",
          "h-[80vh]",
          {
            web: {
              width: "50%",
              height: "80vh",
            },
          },
        ],
        fit: [
          "min-h-fit",
          "min-w-fit",
          {
            web: {
              minHeight: "fit-content",
              minWidth: "fit-content",
            },
          },
        ],
        full: [
          "min-h-full",
          "min-w-full",
          {
            web: {
              minHeight: "100%",
              minWidth: "100%",
            },
          },
        ],
        // xs: [],
        // sm: [],
        // md: [],
        // lg: [],
        // xl: [],
      },
      radius: ThemeRadius,
    },
    defaultSettings: {
      size: "base",
      radius: "4xl",
    },
  }),
};
