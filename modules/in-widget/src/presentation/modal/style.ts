import { createStyle } from "@in/style";
import { ThemeRadius } from "@in/widget/theme/style.ts";
import { PresentationStyle } from "../style.ts";

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
