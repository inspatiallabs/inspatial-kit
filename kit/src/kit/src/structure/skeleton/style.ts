import { createStyle } from "@in/style";

export const SkeletonStyle = createStyle({
  base: [
    "flex",
    "bg-(--surface)",
    "rounded-md",
    "animate-pulse",
    "min-w-full",
    {
      web: {
        display: "flex",
        background: "var(--surface)",
        borderRadius: "var(--radius-md)",
        animation: "pulse 1.5s infinite",
        minWidth: "100%",
      },
    },
  ],
});
