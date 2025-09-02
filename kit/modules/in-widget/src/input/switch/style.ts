import { createStyle } from "@in/style/variant/index.ts";
import {
  ThemeBoxSize,
  ThemeRadius,
  ThemeDisabled,
} from "@in/widget/theme/index.ts";

//##############################################(CREATE STYLE)##############################################//

export const SwitchStyle = {
  /*******************************(WRAPPER)******************************/
  wrapper: createStyle({
    base: [
      {
        web: {
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
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

  /*******************************(TRACK)******************************/
  track: createStyle({
    base: [
      // "shadow-hollow",
      {
        web: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          height: "20px",
          width: "36px",
          backgroundColor: "var(--background)",
          transitionProperty: "all",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",

          // Hover state
          "&:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
            backgroundBlendMode: "color-dodge, normal, normal",
            border: "0px",
            opacity: "0.6",
          },

          // Checked state using peer selector
          ".peer:checked ~ &": {
            backgroundColor: "var(--brand)",
          },

          // Hover state when checked
          ".peer:checked ~ &:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
            backgroundBlendMode: "color-dodge, normal, normal",
          },

          // Focus state
          ".peer:focus-visible ~ &": {
            outline: "2px solid var(--brand)",
            outlineOffset: "2px",
          },

          // Disabled state
          ".peer:disabled ~ &": {
            cursor: "not-allowed",
            opacity: "0.5",
          },
        },
      },
    ],
    settings: {
      //   size: ThemeBoxSize,
      radius: ThemeRadius,
    },
    defaultSettings: {
      //   size: "md",
      radius: "full",
    },
  }),

  /*******************************(HANDLE)******************************/
  handle: createStyle({
    base: [
      {
        web: {
          pointerEvents: "none",
          position: "absolute",
          left: "2px",
          top: "50%",

          // Checked state - move handle to right
          ".peer:checked ~ * &": {
            transform: "translateY(-50%) translateX(16px)",
          },

          // Disabled state
          ".peer:disabled ~ * &": {
            opacity: "0.8",
          },
        },
      },
    ],
    settings: {
      format: {
        base: [
          "material-tilted",
          {
            web: {
              backgroundColor: "var(--surface)",

              ".peer:checked ~ * &": {
                backgroundColor: "white",
              },

              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-50%)",
              transitionProperty: "transform",
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
        ],
      },
      radius: ThemeRadius,
      size: {
        base: [
          {
            web: {
              width: "16px",
              height: "16px",
            },
          },
        ],
        longhand: [
          {
            web: {
              width: "58%",
              height: "16px",

              ".peer:checked ~ * &": {
                width: "58%",
                minHeight: "100%",
              },
            },
          },
        ],
      },
    },

    defaultSettings: {
      format: "base",
      radius: "full",
      size: "base",
    },
    // composition: [
    //   {
    //     format: "base",
    //     style: {
    //       web: {},
    //     },
    //   },
    // ],
  }),
};
