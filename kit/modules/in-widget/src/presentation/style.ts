import { createStyle } from "@in/style";
import { ThemeRadius } from "@in/widget/theme/style.ts";

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
          boxShadow: "var(--shadow-effect)",
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
        auto: [
          "h-auto",
          "w-auto",
          {
            web: {
              width: "auto",
              height: "auto",
            },
          },
        ],
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
      "material-tilted",
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
      size: {
        auto: [
          "!h-auto",
          "!w-auto",
          {
            web: {
              width: "auto !important",
              height: "auto !important",
            },
          },
        ],
        fit: [
          "min-h-fit !important",
          "min-w-fit !important",
          {
            web: {
              minHeight: "fit-content !important",
              minWidth: "fit-content !important",
            },
          },
        ],
        full: [
          "min-h-full !important",
          "min-w-full !important",
          {
            web: {
              minHeight: "100% !important",
              minWidth: "100% !important",
            },
          },
        ],
      },
      direction: {
        right: [
          "fixed top-0 right-0 h-full min-w-[40%]",
          "inmotion-position-right",
          "inmotion-slide-from-right",
          {
            web: {
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              minWidth: "40%",
            },
          },
        ],
        left: [
          "fixed top-0 left-0 h-full min-w-[40%]",
          "inmotion-position-left",
          "inmotion-slide-from-left",
          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              minWidth: "40%",
            },
          },
        ],
        top: [
          "fixed",
          "top-0",
          "left-0",
          "right-0",
          "h-[40%]",
          "min-w-[100%]",
          "inmotion-position-top",
          "inmotion-slide-from-top",
          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              minWidth: "100%",
            },
          },
        ],
        bottom: [
          "fixed bottom-0 left-0 right-0 min-h-[40%]",
          "inmotion-position-bottom",
          "inmotion-slide-from-bottom",
          {
            web: {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: "40%",
            },
          },
        ],
      },
    },
    defaultSettings: {
      direction: "right",
      size: "auto",
    },
    // Apply specific radius based on direction
    composition: [
      // Right drawer - round left corners
      {
        direction: "right",
        style: {
          web: {
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          },
        },
      },
      // Left drawer - round right corners
      {
        direction: "left",
        style: {
          web: {
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          },
        },
      },
      // Top drawer - round bottom corners
      {
        direction: "top",
        style: {
          web: {
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          },
        },
      },
      // Bottom drawer - round top corners
      {
        direction: "bottom",
        style: {
          web: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
          },
        },
      },
    ],
  }),
};
