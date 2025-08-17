import { createStyle, type StyleProps } from "@in/style";

/*########################################(CREATE STYLE)########################################*/
export const NotchStyle = createStyle({
  /*******************************(Base)********************************/
  base: ["flex flex-col w-auto h-auto min-w-[50px] max-w-[75px]"],
  /*******************************(Settings)********************************/
  settings: {
    // Variant
    // variant: {
    //   sharp: ["w-[50px] h-[605px]"],
    //   island: ["w-[75px] h-[605px]"],
    // },
    // Direction (controls orientation via CSS transforms)
    // direction: {
    //   down: ["", { web: { transform: "none" } }],
    //   up: ["", { web: { transform: "rotate(180deg)" } }],
    //   left: ["", { web: { transform: "none" } }],
    //   right: ["", { web: { transform: "scaleX(-1)" } }],
    // },
    // Format
    // Size
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    // variant: "sharp",
    // direction: "down",
  },
});

/*########################################(TYPE)########################################*/
export type NotchProps = StyleProps<typeof NotchStyle> &
  JSX.SharedProps & {
    variant?: "sharp" | "island";
    direction?: "left" | "right" | "down" | "up";
  };
