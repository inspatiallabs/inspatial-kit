import { createStyle } from "@in/style";
import {
  ThemeDisabled,
  ThemeEffect,
  ThemeRadius,
  ThemeScreenSize,
} from "@in/widget/theme/style.ts";

/*#########################(SIMULATOR STYLE)#############################*/
export const SimulatorStyle = {
  /*======================(Wrapper)=========================*/
  wrapper: createStyle({
    name: "simulator-wrapper",
    base: [
      {
        web: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    ],
    settings: {
      disabled: ThemeDisabled,
      size: ThemeScreenSize,
    },
    defaultSettings: {
      disabled: false,
      size: "lg",
    },
  }),

  /*======================(Frame)=========================*/
  frame: {
    /*******************(Inner)*************************/
    inner: createStyle({
      name: "simulator-inner-frame",
      base: [
        {
          web: {
            border: "8px solid var(--surface)",
            overflow: "hidden",
          },
        },
      ],
      settings: {
        radius: ThemeRadius,
        effect: ThemeEffect,
      },

      composition: [
       
        // inner frame width & height conforms to wrapper size
        {
          "$simulator-wrapper.size": "xs",
          style: {
            web: {
              width: "96%",
              height: "98%",
            },
          },
        },
        {
          "$simulator-wrapper.size": "sm",
          style: {
            web: {
              width: "98%",
              height: "98%",
            },
          },
        },
        {
          "$simulator-wrapper.size": "md",
          style: {
            web: {
              width: "98.2%",
              minWidth: "98.2%",
              height: "98%",
              minHeight: "98%",
            },
          },
        },
        {
          "$simulator-wrapper.size": "lg",
          style: {
            web: {
              width: "98.6%",
              height: "98%",
            },
          },
        },
        {
          "$simulator-wrapper.size": "xl",
          style: {
            web: {
              width: "99%",
              height: "98.6%",
            },
          },
        },
        {
          "$simulator-wrapper.size": "fill",
          style: {
            web: {
              width: "99%",
              height: "98.6%",
            },
          },
        },
      ],
      defaultSettings: {
        radius: "2xl",
        effect: "effect",
      },
    }),
    /*******************(Outer)************************/
    outer: createStyle({
      name: "simulator-outer-frame",
      base: [
        {
          web: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "10px solid var(--surface)",
          },
        },
      ],
      composition: [
        // outer frame conforms to inner frame radius
        {
          "$simulator-inner-frame.radius": "none",
          style: {
            web: {
              borderRadius: "var(--radius-none)",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "xs",
          style: {
            web: {
              borderRadius: "6px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "sm",
          style: {
            web: {
              borderRadius: "18px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "md",
          style: {
            web: {
              borderRadius: "20px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "base",
          style: {
            web: {
              borderRadius: "26px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "lg",
          style: {
            web: {
              borderRadius: "var(--radius-3xl)",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "xl",
          style: {
            web: {
              borderRadius: "32px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "2xl",
          style: {
            web: {
              borderRadius: "40px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "3xl",
          style: {
            web: {
              borderRadius: "48px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "4xl",
          style: {
            web: {
              borderRadius: "64px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "5xl",
          style: {
            web: {
              borderRadius: "112px",
            },
          },
        },
        {
          "$simulator-inner-frame.radius": "full",
          style: {
            web: {
              borderRadius: "var(--radius-full)",
            },
          },
        },
      ],
    }),
  },

  /*======================(Status Bar)=========================*/
  statusBar: createStyle({
    name: "simulator-status-bar",
  }),

  /*======================(Browser Bar)=========================*/
  browserBar: createStyle({
    name: "simulator-browser-bar",
  }),

  /*======================(Home Indicator)=========================*/
  homeIndicator: createStyle({
    name: "simulator-home-indicator",
  }),
};
