import { createStyle } from "@in/style";
import {
  TextInputActionBase,
  TextInputFieldBase,
  TextInputWrapperBase,
} from "../style.ts";
import {
  ThemeAxis,
  ThemeDisabled,
  ThemeEffect,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";
import { ThemeBoxSize } from "@in/widget/theme";
import { ButtonFormat } from "@in/widget/ornament/button/style.ts";

/*################################(NUMBERFIELD STYLE)################################*/
export const NumberFieldStyle = {
  /*=========================(Wrapper)=========================*/
  wrapper: createStyle({
    name: "numberfield-wrapper",
    base: [TextInputWrapperBase],

    settings: {
      radius: ThemeRadius,
      effect: ThemeEffect,
      disabled: ThemeDisabled,
    },

    defaultSettings: {
      radius: "none",
      effect: "hollow",
      disabled: false,
    },
  }),

  /*=========================(Field)=========================*/
  field: createStyle({
    name: "numberfield-field",
    base: [TextInputFieldBase],
  }),

  /*=========================(Action)=========================*/
  action: createStyle({
    name: "numberfield-action",
    base: [TextInputActionBase],
    settings: {
      format: ButtonFormat,
      size: ThemeBoxSize,
      scale: ThemeScale,
      axis: ThemeAxis,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      format: "surface",
      size: "sm",
      disabled: false,
    },
    composition: [
      {
        "$numberfield-wrapper.radius": "full",
        style: {
          web: {
            borderRadius: "100%",
          },
        },
      },
      // others will automatically inherit the radius from the wrapper unless specified otherwise
    ],
  }),
};
