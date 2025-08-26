import { createStyle } from "@in/style";

export const DockStyle = createStyle({
  base: [
    "flex items-center rounded-full bg-(--brand) text-white shadow-subtle max-w-fit",
    {
      web: {
        display: "flex",
        zIndex: 2147483647,
      },
    },
  ],
  settings: {
    direction: {
      top: ["inmotion-position-top", "inmotion-slide-from-top"],
      bottom: ["inmotion-position-bottom", "inmotion-slide-from-bottom"],
      left: ["inmotion-position-left", "inmotion-slide-from-left"],
      right: ["inmotion-position-right", "inmotion-slide-from-right"],
    },
    axis: {
      x: ["flex-row", { web: { flexDirection: "row" } }],
      y: ["flex-col", { web: { flexDirection: "column" } }],
    },
    padded: {
      true: ["p-2"],
      false: [""],
    },
  },
  defaultSettings: {
    axis: "x",
    padded: true,
  },
});

export const DockItemsStyle = createStyle({
  base: ["flex gap-2"],
  settings: {
    axis: {
      x: ["flex-row", { web: { flexDirection: "row" } }],
      y: ["flex-col", { web: { flexDirection: "column" } }],
    },
  },
  defaultSettings: {
    axis: "x",
  },
});

export const DockItemStyle = createStyle({
  base: [
    "group relative flex items-center justify-center h-9 w-9 aspect-square rounded-full bg-(--surface) text-primary shadow-prime transition-transform duration-200 hover:scale-110 active:scale-95",
  ],
});

export const DockIconStyle = createStyle({
  base: ["flex items-center justify-center h-6 w-6 text-(--brand)"],
});

export const DockLabelStyle = createStyle({
  base: [
    "pointer-events-none absolute z-[1000] px-2.5 py-0.5 whitespace-pre rounded-full bg-(--brand) text-white font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150",
  ],
  settings: {
    showOnHover: {
      true: ["opacity-0 group-hover:opacity-100"],
      false: ["opacity-100"],
    },
  },
  defaultSettings: {
    showOnHover: true,
  },
});

export const DockMinimizedShellStyle = createStyle({
  base: ["cursor-pointer size-10"],
});
