import { createStyle } from "@in/style";
import { ThemeDisabled, ThemeRadius } from "@in/widget/theme/style.ts";

//##############################################( CREATE STYLE)##############################################//

export const TabStyle = {
  /*******************************(Wrapper)********************************/
  // Wrapper is the container and background for all tabs
  wrapper: createStyle({
    name: "tab-wrapper",
    base: [
      {
        web: {
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          overflow: "hidden",
        },
      },
    ],
    settings: {
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      radius: "full",
      disabled: false,
    },
    composition: [
      {
        "$tab-trigger.format": "segmented",
        style: {
          web: {
            backgroundColor: "var(--background)",
          },
        },
      },
      {
        "$tab-trigger.format": "underline",
        style: {
          web: {
            backgroundColor: "transparent",
          },
        },
      },
    ],
  }),

  /*******************************(Trigger)********************************/
  // Trigger is the clickable tab button with visual content e.g label and icon
  trigger: createStyle({
    name: "tab-trigger",
    base: [
      {
        web: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",

          background: "inherit",

          color: "var(--primary)",
          whiteSpace: "nowrap",

          fontSize: "12px",
          fontWeight: "400",

          flex: "1",
          //   margin: "4px",
        },
      },
    ],
    settings: {
      format: {
        segmented: [
          {
            web: {
              padding: "4px 4px",

              // Hover state
              //   "&:hover": {
              //     backgroundColor: "rgba(255, 255, 255, 0.05)",
              //   },

              // Checked state - the tab is selected
              ".peer:checked ~ &": {
                backgroundColor: "var(--surface)",
                color: "var(--primary)",
                boxShadow: "var(--shadow-subtle)",
              },
            },
          },
        ],
        underline: [
          {
            web: {
              //   padding: "4px 8px",

              // Hover state
              //   "&:hover": {
              //     backgroundColor: "rgba(255, 255, 255, 0.05)",
              //   },

              // Checked state - the tab is selected
              ".peer:checked ~ &": {
                color: "var(--primary)",
                borderBottom: "2px solid var(--primary)",
              },
            },
          },
        ],
      },

      size: {
        "3xs": [
          {
            web: {
              height: "24px",
              minWidth: "24px",
            },
          },
        ],
        "2xs": [
          {
            web: {
              height: "28px",
              minWidth: "28px",
            },
          },
        ],
        xs: [
          {
            web: {
              height: "32px",
              minWidth: "32px",
            },
          },
        ],
        sm: [
          {
            web: {
              height: "36px",
              minWidth: "36px",
            },
          },
        ],
        md: [
          {
            web: {
              height: "40px",
              minWidth: "40px",
            },
          },
        ],
        lg: [
          {
            web: {
              height: "48px",
              minWidth: "48px",
            },
          },
        ],
        xl: [
          {
            web: {
              height: "52px",
              minWidth: "52px",
            },
          },
        ],
        "2xl": [
          {
            web: {
              height: "56px",
              minWidth: "56px",
            },
          },
        ],
        "3xl": [
          {
            web: {
              height: "64px",
              minWidth: "64px",
            },
          },
        ],
      },
      disabled: ThemeDisabled,
    },

    composition: [
      {
        "$tab-wrapper.radius": "none",
        style: {
          web: {
            borderRadius: "var(--radius-none)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "xs",
        style: {
          web: {
            borderRadius: "var(--radius-xs)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "sm",
        style: {
          web: {
            borderRadius: "var(--radius-sm)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "md",
        style: {
          web: {
            borderRadius: "var(--radius-md)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "base",
        style: {
          web: {
            borderRadius: "var(--radius-base)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "lg",
        style: {
          web: {
            borderRadius: "var(--radius-lg)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "xl",
        style: {
          web: {
            borderRadius: "var(--radius-xl)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "2xl",
        style: {
          web: {
            borderRadius: "var(--radius-2xl)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "3xl",
        style: {
          web: {
            borderRadius: "var(--radius-3xl)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "4xl",
        style: {
          web: {
            borderRadius: "var(--radius-4xl)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "5xl",
        style: {
          web: {
            borderRadius: "var(--radius-5xl)",
          },
        },
      },
      {
        "$tab-wrapper.radius": "full",
        style: {
          web: {
            borderRadius: "var(--radius-full)",
          },
        },
      },
    ],

    defaultSettings: {
      format: "segmented",
      size: "md",
      disabled: false,
    },
  }),

  /*******************************(Input)********************************/
  // Hidden radio input for state management
  input: createStyle({
    name: "tab-input",
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
};
