import { createStyle } from "@in/style";
import {
  ThemeAxis,
  ThemeDisabled,
  ThemeRadius,
  ThemeBoxSize,
} from "@in/widget/theme/index.ts";

export const ButtonStyle = createStyle({
  /*******************************(Base)********************************/
  base: [
    "inline-flex",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "text-center",
    {
      web: {
        display: "inline-flex",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        "&:hover": {
          background:
            "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
          backgroundBlendMode: "color-dodge, normal, normal",
        },
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
        "bg-(--brand)",
        "text-white",
        "shadow-effect",
        {
          web: {
            backgroundColor: "var(--brand)",
            color: "var(--color-white)",
            boxShadow: "var(--shadow-effect)",
            "&:hover": {
              boxShadow: "var(--shadow-prime)",
              backgroundColor: "var(--brand)",
            },
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
        "border-2",
        "border-(--surface)",
        "shadow-muted",
        "text-primary",
        "bg-(--surface)",
        "hover:bg-(--surface)",
        {
          web: {
            borderWidth: "2px",
            boxShadow: "var(--shadow-subtle)",
            borderColor: "var(--surface)",
            "&:hover": {
              backgroundColor: "var(--surface)",
            },
          },
        },
      ],
      outlineBackground: [
        "border-2",
        "shadow-muted",
        "border-(--background)",

        "hover:bg-(--surface)",
        "hover:border-(--brand)",
        "hover:border-t-4",
        "hover:border-b-0.5",
        "hover:border-l-2",
        "hover:border-r-2",
        "hover:text-(--primary)",
        {
          web: {
            borderWidth: "2px",
            boxShadow: "var(--shadow-subtle)",
            borderColor: "var(--background)",
            "&:hover": {
              backgroundColor: "var(--surface)",
              borderColor: "var(--brand)",
              borderTopWidth: "4px",
              borderBottomWidth: "0.5px",
              borderLeftWidth: "2px",
              borderRightWidth: "2px",
              color: "var(--primary)",
            },
          },
        },
      ],
      outlineMuted: [
        "border-2 border-(--muted) shadow-muted text-primary bg-(--surface)",
        {
          web: {
            borderWidth: "2px",
            // borderColor/backgroundColor via classes for override
            boxShadow: "var(--shadow-subtle)",
            borderColor: "var(--muted)",
          },
        },
      ],
      ghost: [
        "bg-transparent shadow-none text-primary",
        { web: { backgroundColor: "transparent", boxShadow: "none" } },
      ],
      background: [
        "bg-(--background)",
        "shadow-none",
        "text-(--secondary)",
        "hover:bg-(--surface)",
        "hover:border-2",
        "hover:border-(--background)",
        {
          web: {
            backgroundColor: "var(--background)",
            boxShadow: "none",
            color: "var(--secondary)",
            "&:hover": {
              backgroundColor: "var(--surface)",
              borderWidth: "2px",
              borderColor: "var(--background)",
            },
          },
        },
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
    radius: "md",
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
