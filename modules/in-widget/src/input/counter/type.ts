import type { StyleProps } from "@in/style";
import type { CounterStyle } from "./style.ts";
import type { ButtonProps } from "@in/widget/ornament";
import type { IconProps } from "@in/widget/icon";
import type { JSX } from "@in/runtime/types";
// import type { NumberFieldProps } from "@in/widget/input/text-input/index.ts";

/*####################################(RESET PROPS)####################################*/

export type CounterResetProps = StyleProps<typeof CounterStyle.reset> & {
  icon?: IconProps | JSX.Element;
} & ButtonProps;

/*####################################(INCREMENT PROPS)####################################*/
export type CounterIncrementProps = StyleProps<
  typeof CounterStyle.increment
> & {
  icon?: IconProps | JSX.Element;
  value?: number;
} & ButtonProps;

/*####################################(DECREMENT PROPS)####################################*/
export type CounterDecrementProps = StyleProps<
  typeof CounterStyle.decrement
> & {
  icon?: IconProps | JSX.Element;
  value?: number;
} & ButtonProps;

/*####################################(COUNTER PROPS)####################################*/
export type CounterProps = StyleProps<typeof CounterStyle.wrapper> & {
  value?: number;
  format?: "None" | "Number";
  rateLimit?: {
    /** Interval in ms for rate limiting (default 1000) */
    interval?: number;
    /** If true, fire one step immediately on rate limit start */
    immediate?: boolean;
  };
  // | "Progress"; // Replace with actual props >  | NumberFieldProps  // | ProgressBarProps;
  children?: {
    reset?: CounterResetProps;
    increment?: CounterIncrementProps;
    decrement?: CounterDecrementProps;
  };
} & JSX.SharedProps;

/*####################################(COUNTER CONTROLS)####################################*/
export type CounterControls = {
  value: number;
  format: "None" | "Number";
  // | "Progress";
  axis: "x" | "y";
  reset: boolean;
  increment: boolean;
  decrement: boolean;
  /** Hold press rate limit in milliseconds */
  // rateLimit: number;
  // /** Fire one step immediately when holding */
  // holdImmediate: boolean;
};
