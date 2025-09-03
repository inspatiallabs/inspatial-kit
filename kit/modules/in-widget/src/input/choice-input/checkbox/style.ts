import { createStyle } from "@in/style/variant/index.ts";
import {
  ThemeBoxSize,
  ThemeRadius,
  ThemeDisabled,
} from "@in/widget/theme/index.ts";

//##############################################(CREATE STYLE)##############################################//

export const CheckboxStyle = {
  /*******************************(WRAPPER)******************************/
  wrapper: createStyle({
    base: [
      {
        web: {
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          accentColor: "var(--brand)",
        },
      },
    ],
    settings: {
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      disabled: false,
    },
  }),

  /*******************************(INPUT)******************************/
  input: createStyle({
    base: [
      "sr-only",
      "peer",
      {
        web: {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        },
      },
    ],
  }),

  /*******************************(INDICATOR)******************************/
  indicator: createStyle({
    base: [
      {
        web: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transitionProperty: "all",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          color: "transparent",

          // Fallback for brand color using adjacent sibling selector
          ".peer:checked ~ &": {
            backgroundColor: "var(--brand)",
            color: "white",
          },
          ".peer:indeterminate ~ &": {
            backgroundColor: "var(--brand)",
            color: "white",
          },

          ".peer:checked ~ &:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
            backgroundBlendMode: "color-dodge, normal, normal",
          },
        },
      },
    ],
    settings: {
      format: {
        outline: [
          {
            web: {
              border: "3px solid var(--background)",
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-subtle)",

              "&:hover": {
                background:
                  "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
                backgroundBlendMode: "color-dodge, normal, normal",
                border: "0px",
                opacity: "0.6",
              },

              ".peer:checked ~ &": {
                border: "1.5px solid var(--brand)",
                backgroundColor: "var(--brand)",
                boxShadow:
                  "0 0 0 2px var(--background, #ffffff), 0 0 0 4px var(--brand, #9100ff)",
              },
              ".peer:checked ~ &:hover": {
                border: "1.5px solid var(--background)",
              },
              ".peer:indeterminate ~ &": {
                border: "1.5px solid var(--brand)",
                backgroundColor: "var(--brand)",
                boxShadow:
                  "0 0 0 2px var(--background, #ffffff), 0 0 0 4px var(--brand, #9100ff)",
              },
              ".peer:indeterminate ~ &:hover": {
                border: "1.5px solid var(--background)",
              },
            },
          },
        ],
        flat: [
          {
            web: {
              border: "none",
              backgroundColor: "var(--background)",
              "&:hover": {
                background:
                  "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
                backgroundBlendMode: "color-dodge, normal, normal",
                border: "0px",
                opacity: "0.6",
              },
              ".peer:checked ~ &": {
                backgroundColor: "var(--brand)",
                border: "3px solid var(--brand)",
                color: "white",
              },
            },
          },
        ],
      },
      size: ThemeBoxSize,
      radius: ThemeRadius,
    },
    defaultSettings: {
      format: "outline",
      size: "4xs",
      radius: "sm",
    },
  }),
};
