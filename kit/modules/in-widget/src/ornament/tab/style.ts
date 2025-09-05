import { createStyle } from "@in/style";

//##############################################( CREATE STYLE)##############################################//

export const TabStyle = {
  /*******************************(Wrapper)********************************/
  // Wrapper is the background container for all tabs
  wrapper: createStyle({
    name: "tab-wrapper",
    base: [
      {
        web: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "4px",
          padding: "4px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          width: "fit-content",
        },
      },
    ],
  }),

  /*******************************(Trigger)********************************/
  // Trigger is the clickable button (label element)
  trigger: createStyle({
    name: "tab-trigger",
    base: [
      {
        web: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
          transition: "all 200ms",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          padding: "0",
        //   width: "100%",
        },
      },
    ],
  }),

  /*******************************(Label)********************************/
  // Label is the visual content inside the trigger
  label: createStyle({
    name: "tab-label",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 200ms",
          position: "relative",
          color: "rgba(255, 255, 255, 0.7)",
          height: "32px",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderRadius: "8px",
          backgroundColor: "transparent",

          // Hover state
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "rgba(255, 255, 255, 0.9)",
          },

          // Disabled state
          ".peer:disabled ~ &": {
            opacity: "0.5",
            cursor: "not-allowed",
            pointerEvents: "none",
          },

          // Checked state - the tab is selected
          ".peer:checked ~ &": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "white",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          },
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