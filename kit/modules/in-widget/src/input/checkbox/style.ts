import { createStyle } from "@in/style/variant/index.ts";
import { ThemeBoxSize } from "@in/widget/theme/index.ts"

export const CheckboxStyle = {
  //##############################################(ROOT)##############################################//
  root: createStyle({
    base: [
      // default
      "accent-(--brand)",
      "relative",
      "inline-flex",
      "shrink-0",
      "appearance-none",
      "items-center",
      "justify-center",
      "rounded",
      "border-2",
      "shadow-sm",
      "outline-none",
      "transition",
      "duration-100",
      "enabled:cursor-pointer",
      // text color
      "text-primary",
      // disabled
      "data-[disabled]:border-(--muted)",
      "data-[disabled]:bg-(--background)",
      "data-[disabled]:text-(--primary)",
      // checked and enabled
      "enabled:data-[state=checked]:border-0",
      "enabled:data-[state=checked]:border-transparent",
      "enabled:data-[state=checked]:bg-(--brand)",
      // indeterminate
      "enabled:data-[state=indeterminate]:border-0",
      "enabled:data-[state=indeterminate]:border-transparent",
      "enabled:data-[state=indeterminate]:bg-(--brand)",
      {
        web: {
          accentColor: "var(--brand)",
          position: "relative",
          display: "inline-flex",
          // shrink: "0",
          // appearance: "none",
          // items: "center",
          // justify: "center",
          // rounded: "rounded",
        }
      }
    ],

    settings: {
      format: {
        outline: ["border", "border-(--muted)"],
        flat: ["border-none", "bg-(--background)"],
      },

      size: ThemeBoxSize,
    },

    defaultSettings: {
      format: "outline",
      size: "2xs",
    },
  }),

  //##############################################(INDICATOR)##############################################//
  indicator: createStyle({
    base: ["flex", "size-full", "items-center", "justify-center"],
  }),

  //##############################################(WRAPPER)##############################################//
  wrapper: createStyle({
    base: ["flex", "size-full", "items-center", "justify-center"],
  }),
};
