import { createStyle } from "@in/style/variant/index.ts";
import { ThemeDisabled } from "@in/widget/theme/index.ts";

//##############################################(CREATE STYLE)##############################################//

// For type-safe cross-references, you can extract types using StyleProps:
// type TrackProps = StyleProps<typeof SwitchStyle.track.getStyle>;
// type HandleProps = StyleProps<typeof SwitchStyle.handle.getStyle>;
// Then use with crossRef<TrackProps>("switch-track", "size", "lg", {...})

export const SwitchStyle = {
  /*******************************(WRAPPER)******************************/
  wrapper: createStyle({
    name: "switch-wrapper",
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
    name: "switch-input",
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
    name: "switch-track",
    base: [
      // "shadow-hollow",
      {
        web: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
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
      size: {
        sm: [
          {
            web: {
              height: "20px",
              width: "36px",
            },
          },
        ],
        md: [
          {
            web: {
              height: "40px",
              width: "72px",
            },
          },
        ],
        lg: [
          {
            web: {
              height: "48px",
              width: "90px",
            },
          },
        ],
      },
      radius: {
        rounded: [
          {
            web: {
              borderRadius: "var(--radius-full)",
            },
          },
        ],
        squared: [
          {
            web: {
              borderRadius: "var(--radius-md)",
            },
          },
        ],
      },
    },
    defaultSettings: {
      size: "sm",
      radius: "rounded",
    },

    composition: [
      {
        size: "sm",
        radius: "squared",
        style: {
          web: {
            borderRadius: "var(--radius-xs)",
          },
        },
      },
    ],
  }),

  /*******************************(HANDLE)******************************/
  handle: createStyle({
    name: "switch-handle",
    base: [
      {
        web: {
          pointerEvents: "none",
          position: "absolute",
          left: "2px",
          top: "50%",

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
    },

    defaultSettings: {
      format: "base",
    },
    composition: [
      // Base handle size (default for all track sizes)
      {
        style: {
          web: {
            width: "50%",
            height: "90%",
          },
        },
      },
      {
        "$switch-track.size": "lg",
        style: {
          web: {
            left: "2px",

            // Checked state - move handle to right
            ".peer:checked ~ * &": {
              transform: "translateY(-50%) translateX(90%)",
            },
          },
        },
      },
      {
        "$switch-track.size": "md",
        style: {
          web: {
            left: "2px",

            // Checked state - move handle to right
            ".peer:checked ~ * &": {
              transform: "translateY(-50%) translateX(88%)",
            },
          },
        },
      },
      {
        "$switch-track.size": "sm",
        style: {
          web: {
            width: "16px",
            height: "16px",
            

            // Checked state - move handle to right
            ".peer:checked ~ * &": {
              transform: "translateY(-50%) translateX(100%)",
            },
          },
        },
      },
      {
        "$switch-track.radius": "rounded",
        style: {
          web: {
            borderRadius: "var(--radius-full)",
          },
        },
      },
      {
        "$switch-track.radius": "squared",
        style: {
          web: {
            borderRadius: "var(--radius-md)",
          },
        },
      },
      // Example: Multiple cross-references - when track is small AND squared
      {
        "$switch-track.size": "sm",
        "$switch-track.radius": "squared",
        style: {
          web: {
            borderRadius: "2px", // Override with specific value for this combination
          },
        },
      },
    ],
  }),

  /*******************************(ICON)******************************/
  icon: createStyle({
    name: "switch-icon",
    base: [
      {
        web: {
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--secondary)",
          size: "20px",

          ".peer:checked ~ * &": {
            color: "var(--brand)",
          },
        },
      },
    ],
  }),
};
