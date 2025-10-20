import { Icon } from "@in/widget/icon";
import { Button } from "@in/widget/ornament";
import { iss } from "@in/style";
import { CounterStyle } from "./style.ts";
import type {
  CounterDecrementProps,
  CounterIncrementProps,
  CounterProps,
  CounterResetProps,
} from "./type.ts";
import { Stack } from "@in/widget/structure";
import { useCounter } from "./state.ts";
import { Show, Choose } from "@in/widget/control-flow";

/*####################################(RESET BUTTON)####################################*/
export function CounterReset(props: CounterResetProps) {
  const { className, icon, ...rest } = props;
  return (
    <Button
      className={iss(CounterStyle.reset.getStyle({ className, ...rest }))}
      {...rest}
    >
      <Icon variant={icon?.variant ?? "CrosshairIcon"} {...icon} />
    </Button>
  );
}

/*####################################(INCREMENT BUTTON)####################################*/
export function CounterIncrement(props: CounterIncrementProps) {
  const { className, icon, ...rest } = props;
  return (
    <Button
      className={iss(CounterStyle.increment.getStyle({ className, ...rest }))}
      {...rest}
    >
      <Icon variant={icon?.variant ?? "PlusIcon"} {...icon} />
    </Button>
  );
}

/*####################################(INCREMENT BUTTON)####################################*/
export function CounterDecrement(props: CounterDecrementProps) {
  const { className, icon, ...rest } = props;
  return (
    <Button
      className={iss(CounterStyle.increment.getStyle({ className, ...rest }))}
      {...rest}
    >
      <Icon variant={icon?.variant ?? "MinusIcon"} {...icon} />
    </Button>
  );
}

/*####################################(COUNTER)####################################*/
export function Counter(props: CounterProps) {
  const { className, ...rest } = props;
  const { reset, increment, decrement, format, axis } = useCounter; // For Controller use
  return (
    <Stack
      className={iss(
        CounterStyle.wrapper.getStyle({ className, format, ...rest })
      )}
    >
      <Show when={rest.children?.reset || reset}>
        <CounterReset {...(rest.children?.reset ?? {})} />
      </Show>
      <Show when={rest.children?.increment || increment}>
        <CounterIncrement {...(rest.children?.increment ?? {})} />
      </Show>
      {/* <Choose
        cases={[
          {
            when: rest.format === "Number" || format.eq("Number"),
            children: <NumberField {...(rest.format.number ?? {})} />,
          },
          {
            when: rest.format === "Progress" || format.eq("Progress"),
            children: <ProgressBar {...(rest.format.progress ?? {})} />,
          },
          {
            when: rest.format === "None" || format.eq("None"),
            children: <></>,
          },
        ]}
        otherwise={<></>}
      /> */}
      <Show when={rest.children?.decrement || decrement}>
        <CounterDecrement {...(rest.children?.decrement ?? {})} />
      </Show>
    </Stack>
  );
}
