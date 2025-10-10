import { createStyle } from "@in/style";
import { ThemeMaterial, ThemeRadius } from "@in/widget/theme/style.ts";
import { PresentationStyle } from "../style.ts";

//##############################################(MODAL STYLE)##############################################//

export const ModalStyle = {
  /*******************************(Overlay)********************************/

  overlay: PresentationStyle.overlay,

  /*******************************(Wrapper)********************************/
  wrapper: createStyle({
    base: [
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
      {
        web: {
          pointerEvents: "auto",
          background: "var(--window)",
          border: "1px solid var(--muted)",
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
          {
            web: {
              width: "auto",
              height: "auto",
            },
          },
        ],
        base: [
          {
            web: {
              width: "50%",
              height: "80vh",
            },
          },
        ],
        fit: [
          {
            web: {
              minHeight: "fit-content",
              minWidth: "fit-content",
            },
          },
        ],
        full: [
          {
            web: {
              minHeight: "100%",
              minWidth: "100%",
            },
          },
        ],
      },

      material: ThemeMaterial,
      radius: ThemeRadius,
    },
    defaultSettings: {
      direction: "bottom",
      size: "base",
      radius: "base",
      material: "tilted",
    },
  }),
};
