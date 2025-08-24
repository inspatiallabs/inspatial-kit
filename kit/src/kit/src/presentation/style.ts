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
      "[data-state=open]:animate-[inmotion-drawer-fade-in_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
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
      "transition-transform duration-500",
      {
        web: {
          pointerEvents: "auto",
          background: "var(--window)",
          border: "1px solid var(--muted)",
          touchAction: "none",
          willChange: "transform",
          transition: "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
        },
      },
    ],
    settings: {
      direction: {
        right: [
          "fixed top-0 right-0 h-full min-w-[320px]",
          "[data-in-presentation-drawer-snap-points=false][data-state=open]:animate-[inmotion-drawer-slide-from-right_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
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
          "animate-inmotion-drawer-slide-from-left",
          "[data-in-presentation-drawer-snap-points=false][data-state=open]:animate-[inmotion-drawer-slide-from-left_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
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
          "[data-in-presentation-drawer-snap-points=false][data-state=open]:animate-[inmotion-drawer-slide-from-top_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
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
          "[data-in-presentation-drawer-snap-points=false][data-state=open]:animate-[inmotion-drawer-slide-from-bottom_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
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
