import { createStyle } from "@in/style";
import { ThemeRadius } from "../theme/style.ts";

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
      "fixed inset-0 pointer-events-auto",
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
};

//##############################################(MODAL STYLE)##############################################//

export const ModalStyle = {
  /*******************************(Overlay)********************************/

  overlay: PresentationStyle.overlay,

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
      direction: {
        right: ["inmotion-position-right", "inmotion-slide-from-right"],
        left: ["inmotion-position-left", "inmotion-slide-from-left"],
        top: ["inmotion-position-top", "inmotion-slide-from-top"],
        bottom: ["inmotion-position-bottom", "inmotion-slide-from-bottom"],
      },
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
      direction: "bottom",
      size: "base",
      radius: "4xl",
    },
  }),
};

//##############################################(DRAWER STYLE)##############################################//

export const DrawerStyle = {
  /*******************************(Overlay)********************************/

  overlay: PresentationStyle.overlay,

  /*******************************(Wrapper)********************************/

  wrapper: createStyle({
    base: [
      "fixed inset-0 pointer-events-none z-[2147483647]",
      {
        web: {
          position: "fixed",
          inset: 0,
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
      "border border-(--muted)",
      "touch-none",
      "will-change-transform",
      {
        web: {
          pointerEvents: "auto",
          background: "var(--window)",
          border: "1px solid var(--muted)",
          touchAction: "none",
          willChange: "transform",
        },
      },
    ],
    settings: {
      direction: {
        right: [
          "fixed top-0 right-0 h-full min-w-[320px]",
          "inmotion-position-right",
          "inmotion-slide-from-right",
          {
            web: {
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              minWidth: "320px",
            },
          },
        ],
        left: [
          "fixed top-0 left-0 h-full min-w-[320px]",
          "inmotion-position-left",
          "inmotion-slide-from-left",
          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              minWidth: "320px",
            },
          },
        ],
        top: [
          "fixed top-0 left-0 right-0 min-h-[320px]",
          "inmotion-position-top",
          "inmotion-slide-from-top",
          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              minHeight: "320px",
            },
          },
        ],
        bottom: [
          "fixed bottom-0 left-0 right-0 min-h-[320px]",
          "inmotion-position-bottom",
          "inmotion-slide-from-bottom",
          {
            web: {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: "320px",
            },
          },
        ],
      },
    },
    defaultSettings: {
      direction: "right",
    },
  }),
};
