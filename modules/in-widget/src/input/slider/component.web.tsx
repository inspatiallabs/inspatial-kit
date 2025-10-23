import { Show } from "@in/widget/control-flow";
import { Slot, Stack } from "@in/widget/structure";
import { List } from "@in/widget/data-flow";
import { iss } from "@in/style";
import { SliderStyle } from "./style.ts";
import type { SliderProps } from "./type.ts";
import { $ } from "@in/teract/state";
import { Text } from "@in/widget/typography/index.ts";
import { useSlider } from "./state.ts";
import { unwrapValue, clamp, toPercentage } from "@in/vader";

/*##############################(SLIDER)####################################*/

export function Slider(props: SliderProps) {
  try {
    /**************************(Props)**************************/
    const {
      id,
      name,
      className,
      class: cls,
      style,
      min,
      max,
      step,
      value,
      defaultValue,
      onChange,
      onBlur,
      format,
      size,
      radius,
      truncate = { mid: false, edge: false },
      showValue = false,
      disabled = false,
      children,
      $ref,
      ...rest
    } = props;

    const { mid: truncateMid = false, edge: truncateEdge = false } = truncate;

    /**************************(State)**************************/

    const { dragging, action } = useSlider;

    /** Computed current value - tracks external signal if provided */
    const currentValue = $(() => {
      if (value !== undefined) {
        return unwrapValue(value);
      }
      return defaultValue ?? min;
    });

    /**************************(Computed)**************************/
    const rangeCount = () => {
      return (max - min) / step - 1;
    };

    /** Must be computed signal for reactive updates */
    const rangePercentage = $(() => {
      const clamped = clamp(currentValue.get(), min, max);
      return toPercentage(clamped, min, max);
    });

    /** Markers data (min, mids, max) */
    const markersData = $(() => {
      const items: Array<{
        key: string;
        type: "min" | "mid" | "max";
        label: number;
      }> = [];
      items.push({ key: "min", type: "min", label: min });
      const count = rangeCount();
      for (let i = 0; i < count; i++) {
        const markerValue = min + step + i * step;
        items.push({ key: `mid-${i}`, type: "mid", label: markerValue });
      }
      items.push({ key: "max", type: "max", label: max });
      return items;
    });

    /**************************(Style Props)**************************/
    const wrapperProps = { format, disabled, className, class: cls } as const;
    const trackProps = { format, size, radius } as const;
    const handleProps = { size, radius, disabled } as const;
    const rangeProps = { radius } as const;
    const valueProps = { format } as const;
    const trackContainerProps = { format } as const;

    // Determine if truncate props were explicitly provided
    const hasExplicitTruncateMid =
      props?.truncate &&
      Object.prototype.hasOwnProperty.call(props.truncate, "mid");
    const hasExplicitTruncateEdge =
      props?.truncate &&
      Object.prototype.hasOwnProperty.call(props.truncate, "edge");

    /**************************(Handlers)**************************/

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newValue = Number(target.value);
      if (newValue !== currentValue.get()) {
        onChange?.(newValue);
      }
    };

    const handleValueInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newValue = Number(target.value);
      if (newValue >= min && newValue <= max) {
        if (newValue !== currentValue.get()) {
          onChange?.(newValue);
        }
      }
    };

    const handleBlur = (e: FocusEvent) => {
      onBlur?.(e);
      action.endDrag();
    };

    /**************************(Render)**************************/
    return (
      <Slot
        className={iss(SliderStyle.wrapper.getStyle(wrapperProps))}
        style={style}
        {...rest}
      >
        {/* Track Container with optional edge labels for bare format */}
        <Slot
          className={iss(
            SliderStyle.track.container.getStyle({
              ...trackContainerProps,
              className: children?.track?.container?.className,
              class: children?.track?.container?.class,
            })
          )}
          style={children?.track?.container?.style}
        >
          {/* Edge Label - Min (for bare format with truncateEdge) */}
          <Show when={format === "bare" && truncateEdge}>
            <Slot
              className={iss(
                // @ts-ignore
                SliderStyle.edgeLabel.getStyle({
                  className: children?.edgeLabels?.min?.className,
                  class: children?.edgeLabels?.min?.class,
                })
              )}
              style={children?.edgeLabels?.min?.style}
            >
              {min}
            </Slot>
          </Show>

          {/* Track with Range and Handle */}
          <Slot
            className={iss(
              SliderStyle.track.background.getStyle({
                ...trackProps,
                className: children?.track?.background?.className,
                class: children?.track?.background?.class,
              })
            )}
            style={children?.track?.background?.style}
          >
            {/* Range (filled portion) */}
            <Slot
              className={iss(
                SliderStyle.range.getStyle({
                  ...rangeProps,
                  className: children?.range?.className,
                  class: children?.range?.class,
                })
              )}
              style={$(() => ({
                ...(children?.range?.style ?? {}),
                web: {
                  ...(children?.range?.style?.web ?? {}),
                  width: `${rangePercentage.get()}%`,
                  transitionDuration: dragging.get() ? "0ms" : "150ms",
                },
              }))}
            />

            {/* Handle */}
            <Slot
              className={iss(
                SliderStyle.handle.getStyle({
                  ...handleProps,
                  className: children?.handle?.className,
                  class: children?.handle?.class,
                })
              )}
              style={$(() => ({
                ...(children?.handle?.style ?? {}),
                web: {
                  ...(children?.handle?.style?.web ?? {}),
                  left: `${rangePercentage.get()}%`,
                  transitionDuration: dragging.get() ? "0ms" : "150ms",
                },
              }))}
            />

            {/* Hidden Input */}
            <input
              id={id}
              name={name}
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue.get()}
              disabled={disabled}
              className={iss(
                SliderStyle.input.getStyle({
                  size,
                })
              )}
              aria-describedby={id}
              on:input={handleChange}
              on:pointerdown={action.startDrag}
              on:pointerup={action.endDrag}
              on:pointerleave={action.endDrag}
              on:blur={handleBlur}
              $ref={$ref}
            />
          </Slot>

          {/* Edge Label - Max (for bare format with truncateEdge) */}
          <Show when={format === "bare" && truncateEdge}>
            <Slot
              className={iss(
                SliderStyle.edgeLabel.getStyle({
                  className: children?.edgeLabels?.max?.className,
                  class: children?.edgeLabels?.max?.class,
                })
              )}
              style={children?.edgeLabels?.max?.style}
            >
              {max}
            </Slot>
          </Show>

          {/* Value Input/Display (for bare format with showValue) */}
          <Show when={format === "bare" && showValue}>
            <Slot
              className={iss(
                SliderStyle.value.getStyle({
                  ...valueProps,
                  className: children?.value?.className,
                  class: children?.value?.class,
                })
              )}
              style={children?.value?.style}
            >
              <input
                type="number"
                value={currentValue.get()}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                on:input={handleValueInputChange}
                on:change={handleValueInputChange}
              />
            </Slot>
          </Show>
        </Slot>

        {/* Markers (show when not in bare format) */}
        <Show when={format === "base"}>
          <Slot
            className={iss(
              // @ts-ignore
              SliderStyle.marker.container.getStyle({
                className: children?.markers?.container?.className,
                class: children?.markers?.container?.class,
              })
            )}
            style={children?.markers?.container?.style}
          >
            <List each={markersData}>
              {(m: {
                key: string;
                type: "min" | "mid" | "max";
                label: number;
              }) => (
                <Slot
                  key={m.key}
                  className={iss(
                    SliderStyle.marker.knob.getStyle({
                      ...(children?.markers?.knob?.format
                        ? { format: children?.markers?.knob?.format }
                        : m.type === "mid"
                        ? hasExplicitTruncateMid
                          ? { format: truncateMid ? "dot" : "label" }
                          : {}
                        : hasExplicitTruncateEdge
                        ? { format: truncateEdge ? "dot" : "label" }
                        : {}),
                      className: children?.markers?.knob?.className,
                      class: children?.markers?.knob?.class,
                    })
                  )}
                  style={$(() => ({
                    web: {
                      left: `${((m.label - min) / (max - min)) * 100}%`,
                    },
                  }))}
                  on:tap={() => {
                    if (disabled) return;
                    const next =
                      m.type === "min" ? min : m.type === "max" ? max : m.label;
                    if (next !== currentValue.get()) {
                      onChange?.(next);
                      const onInput = rest?.["on:input"];
                      if (typeof onInput === "function") {
                        onInput({ target: { value: next } });
                      }
                    }
                  }}
                >
                  {m.type === "mid"
                    ? truncateMid
                      ? null
                      : m.label
                    : truncateEdge
                    ? null
                    : m.label}
                </Slot>
              )}
            </List>
          </Slot>
        </Show>
      </Slot>
    );
  } catch (error) {
    console.error("[InSpatial Slider Component Error]:", error);
    return (
      <Stack>
        <Text style={{ web: { color: "red" } }} size="sm">
          InSpatial Slider Component Error:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </Stack>
    );
  }
}
