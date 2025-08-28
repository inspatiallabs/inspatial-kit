import { createStyle } from "@in/style";
import {
  ThemeAxis,
  ThemeDisabled,
  ThemeRadius,
  ThemeBoxSize,
} from "../../theme/index.ts";

export const ButtonStyle = createStyle({
  /*******************************(Base)********************************/
  base: [
    "inline-flex cursor-pointer items-center justify-center text-center",
    {
      web: {
        display: "inline-flex",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      },
    },
  ],

  /*******************************(Settings)********************************/
  settings: {
    //##############################################(COMPONENT VARIANT PROP)##############################################//

    variant: {
      base: "",
      //     barrow: "",
      //     segmented: "",
      //     inline: "",
      //     urban: "",
    },

    //##############################################(FORMAT PROP)##############################################//
    format: {
      base: [
        "bg-(--brand) text-white shadow-effect hover:shadow-base",
        {
          web: {
            boxShadow: "var(--in-shadow-effect, 0 0 0 0 transparent)",
            backgroundColor: "var(--brand)",
          },
        },
      ],
      outline: [
        "outline outline-2 outline-(--brand) bg-inherit hover:bg-(--brand) text-primary hover:text-white",
        {
          web: {
            outlineStyle: "solid",
            outlineWidth: "2px",
            // outlineColor intentionally left to classes for override
          },
        },
      ],
      outlineSurface: [
        "border-2 border-(--surface) shadow-muted text-primary bg-(--surface)",
        {
          web: {
            borderWidth: "2px",
            // borderColor/backgroundColor via classes for override
            boxShadow: "var(--in-shadow-muted, 0 0 0 0 transparent)",
            borderColor: "var(--surface)",
          },
        },
      ],
      ghost: [
        "bg-transparent shadow-none text-primary",
        { web: { backgroundColor: "transparent", boxShadow: "none" } },
      ],
      underline: [
        "bg-inherit text-primary shadow-none underline-offset-[4px] underline decoration-4 decoration-(--brand)",
        {
          web: {
            textDecorationThickness: "4px",
            textDecorationColor: "var(--brand)",
            textUnderlineOffset: "4px",
            // decoration color via class
          },
        },
      ],
    },

    //##############################################(SIZE PROP)##############################################//
    // Always set max and min values this restrains the size of the button especially when using InSpatial Widgets to keep them from mirroring the parent container sizing
    size: ThemeBoxSize,

    //##############################################(RADIUS PROP)##############################################//

    radius: ThemeRadius,

    //##############################################(AXIS PROP)##############################################//

    axis: ThemeAxis,

    //##############################################(DISABLED PROP)##############################################//

    disabled: ThemeDisabled,

    //##############################################(ICON PROP)##############################################//

    iconOnly: {
      true: [
        "px-unit-0 !gap-unit-0",
        { web: { paddingLeft: "0", paddingRight: "0", gap: "0" } },
      ],
      false: [""],
    },
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    variant: "base",
    format: "base",
    size: "base",
    radius: "base",
    axis: "x",
    disabled: false,
    iconOnly: false,
  },

  /*******************************(Composition)********************************/
  // composition: [
  //   //##############################################(WITH ICON)##############################################//
  //   {
  //     format: "base",
  //     size: "base",
  //     radius: "full",
  //     axis: "x",
  //     // iconOnly: true,
  //   },
  // ],
});
