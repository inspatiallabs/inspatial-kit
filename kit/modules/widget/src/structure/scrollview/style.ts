import { createStyle } from "@in/style";

/*###################################(STYLE)###################################*/
export const ScrollViewStyle = createStyle({
  base: [
    "relative block w-full h-full",
    {
      web: {
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
      },
    },
  ],
  settings: {
    // Whether the inner area should be scrollable
    scrollable: {
      true: ["", { web: {} }],
      false: ["", { web: {} }],
    },
    // Show or hide scrollbars (renderers may hide globally; this prop gives per-component control)
    scrollbar: {
      true: ["", { web: {} }],
      false: ["scrollbar-hide", { web: { scrollbarWidth: "none" } }],
    },
    // Visual theme for scrollbars (applies when scrollbar=true)
    scrollbarTheme: {
      auto: ["in-scrollbar-auto"],
      thin: ["in-scrollbar-thin"],
      minimal: ["in-scrollbar-minimal"],
      rounded: ["in-scrollbar-rounded"],
      pill: ["in-scrollbar-pill"],
      gradient: ["in-scrollbar-gradient"],
    },
  },
  defaultSettings: {
    scrollable: true,
    scrollbar: false,
    scrollbarTheme: "thin",
  },
});
