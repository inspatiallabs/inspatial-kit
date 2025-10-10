import { createStyle } from "@in/style";
import { PresentationStyle } from "../style.ts";
import { ThemeMaterial, ThemeRadius } from "@in/widget/theme/style.ts";

/*##################################(POPOVER STYLE)##################################*/
export const PopoverStyle = {
  /*******************************(Overlay)********************************/

  overlay: PresentationStyle.overlay,

  /**********************(Wrapper)*****************************/
  wrapper: createStyle({
    base: [
      {
        web: {
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "unset",
          justifyContent: "unset",
          pointerEvents: "none",
          zIndex: 2147483647,
        },
      },
    ],
  }),

  /**********************(View)*****************************/
  view: createStyle({
    base: [
      {
        web: {
          pointerEvents: "auto",
          position: "fixed",
          top: 0,
          left: 0,
        },
      },
    ],
    settings: {
      // offset is the distance between the popover and the anchor
      // They are handled by the style composition since it is dynamic and depends on the direction
      offset: {
        none: [""],
        "2xs": [""],
        xs: [""],
        sm: [""],
        md: [""],
        lg: [""],
      },
      material: ThemeMaterial,
      radius: ThemeRadius,
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
              width: "350px",
              height: "420px",
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
      },
    },
    defaultSettings: {
      offset: "lg",
      material: "tilted",
      direction: "left",
      size: "base",
      radius: "base",
    },
    composition: [
      // bottom margins
      {
        direction: "bottom",
        offset: "2xs",
        style: { web: { marginTop: "2px" } },
      },
      {
        direction: "bottom",
        offset: "xs",
        style: { web: { marginTop: "4px" } },
      },
      {
        direction: "bottom",
        offset: "sm",
        style: { web: { marginTop: "8px" } },
      },
      {
        direction: "bottom",
        offset: "md",
        style: { web: { marginTop: "12px" } },
      },
      {
        direction: "bottom",
        offset: "lg",
        style: { web: { marginTop: "76px" } },
      },
      // top margins (negative)
      {
        direction: "top",
        offset: "2xs",
        style: { web: { marginTop: "-2px" } },
      },
      { direction: "top", offset: "xs", style: { web: { marginTop: "-4px" } } },
      { direction: "top", offset: "sm", style: { web: { marginTop: "-8px" } } },
      {
        direction: "top",
        offset: "md",
        style: { web: { marginTop: "-12px" } },
      },
      {
        direction: "top",
        offset: "lg",
        style: { web: { marginTop: "-76px" } },
      },
      // right margins
      {
        direction: "right",
        offset: "2xs",
        style: { web: { marginLeft: "2px" } },
      },
      {
        direction: "right",
        offset: "xs",
        style: { web: { marginLeft: "50px" } },
      },
      {
        direction: "right",
        offset: "sm",
        style: { web: { marginLeft: "8px" } },
      },
      {
        direction: "right",
        offset: "md",
        style: { web: { marginLeft: "12px" } },
      },
      {
        direction: "right",
        offset: "lg",
        style: { web: { marginLeft: "76px" } },
      },
      // left margins (negative)
      {
        direction: "left",
        offset: "2xs",
        style: { web: { marginLeft: "-2px" } },
      },
      {
        direction: "left",
        offset: "xs",
        style: { web: { marginLeft: "-4px" } },
      },
      {
        direction: "left",
        offset: "sm",
        style: { web: { marginLeft: "-8px" } },
      },
      {
        direction: "left",
        offset: "md",
        style: { web: { marginLeft: "-12px" } },
      },
      {
        direction: "left",
        offset: "lg",
        style: { web: { marginLeft: "-76px" } },
      },
    ],
  }),
};
