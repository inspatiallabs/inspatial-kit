import { createStyle, type StyleProps } from "@in/style";

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
            backgroundColor: "var-(--brand)",
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
            textDecorationColor: "var-(--brand)",
            textUnderlineOffset: "4px",
            // decoration color via class
          },
        },
      ],
    },

    //##############################################(SIZE PROP)##############################################//
    // Always set max and min values this restrains the size of the button especially when using InSpatial Widgets to keep them from mirroring the parent container sizing
    size: {
      base: [
        "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4 ",
        {
          web: {
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      sm: [
        "h-[36px] min-w-[36px] min-h-[36px] max-h-[36px] max-w-full px-4",
        {
          web: {
            height: "36px",
            minWidth: "36px",
            minHeight: "36px",
            maxHeight: "36px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      md: [
        "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4",
        {
          web: {
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      lg: [
        "h-[48px] min-w-[48px] min-h-[48px] max-h-[48px] max-w-full px-4",
        {
          web: {
            height: "48px",
            minWidth: "48px",
            minHeight: "48px",
            maxHeight: "48px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      xl: [
        "h-[52px] min-w-[52px] min-h-[52px] max-h-[52px] max-w-full px-4",
        {
          web: {
            height: "52px",
            minWidth: "52px",
            minHeight: "52px",
            maxHeight: "52px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
    },

    //##############################################(RADIUS PROP)##############################################//

    radius: {
      base: ["rounded-lg", { web: { borderRadius: "0.5rem" } }],
      sm: ["rounded-sm", { web: { borderRadius: "0.125rem" } }],
      md: ["rounded-md", { web: { borderRadius: "0.375rem" } }],
      lg: ["rounded-lg", { web: { borderRadius: "0.5rem" } }],
      xl: ["rounded-xl", { web: { borderRadius: "0.75rem" } }],
      full: ["rounded-full", { web: { borderRadius: "9999px" } }],
    },

    //##############################################(AXIS PROP)##############################################//

    axis: {
      x: ["flex flex-row", { web: { display: "flex", flexDirection: "row" } }],
      y: [
        "flex flex-col rotate-90",
        { web: { display: "flex", flexDirection: "column" } },
      ],
      z: [
        "flex flex-row-reverse perspective-[-3000px] transform-3d skew-x-12",
        { web: { display: "flex", flexDirection: "row-reverse" } },
      ],
    },

    //##############################################(DISABLED PROP)##############################################//

    disabled: {
      true: [
        "opacity-disabled opacity-50 text-(--muted) pointer-events-none cursor-disabled",
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
            color: "var(--muted)",
          },
        },
      ],
      false: [""],
    },

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

//##############################################(TYPES)##############################################//

export type ButtonProps = StyleProps<typeof ButtonStyle> &
  JSX.SharedProps & {
    isLoading?: boolean;
    loadingText?: string;
    label?: string; // text label to display
  };

export const ButtonStyleClass = ButtonStyle.getStyle({
  format: "base",
  variant: "base",
  size: "base",
});
