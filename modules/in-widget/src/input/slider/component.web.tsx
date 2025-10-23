import { Show } from "@in/widget/control-flow";
import { Slot, Stack } from "@in/widget/structure";
import { List } from "@in/widget/data-flow";
import { iss } from "@in/style";
import { SliderStyle } from "./style.ts";
import type { SliderProps } from "./type.ts";
import { $, createState } from "@in/teract/state";
import type { Signal } from "@in/teract/signal";
import { Text } from "@in/widget/typography/index.ts";

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
    /** Helper to unwrap value (could be signal or plain value) */
    const unwrapValue = (val: number | Signal<number>) => {
      if (val && typeof val === "object" && "get" in val) {
        return val.get();
      }
      return val;
    };

    /** Local dragging state to disable transitions during drag */
    const dragging = createState(false);

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
      return ((currentValue.get() - min) / (max - min)) * 100;
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

    /**************************(Handlers)**************************/
    const startDrag = () => {
      dragging.set(true);
    };

    const endDrag = () => {
      dragging.set(false);
    };

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

    const handleBlur = (e: any) => {
      onBlur?.(e);
      endDrag();
    };

    /**************************(Render Helpers)**************************/
    // Using @in/widget/data-flow/list for rendering markers reactively

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
            SliderStyle.trackContainer.getStyle({
              ...trackContainerProps,
              className: children?.trackContainer?.className,
              class: children?.trackContainer?.class,
            })
          )}
          style={children?.trackContainer?.style}
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
              SliderStyle.track.getStyle({
                ...trackProps,
                className: children?.track?.className,
                class: children?.track?.class,
              })
            )}
            style={children?.track?.style}
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
              on:pointerdown={startDrag}
              on:pointerup={endDrag}
              on:pointerleave={endDrag}
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
              SliderStyle.markers.getStyle({
                className: children?.markers?.className,
                class: children?.markers?.class,
              })
            )}
            style={children?.markers?.style}
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
                    SliderStyle.marker.getStyle({
                      variant:
                        m.type === "mid"
                          ? truncateMid
                            ? "dot"
                            : "label"
                          : truncateEdge
                          ? "dot"
                          : "label",
                      className: children?.markers?.className,
                      class: children?.markers?.class,
                    })
                  )}
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
    /** Log error for debugging */
    console.error("[InSpatial Slider Component Error]:", error);

    /** Return fallback UI */
    return (
      <Stack>
        <Text>
          InSpatial Slider Component Error:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </Stack>
    );
  }
}
