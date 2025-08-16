import { createStyle, type StyleProps } from "@in/style";

//##############################################(CREATE STYLE)##############################################//

export const IconStyle = createStyle({
  base: "inline-flex items-center",
  settings: {
    format: {
      regular: "",
      // thin: "",
      // light: "",
      // bold: "",
      fill: "fill-current",
      // duotone: "",
      // glass: "",
    },

    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
    // theme: {
    //   light: "text-black",
    //   dark: "text-white",
    // },

    disabled: {
      true: "opacity-disabled opacity-50 text-(--muted) pointer-events-none cursor-disabled",
      false: "",
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
