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
        // You can't close the presentation on backdrop tap. And all the elementts outside the presentation are interactable.
        none: [
          "hidden",
          {
            web: {
              display: "none",
            },
          },
        ],
        // InSpatial's signature tilted backdrop.
        tilted: [
          "material-tilted",
          {
            web: {
              background: "var(--surface)",
              backdropFilter: "blur(var(--blur-base))",
            },
          },
        ],
        // A standard RGB backdrop.
        rgb: [
          "bg-black/40",
          {
            web: {
              background: "rgba(0, 0, 0, 0.4)",
            },
          },
        ],
        // It's like none but you close the presentation on backdrop tap.
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
