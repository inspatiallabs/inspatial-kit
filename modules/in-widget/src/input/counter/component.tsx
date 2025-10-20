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
import { NumberField } from "@in/widget/input/text-input/index.ts";
import { Button } from "@in/widget/ornament/button/index.ts";
import {
  $,
  isSignal,
  read as readSig,
  write as writeSig,
} from "@in/teract/signal";
import { getCounterIcon } from "./helper.tsx";

/*####################################(RESET BUTTON)####################################*/
export function CounterReset(props: CounterResetProps) {
  const { className, icon, children: resetChildren, ...rest } = props;
  const iconNode = icon && (icon as any)?.type ? icon : null;
  return (
    <Button
      className={iss(CounterStyle.reset.getStyle({ className, ...rest }))}
      {...rest}
    >
      {resetChildren ?? iconNode ?? getCounterIcon(icon, "CrosshairIcon")}
    </Button>
  );
}

/*####################################(INCREMENT BUTTON)####################################*/
export function CounterIncrement(props: CounterIncrementProps) {
  const {
    className,
    icon,
    children: incChildren,
    value: incValue = 1,
    ...rest
  } = props;
  const iconNode = icon && (icon as any)?.type ? icon : null;
  return (
    <Button
      className={iss(CounterStyle.increment.getStyle({ className, ...rest }))}
      aria-label="Increment counter"
      title="Increment"
      {...rest}
    >
      {incChildren ?? iconNode ?? getCounterIcon(icon, "PlusIcon")}
    </Button>
  );
}

/*####################################(INCREMENT BUTTON)####################################*/
export function CounterDecrement(props: CounterDecrementProps) {
  const {
    className,
    icon,
    children: decChildren,
    value: decValue = 1,
    ...rest
  } = props;
  const iconNode = icon && (icon as any)?.type ? icon : null;
  return (
    <Button
      className={iss(CounterStyle.decrement.getStyle({ className, ...rest }))}
      aria-label="Decrement counter"
      title="Decrement"
      {...rest}
    >
      {decChildren ?? iconNode ?? getCounterIcon(icon, "MinusIcon")}
    </Button>
  );
}

/*####################################(COUNTER)####################################*/
export function Counter(props: CounterProps) {
  /*[[[[[[[[[[[[[[[[[[[[[[[TRY]]]]]]]]]]]]]]]]]]]]]]]*/
  try {
    /*******************(Props)*******************/
    const { className, axis, format = "None", children, ...rest } = props;
    const {
      reset: resetControl,
      increment: incrementControl,
      decrement: decrementControl,
      format: formatControl,
      axis: axisControl,
      value: valueControl,
    } = useCounter; // For Controller use

    const read = (v: any) => (v && typeof v.get === "function" ? v.get() : v);

    const axisSetting = (axis ?? read(axisControl) ?? "x")
      ?.toString?.()
      ?.toLowerCase?.();

    // Wrapper props (aligns with Switch pattern)
    const wrapperProps = { axis: axisSetting, className } as const;
    const holdInterval = Math.max(
      10,
      Number(props?.rateLimit?.interval ?? 100) || 100
    );
    const holdImmediate = !!props?.rateLimit?.immediate;

    const incValue = children?.increment?.value ?? 1;
    const extVal = props?.value as any;
    const externalSet = ((): null | ((nv: any) => void) => {
      if (!extVal) return null;
      if (typeof extVal?.set === "function") {
        return (nv: any) => {
          const prev = extVal?.peek?.() ?? extVal?.get?.() ?? readSig(extVal);
          const next = typeof nv === "function" ? nv(prev) : nv;
          extVal.set(next);
        };
      }
      if (isSignal(extVal)) {
        return (nv: any) => writeSig(extVal, nv);
      }
      return null;
    })();
    const hasExternal = !!externalSet;
    const incOnce = () => {
      if (externalSet)
        externalSet((prev: number) => (prev ?? 0) + (incValue || 1));
      else useCounter.action.setIncrement(incValue);
    };
    const incPresshold = children?.increment?.["on:presshold"] ?? {
      fn: () => incOnce(),
      interval: holdInterval,
      immediate: holdImmediate,
    };

    const decValue = children?.decrement?.value ?? 1;
    const decOnce = () => {
      if (externalSet)
        externalSet((prev: number) => (prev ?? 0) - (decValue || 1));
      else useCounter.action.setDecrement(decValue);
    };
    const decPresshold = children?.decrement?.["on:presshold"] ?? {
      fn: () => decOnce(),
      interval: holdInterval,
      immediate: holdImmediate,
    };

    /*******************(Render)*******************/
    return (
      <Stack
        className={iss(
          CounterStyle.wrapper.getStyle({
            className: wrapperProps.className,
            axis: wrapperProps.axis,
          })
        )}
        {...rest}
      >
        <Show
          when={$(() => {
            const v = hasExternal
              ? extVal?.get?.() ?? read(extVal)
              : read(valueControl);
            return (
              ((children?.reset != null ? true : !!read(resetControl)) &&
                (Number(v) || 0) > 0) ||
              (Number(v) || 0) < 0
            );
          })}
        >
          <CounterReset
            axis={axisSetting}
            {...children?.reset}
            on:tap={
              children?.reset?.["on:tap"] ??
              (() => {
                try {
                  if (externalSet) externalSet(0);
                  else useCounter.action.setReset();
                } catch {}
              })
            }
            icon={children?.reset?.icon}
          />
        </Show>
        <Show
          when={() =>
            children?.increment != null ? true : !!read(incrementControl)
          }
        >
          <CounterIncrement
            axis={axisSetting}
            {...children?.increment}
            on:tap={children?.increment?.["on:tap"] ?? (() => incOnce())}
            on:presshold={incPresshold}
            icon={children?.increment?.icon}
            value={incValue}
          />
        </Show>
        {(() => {
          const currentFormat =
            format != null ? format : read(formatControl) ?? "None";
          return (
            <Choose
              cases={[
                {
                  when: currentFormat === "Number",
                  children: (
                    <NumberField
                      key={String(
                        hasExternal
                          ? extVal?.get?.() ?? read(extVal)
                          : read(valueControl)
                      )}
                      value={hasExternal ? extVal : valueControl}
                      on:input={(e: any) =>
                        externalSet
                          ? externalSet(Number(e?.target?.value ?? e) || 0)
                          : useCounter.action.setValue?.(
                              Number(e?.target?.value ?? e) || 0
                            )
                      }
                    />
                  ),
                },
                // { when: currentFormat === "Progress", children: null }, // TODO: Add Progress Bar when Visualization Widget is ready
                { when: currentFormat === "None", children: null },
              ]}
              otherwise={null}
            />
          );
        })()}
        <Show
          when={() =>
            children?.decrement != null ? true : !!read(decrementControl)
          }
        >
          <CounterDecrement
            axis={axisSetting}
            {...children?.decrement}
            on:tap={children?.decrement?.["on:tap"] ?? (() => decOnce())}
            on:presshold={decPresshold}
            icon={children?.decrement?.icon}
            value={decValue}
          />
        </Show>
      </Stack>
    );
    /*[[[[[[[[[[[[[[[[[[[[[[[CATCH]]]]]]]]]]]]]]]]]]]]]]]*/
  } catch (error) {
    try {
      console.error("Counter render error", {
        error,
        props,
        snapshot: {
          value: useCounter.value.get(),
          axis: useCounter.axis.get(),
          format: useCounter.format.get(),
          reset: useCounter.reset.get(),
          increment: useCounter.increment.get(),
          decrement: useCounter.decrement.get(),
        },
      });
    } catch {}
    return (
      <Stack
        style={{
          web: {
            fontSize: "12px",
            color: "red",
          },
        }}
      >
        InSpatial Counter Error:{" "}
        {(error as any)?.message ?? "Counter render error"}
      </Stack>
    );
  }
}
