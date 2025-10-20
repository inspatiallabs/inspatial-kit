import type { StyleProps } from "@in/style";
import type { CounterStyle } from "./style.ts";
import type { ButtonProps } from "@in/widget/ornament";
import type { IconProps } from "@in/widget/icon";
import type { JSX } from "@in/runtime/types";

/*####################################(RESET PROPS)####################################*/

export type CounterResetProps = StyleProps<typeof CounterStyle.reset> & {
  icon?: IconProps;
} & ButtonProps;

/*####################################(INCREMENT PROPS)####################################*/
export type CounterIncrementProps = StyleProps<
  typeof CounterStyle.increment
> & {
  icon?: IconProps;
} & ButtonProps;

/*####################################(DECREMENT PROPS)####################################*/
export type CounterDecrementProps = StyleProps<
  typeof CounterStyle.decrement
> & {
  icon?: IconProps;
} & ButtonProps;

/*####################################(COUNTER PROPS)####################################*/
export type CounterProps = StyleProps<typeof CounterStyle.wrapper> & {
  //   value: number;
  format?: "None" | "Number" | "Progress"; // Replace with actual props >  | NumberFieldProps  // | ProgressBarProps;
  children?: {
    reset?: CounterResetProps;
    increment?: CounterIncrementProps;
    decrement?: CounterDecrementProps;
  };
} & JSX.SharedProps;

/*####################################(COUNTER CONTROLS)####################################*/
export type CounterControls = {
  value: number;
  format: "None" | "Number" | "Progress";
  axis: "X" | "Y" | "Z";
  reset: boolean;
  increment: boolean;
  decrement: boolean;
};
