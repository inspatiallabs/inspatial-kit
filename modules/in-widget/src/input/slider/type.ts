import type { JSX } from "@in/runtime/types";
import type { StyleProps } from "@in/style";
import type { SliderStyle } from "./style.ts";
import type { Signal } from "@in/teract/signal";

/*################################(SLIDER STYLE PROPS)################################*/

export type SliderWrapperProps = StyleProps<typeof SliderStyle.wrapper>;
export type SliderInputProps = StyleProps<typeof SliderStyle.input>;
export type SliderTrackProps = StyleProps<typeof SliderStyle.track>;
export type SliderRangeProps = StyleProps<typeof SliderStyle.range>;
export type SliderHandleProps = StyleProps<typeof SliderStyle.handle>;
export type SliderValueProps = StyleProps<typeof SliderStyle.value>;
export type SliderMarkersProps = StyleProps<typeof SliderStyle.markers>;
export type SliderMarkerProps = StyleProps<typeof SliderStyle.marker>;
export type SliderTrackContainerProps = StyleProps<
  typeof SliderStyle.trackContainer
>;
export type SliderEdgeLabelProps = StyleProps<typeof SliderStyle.edgeLabel>;

/*################################(SLIDER PROPS)################################*/

export type SliderProps = StyleProps<typeof SliderStyle.wrapper> &
  Omit<JSX.SharedProps, "children"> & {
    /**
     * Unique identifier for the slider
     */
    id?: string;

    /**
     * Name attribute for form submission
     */
    name?: string;

    /**
     * Minimum value of the slider
     */
    min: number;

    /**
     * Maximum value of the slider
     */
    max: number;

    /**
     * Step increment for the slider
     */
    step: number;

    /**
     * Current value of the slider
     */
    value?: number | Signal<number>;

    /**
     * Default value for uncontrolled slider
     */
    defaultValue?: number;

    /**
     * Callback fired when value changes
     */
    onChange?: (value: number) => void;

    /**
     * Callback fired when slider loses focus
     */
    onBlur?: (event: FocusEvent) => void;

    /**
     * Format variant of the slider
     * @default "base"
     * - base: Full-featured with markers and labels
     * - prime: Minimal slider with optional value display
     */
    format?: SliderWrapperProps["format"];

    /**
     * Size of the slider track and handle
     * @default "md"
     */
    size?: SliderTrackProps["size"];

    /**
     * Border radius style
     * @default "rounded"
     */
    radius?: SliderTrackProps["radius"];

    /**
     * Control visibility of marker labels
     * @default { mid: false, edge: false }
     */
    truncate?: {
      /**
       * Hide middle marker numbers (show dots instead)
       * Only applies to "base" format
       */
      mid?: boolean;
      /**
       * Hide edge labels (min/max values)
       * Only applies to "base" format with edge labels
       */
      edge?: boolean;
    };

    /**
     * Show value input/display for "prime" format
     * @default false
     */
    showValue?: boolean;

    /**
     * Disable the slider
     * @default false
     */
    disabled?: boolean;

    /**
     * Custom children for advanced composition
     */
    children?: {
      /**
       * Track container wrapper
       */
      trackContainer?: SliderTrackContainerProps & {
        style?: JSX.SharedProps["style"];
      };

      /**
       * The track background
       */
      track?: SliderTrackProps & { style?: JSX.SharedProps["style"] };

      /**
       * The filled range indicator
       */
      range?: SliderRangeProps & { style?: JSX.SharedProps["style"] };

      /**
       * The draggable handle
       */
      handle?: SliderHandleProps & { style?: JSX.SharedProps["style"] };

      /**
       * Value display/input
       */
      value?: SliderValueProps & { style?: JSX.SharedProps["style"] };

      /**
       * Markers container
       */
      markers?: SliderMarkersProps & { style?: JSX.SharedProps["style"] };

      /**
       * Edge labels (min/max)
       */
      edgeLabels?: {
        min?: SliderEdgeLabelProps & { style?: JSX.SharedProps["style"] };
        max?: SliderEdgeLabelProps & { style?: JSX.SharedProps["style"] };
      };
    };
  };
