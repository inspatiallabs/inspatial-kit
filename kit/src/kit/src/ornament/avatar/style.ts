import { createStyle } from "@in/style";

/*###################################(CREATE STYLE)###################################*/
export const AvatarStyle = createStyle({
  base: [
    "rounded-full overflow-hidden bg-(--surface) text-(--primary)",
    { web: { display: "inline-flex", borderRadius: "9999px" } },
  ],
  settings: {
    size: {
      xs: ["w-6 h-6", { web: { width: "24px", height: "24px" } }],
      sm: ["w-8 h-8", { web: { width: "32px", height: "32px" } }],
      md: ["w-10 h-10", { web: { width: "40px", height: "40px" } }],
      lg: ["w-12 h-12", { web: { width: "48px", height: "48px" } }],
      xl: ["w-16 h-16", { web: { width: "64px", height: "64px" } }],
    },
    status: {
      offline: ["opacity-80"],
      connecting: ["opacity-90"],
      live: [""],
      error: ["ring-2 ring-red-500"],
    },
  },
  defaultSettings: {
    size: "md",
    status: "offline",
  },
});
