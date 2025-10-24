import { createStyle } from "@in/style";
import {
  ThemeMaterial,
  ThemeRadius,
  ThemeDisabled,
  ThemeEffect,
} from "@in/widget/theme/style.ts";

//##############################################(SLIDER STYLE)##############################################//

/**
 * Slider Style Composition
 *
 * Anatomy:
 * - wrapper: Container for the entire slider
 * - input: Hidden native range input
 * - track: The line/bar that the handle moves along
 * - handle: The draggable thumb/knob
 * - range: Visual indicator of selected range
 * - value: Optional display of current value
 * - markers: Optional tick marks along the track
 *
 * Formats:
 * - base: Full-featured slider with visible track, markers, and labels
 * - bare: Minimal slider with just track and handle
 */
export const SliderStyle = {
  /*========================================(WRAPPER)========================================*/
  wrapper: createStyle({
    name: "slider-wrapper",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
        },
      },
    ],
    settings: {
      format: {
        base: [
          {
            web: {
              gap: "8px",
            },
          },
        ],
        bare: [
          {
            web: {
              gap: "0px",
            },
          },
        ],
      },
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      format: "bare",
      disabled: "false",
    },
  }),

  /*========================================(INPUT)========================================*/
  input: createStyle({
    name: "slider-input",
    base: [
      {
        web: {
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: "0",
          cursor: "pointer",
          zIndex: "10",
          margin: "0",
          padding: "0",

          // Remove default styling
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",

          "&::-webkit-slider-thumb": {
            appearance: "none",
            WebkitAppearance: "none",
            width: "20px",
            height: "20px",
            cursor: "pointer",
          },

          "&::-moz-range-thumb": {
            width: "20px",
            height: "20px",
            cursor: "pointer",
            border: "none",
            background: "transparent",
          },

          "&:disabled": {
            cursor: "not-allowed",
          },
        },
      },
    ],
    settings: {
      size: {
        sm: [
          {
            web: {
              "&::-webkit-slider-thumb": {
                width: "16px",
                height: "16px",
              },
              "&::-moz-range-thumb": {
                width: "16px",
                height: "16px",
              },
            },
          },
        ],
        md: [
          {
            web: {
              "&::-webkit-slider-thumb": {
                width: "20px",
                height: "20px",
              },
              "&::-moz-range-thumb": {
                width: "20px",
                height: "20px",
              },
            },
          },
        ],
        lg: [
          {
            web: {
              "&::-webkit-slider-thumb": {
                width: "24px",
                height: "24px",
              },
              "&::-moz-range-thumb": {
                width: "24px",
                height: "24px",
              },
            },
          },
        ],
      },
    },
    defaultSettings: {
      size: "md",
    },
  }),

  /*========================================(TRACK)========================================*/
  track: {
    /*******************************(TRACK_CONTAINER)******************************/
    container: createStyle({
      name: "slider-track-container",
      base: [
        {
          web: {
            display: "flex",
            width: "100%",
            height: "auto",
            alignItems: "center",
            gap: "8px",
          },
        },
      ],
      settings: {
        format: {
          base: [
            {
              web: {
                gap: "0",
              },
            },
          ],
          bare: [
            {
              web: {
                gap: "4px",
              },
            },
          ],
        },
      },
      defaultSettings: {
        format: "base",
      },
    }),
    /*******************************(TRACK_BACKGROUND)******************************/
    background: createStyle({
      name: "slider-track",
      base: [
        {
          web: {
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            backgroundColor: "var(--muted)",
            overflow: "visible",
            // When the overlaid input is hovered, tint the first child (range)
            "&:has(> input:hover) > *:first-child": {
              background:
                "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
              backgroundBlendMode: "color-dodge, normal, normal",
              scaleX: "10",
            },
            // When hovering the input, also emphasize the handle (second child)
            "&:has(> input:hover) > *:nth-child(2)": {
              display: "block",
              // transform: "translate(-50%, -50%) scale(1)",
              border: "2px solid var(--brand)",
            },
          },
        },
      ],
      settings: {
        format: {
          base: [
            {
              web: {
                border: "none",
              },
            },
          ],
          bare: [
            {
              web: {
                border: "none",
              },
            },
          ],
        },
        size: {
          xs: [
            {
              web: {
                height: "4px",
              },
            },
          ],
          sm: [
            {
              web: {
                height: "12px",
              },
            },
          ],
          md: [
            {
              web: {
                height: "16px",
              },
            },
          ],
          lg: [
            {
              web: {
                height: "20px",
              },
            },
          ],
          xl: [
            {
              web: {
                height: "28px",
              },
            },
          ],
          "2xl": [
            {
              web: {
                height: "40px",
              },
            },
          ],
        },
        effect: ThemeEffect,
        radius: ThemeRadius,
      },
      defaultSettings: {
        effect: "hollow",
        format: "base",
        size: "md",
        radius: "full",
      },
      composition: [
        {
          format: "bare",
          size: "sm",
          style: {
            web: {
              height: "6px",
            },
          },
        },
      ],
    }),
  },

  /*******************************(RANGE)******************************/
  range: createStyle({
    name: "slider-range",
    base: [
      {
        web: {
          position: "absolute",
          left: "0",
          top: "0",
          height: "100%",
          backgroundColor: "var(--brand)",
          pointerEvents: "none",
          transitionProperty: "width",
          transitionDuration: "150ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    ],
    settings: {
      radius: ThemeRadius,
    },
    defaultSettings: {
      radius: "full",
    },
    composition: [
      {
        "$slider-track.radius": ThemeRadius,
      },
    ],
  }),

  /*========================================(HANDLE)========================================*/
  handle: createStyle({
    name: "slider-handle",
    base: [
      {
        web: {
          display: "none",
          cursor: "grab",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--color-white)",
          // border: "2px solid var(--brand)",
          pointerEvents: "none",
          transitionProperty: "left, transform",
          transitionDuration: "150ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: "5",

          "&:hover": {
            display: "block",
          },
        },
      },
    ],
    settings: {
      material: ThemeMaterial,
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      material: "flat",
      radius: "full",
      disabled: "false",
    },
    composition: [
      {
        "$slider-track.size": "xs",
        style: {
          web: {
            width: "8px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.size": "sm",
        style: {
          web: {
            width: "12px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.size": "md",
        style: {
          web: {
            width: "20px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.size": "lg",
        style: {
          web: {
            width: "24px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.size": "xl",
        style: {
          web: {
            width: "32px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.size": "2xl",
        style: {
          web: {
            width: "36px",
            padding: "2px",
            marginLeft: "-4px",
          },
        },
      },
      {
        "$slider-track.radius": ThemeRadius,
      },
      // {
      //   "$slider-track.size": "md",
      //   style: {
      //     web: {
      //       borderTopLeftRadius: "0px",
      //       borderBottomLeftRadius: "0px",
      //     },
      //   },
      // },
    ],
  }),

  /*========================================(VALUE)========================================*/
  value: createStyle({
    name: "slider-value",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8px",
          height: "20px",
          width: "45px",
          fontSize: "14px",
          fontFamily: "var(--font-heading)",
          backgroundColor: "var(--muted)",
          borderRadius: "var(--radius-sm)",

          "& input": {
            width: "100%",
            height: "100%",
            padding: "0 8px",
            fontSize: "14px",
            textAlign: "left",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "inherit",
            fontFamily: "inherit",

            "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: "0",
            },

            "&[type=number]": {
              MozAppearance: "textfield",
            },
          },
        },
      },
    ],
    settings: {
      format: {
        base: [
          {
            web: {
              marginTop: "8px",
            },
          },
        ],
        bare: [
          {
            web: {
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "bare",
    },
  }),

  /*========================================(MARKER)========================================*/
  marker: {
    /* container for markers */
    container: createStyle({
      name: "slider-markers",
      base: [
        {
          web: {
            position: "relative",
            display: "block",
            width: "100%",
            height: "auto",
            marginTop: "4px",
            fontSize: "12px",
            fontFamily: "var(--font-heading)",
          },
        },
      ],
    }),
    /* individual marker knob */
    knob: createStyle({
      name: "slider-marker",
      base: [
        {
          web: {
            position: "absolute",
            top: "0",
            transform: "translateX(-50%)",
            color: "var(--muted)",
            cursor: "pointer",
            userSelect: "none",
          },
        },
      ],
      settings: {
        format: {
          dot: [
            {
              web: {
                width: "6px",
                height: "6px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--secondary)",
              },
            },
          ],
          label: [
            {
              web: {
                fontSize: "var(--text-xs)",
                color: "var(--secondary)",
              },
            },
          ],
        },
      },
      defaultSettings: {
        format: "dot",
      },
    }),
  },

  /*========================================(EDGE_LABEL)========================================*/
  edgeLabel: createStyle({
    name: "slider-edge-label",
    base: [
      {
        web: {
          fontSize: "14px",
          color: "var(--surface)",
          flexShrink: "0",
        },
      },
    ],
  }),
};
