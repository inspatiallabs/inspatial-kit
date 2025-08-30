import { createStyle } from "@in/style/variant/index.ts";

export const KitBorderStyle = createStyle({
  base: [
    {
      web: {
        backgroundColor: "var(--brand)",
        height: "2px",
        width: "100%",
        zIndex: 99999999999999999999,
        position: "fixed",
        top: 0,
        overflow: "hidden",
        animation: "var(--animate-inmotion-loading)",
      },
    },
  ],
});
