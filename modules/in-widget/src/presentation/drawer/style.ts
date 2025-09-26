import { createStyle } from "@in/style";
import { PresentationStyle } from "../style.ts";

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
