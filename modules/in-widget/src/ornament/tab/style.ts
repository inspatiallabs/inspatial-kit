import { createStyle } from "@in/style";
import {
  ThemeDisabled,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";

//##############################################( CREATE STYLE)##############################################//

export const TabStyle = {
  /*******************************(Root)********************************/
  // Root is the container and background for all tabs
  root: createStyle({
    name: "tab-root",
    base: [
      {
        web: {
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          overflow: "hidden",
        },
      },
    ],
    settings: {
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      disabled: false,
    },
    composition: [
      {
        "$tab-anchor.axis": "X",
        style: {
          web: {
            flexDirection: "row",
          },
        },
      },
      {
        "$tab-anchor.axis": "Y",
        style: {
          web: {
            flexDirection: "column",
          },
        },
      },
      {
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            backgroundColor: "var(--background)",
          },
        },
      },
      {
        "$tab-anchor.format": "underline",
        style: {
          web: {
            backgroundColor: "transparent",
            borderBottom: "1px solid var(--muted)",
            borderRadius: "0",
          },
        },
      },
      // Wrapper conforms to anchor radius
      {
        "$tab-anchor.radius": "none",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-none)",
          },
        },
      },
      {
        "$tab-anchor.radius": "xs",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-xs)",
          },
        },
      },
      {
        "$tab-anchor.radius": "sm",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-sm)",
          },
        },
      },
      {
        "$tab-anchor.radius": "md",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-md)",
          },
        },
      },
      {
        "$tab-anchor.radius": "base",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-base)",
          },
        },
      },
      {
        "$tab-anchor.radius": "lg",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-lg)",
          },
        },
      },
      {
        "$tab-anchor.radius": "xl",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-xl)",
          },
        },
      },
      {
        "$tab-anchor.radius": "2xl",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-2xl)",
          },
        },
      },
      {
        "$tab-anchor.radius": "3xl",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-3xl)",
          },
        },
      },
      {
        "$tab-anchor.radius": "4xl",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-4xl)",
          },
        },
      },
      {
        "$tab-anchor.radius": "5xl",
        "$tab-anchor.format": "segmented",
        style: {
          web: {
            borderRadius: "var(--radius-5xl)",
          },
        },
      },
      {
        "$tab-anchor.radius": "full",
        "$tab-anchor.format": "segmented",

        style: {
          web: {
            borderRadius: "var(--radius-full)",
          },
        },
      },
    ],
  }),

  /*******************************(Wrapper)********************************/
  // Wrapper is the secondary container incharge of proper positioning of the items inside it
  wrapper: createStyle({
    name: "tab-wrapper",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        },
      },
    ],
  }),

  /*******************************(Input)********************************/
  // Hidden radio input for state management
  input: createStyle({
    name: "tab-input",
    base: [
      "sr-only",
      "peer", // Peer is the input that is hidden and used to manage the state of the tab
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

  /*******************************(Anchor)********************************/
  // Anchor is the clickable tab button with visual content e.g label and icon
  anchor: createStyle({
    name: "tab-anchor",
    base: [
      {
        web: {
          height: "100%",
          width: "100%",

          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          cursor: "pointer",
          userSelect: "none",

          background: "inherit",

          color: "var(--primary)",
          whiteSpace: "nowrap",

          fontSize: "12px",
          fontWeight: "400",

          flex: "1",
        },
      },
    ],
    settings: {
      axis: {
        X: [
          {
            web: {
              flexDirection: "row",
            },
          },
        ],
        Y: [
          {
            web: {
              flexDirection: "column",
            },
          },
        ],
      },
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
        segmentedV2: [
          {
            web: {
              padding: "4px 4px",
              backgroundColor: "var(--surface)",

              // Hover state
              //   "&:hover": {
              //     backgroundColor: "rgba(255, 255, 255, 0.05)",
              //   },

              // Checked state - the tab is selected
              ".peer:checked ~ &": {
                backgroundColor: "var(--brand)",
                color: "var(--primary)",
                boxShadow: "var(--shadow-subtle)",
              },
            },
          },
        ],
        underline: [
          {
            web: {
              // Hover state
              //   "&:hover": {
              //     backgroundColor: "rgba(255, 255, 255, 0.05)",
              //   },

              // Checked state - the tab is selected
              ".peer:checked ~ &": {
                color: "var(--primary)",
                borderBottom: "4px solid var(--primary)",
              },
            },
          },
        ],
        rabi: [
          {
            web: {
              borderRight: "1px solid var(--background)",

              // Hover state
              //   "&:hover": {
              //     backgroundColor: "rgba(255, 255, 255, 0.05)",
              //   },

              // Checked state - the tab is selected
              ".peer:checked ~ &": {
                backgroundColor: "var(--background)",
                color: "var(--primary)",
              },
            },
          },
        ],
      },

      radius: ThemeRadius,

      scale: ThemeScale,

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

    defaultSettings: {
      axis: "X",
      format: "segmented",
      scale: "none",
      size: "md",
      radius: "none",
      disabled: false,
    },
  }),

  /*******************************(Icon)********************************/
  // Icon is the icon for the tab 😂
  icon: createStyle({
    name: "tab-icon",
    base: [
      {
        web: {
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    ],
  }),
};
