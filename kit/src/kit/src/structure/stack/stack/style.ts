import { createStyle, type StyleProps } from "@in/style";

/*#####################################(CREATE STYLE)#####################################*/

export const StackStyle = createStyle({
  /*******************************(Base)********************************/
  base: "block",

  /*******************************(Settings)********************************/
  settings: {
    //##############################################(VARIANT PROP)##############################################//
    variant: {
      xStack: [
        "inline-flex flex-row",
        { web: { display: "inline-flex", flexDirection: "row" } },
      ],
      yStack: [
        "inline-flex flex-col",
        { web: { display: "inline-flex", flexDirection: "column" } },
      ],
      zStack: [
        "inline-flex flex-row-reverse perspective-[-3000px] transform-3d skew-x-12",
        {
          web: { display: "inline-flex", flexDirection: "row-reverse", transform: "skewX(12deg)" },
        },
      ],
    },

    //##############################################(DISABLED PROP)##############################################//

    disabled: {
      true: "opacity-disabled opacity-50 text-(--muted) pointer-events-none cursor-disabled",
      false: "",
    },
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    variant: "xStack",
    disabled: false,
  },
});

//##############################################(TYPES)##############################################//

export type StackProps = StyleProps<typeof StackStyle> &
  JSX.SharedProps & {
    wrap?: JSX.ISSProps["flexWrap"];
    justify?: JSX.ISSProps["justifyContent"];
    align?: JSX.ISSProps["alignItems"];
    gap?: JSX.ISSProps["gap"];
  };

export const StackPropsClass = StackStyle.getStyle({
  variant: "xStack",
  disabled: false,
});
