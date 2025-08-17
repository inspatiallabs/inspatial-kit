import { createStyle, type StyleProps } from "@in/style";

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
      sm: ["w-4 h-4", { web: { width: "16px", height: "16px" } }],
      md: ["w-6 h-6", { web: { width: "24px", height: "24px" } }],
      lg: ["w-8 h-8", { web: { width: "320px", height: "320px" } }],
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
    size: "lg",
    disabled: false,
  },
});

//##############################################(TYPES)##############################################//
export type IconProps = StyleProps<typeof IconStyle> & JSX.SharedProps & {};
