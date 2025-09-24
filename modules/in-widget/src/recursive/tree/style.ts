import { createStyle } from "@in/style";
import { ThemeDisabled } from "@in/widget/theme/style.ts";

export const TreeStyle = {
  /*################################(TREE WRAPPER)################################*/
  /*===================================(Wrapper)==================================*/
  wrapper: createStyle({
    name: "tree-wrapper",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
        },
      },
    ],
  }),

  /*################################(TREE ITEM)################################*/
  /*===================================(Item)==================================*/
  item: createStyle({
    name: "tree-item",
    base: [
      {
        web: {
          cursor: "default",
          zIndex: "10",
          padding: "var(--tree-padding)",
          outline: "hidden",
          select: "none",
          "&:not(:last-child)": {
            paddingBottom: "0.5rem",
          },
          "&:focus": {
            zIndex: "20",
          },
          ".tree-item-selected &": {
            backgroundColor: "var(--brand)",
            color: "var(--primary)",
          },
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

  /*################################(TREE LABEL)################################*/
  /*===================================(Label)==================================*/
  label: createStyle({
    name: "tree-label",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.375rem 0.5rem",
          fontSize: "0.875rem",
          transition: "all 0.2s ease",
          borderRadius: "0.25rem",

          focusVisible: "ring-ring/50",

          "&:hover": {
            background: "var(--surface)",
            opacity: "0.6",
          },

          // Selected via parent class
          ".tree-item-selected &": {
            backgroundColor: "var(--brand)",
            color: "var(--primary)",
          },

          // Drag target via parent class
          ".tree-item-drag-target &": {
            background: "var(--brand)",
          },

          // Dragging over via parent class
          ".tree-item-drag-over &": {
            background: "var(--brand)",
            outline: "2px solid var(--brand)",
            outlineOffset: "-2px",
          },

          // Search match via parent class
          ".tree-item-search-match &": {
            background: "var(--color-red-400)/30",
          },

          "& svg": {
            pointerEvents: "none",
            shrink: "0",
          },
        },
      },
    ],
  }),

  /*################################(TREE DRAG LINE)################################*/
  /*===================================(Drag Line)==================================*/
  dragLine: createStyle({
    name: "tree-drag-line",
    base: [
      {
        web: {
          background: "var(--brand)",
          position: "absolute",
          zIndex: "30",
          marginTop: "-1px",
          width: "100px",
          height: "3px",
          "&::before": {
            content: "''",
            position: "absolute",
            top: "-3px",
            left: 0,
            width: "8px",
            height: "8px",
            borderRadius: "9999px",
            backgroundColor: "var(--brand)",
            border: "2px solid var(--background)",
          },
        },
      },
    ],
  }),

  /*################################(TREE ASSISTIVE DESCRIPTION)################################*/
  /*===================================(Assistive Description)==================================*/
  assistiveDescription: createStyle({
    name: "tree-assistive-description",
    base: [
      {
        web: {
          position: "absolute",
          margin: "-1px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        },
      },
    ],
  }),
};

