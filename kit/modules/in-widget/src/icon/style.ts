import { createStyle } from "@in/style";

//##############################################(CREATE STYLE)##############################################//

export const IconStyle = createStyle({
  base: [
    "inline-block items-center",
    { web: { display: "inline-block", alignItems: "center" } },
  ],
  settings: {
    format: {
      regular: ["", {}],
      fill: ["fill-current", { web: { fill: "currentColor" } }],
    },

    size: {
      xs: ["w-[16px] h-[16px]", { web: { width: "16px", height: "16px" } }],
      sm: ["w-[24px] h-[24px]", { web: { width: "24px", height: "24px" } }],
      md: ["w-[32px] h-[32px]", { web: { width: "32px", height: "32px" } }],
      lg: ["w-[40px] h-[40px]", { web: { width: "40px", height: "40px" } }],
      xl: ["w-[48px] h-[48px]", { web: { width: "48px", height: "48px" } }],
    },

    disabled: {
      true: [
        "opacity-disabled opacity-50 pointer-events-none cursor-not-allowed",
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
            color: "var(--muted)",
          },
        },
      ],
      false: [{}],
    },
  },
  defaultSettings: {
    format: "regular",
    size: "md",
    disabled: false,
  },
});
