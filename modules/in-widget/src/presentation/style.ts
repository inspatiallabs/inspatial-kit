import { createStyle } from "@in/style";

//##############################################(PRESENTATION STYLE)##############################################//
export const PresentationStyle = {
  /*******************************(Base)********************************/
  base: createStyle({
    base: [
      "pointer-events-auto",
      {
        web: {
          pointerEvents: "auto",
        },
      },
    ],
  }),
  /*******************************(Overlay)********************************/
  overlay: createStyle({
    base: [
      "fixed",
      "inset-0",
      "min-h-full",
      "min-w-full",
      "pointer-events-auto",
      "z-[2147483646]",
      "inmotion-fade-in",
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
      backdrop: {
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
      backdrop: "tilted",
    },
  }),
};
