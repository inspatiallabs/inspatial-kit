import { createStyle } from "@in/style";
import { ThemeRadius, ThemeDisabled } from "@in/widget/theme/style.ts";

/*##################################(KIT BORDER SIZE)##################################*/
export const KitBorderSize = {
  xs: [{ web: { width: "100%", height: "1px" } }],
  sm: [{ web: { width: "100%", height: "2px" } }],
  md: [{ web: { width: "100%", height: "3px" } }],
  lg: [{ web: { width: "100%", height: "4px" } }],
  xl: [{ web: { width: "100%", height: "5px" } }],
} as const;

/*##################################(KIT BORDER POSITION)##################################*/

export const KitBorderPosition = {
  top: [{ web: { top: "0" } }],
  bottom: [{ web: { bottom: "0" } }],
} as const;

/*##################################(KIT BORDER FORMAT)##################################*/

export const KitBorderFormat = {
  brand: [{ web: { backgroundColor: "var(--brand)" } }],
} as const;

/*##################################(KIT BORDER STYLE)##################################*/
export const KitBorderStyle = createStyle({
  name: "kit-border",
  base: [
    {
      web: {
        zIndex: 99999999999999999999,
        overflow: "hidden",
        animation: "var(--animate-inmotion-loading)",
      },
    },
  ],
  settings: {
    size: KitBorderSize,
    position: KitBorderPosition,
    format: KitBorderFormat,
    radius: ThemeRadius,
    disabled: ThemeDisabled,
  },

  defaultSettings: {
    size: "sm",
    position: "top",
    format: "brand",
    radius: "none",
    disabled: false,
  },
});
