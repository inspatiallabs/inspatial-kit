import { createStyle } from "@in/style";
import {
  TextInputActionBase,
  TextInputActionSettings,
  TextInputFieldBase,
  TextInputWrapperBase,
  TextInputWrapperSettings,
} from "../style.ts";

/*################################(NUMBERFIELD STYLE)################################*/
export const NumberFieldStyle = {
  /*=========================(Wrapper)=========================*/
  // The layout wrapper for the input field and the action
  wrapper: createStyle({
    name: "numberfield-wrapper",
    base: [TextInputWrapperBase],

    settings: {
      ...TextInputWrapperSettings,
    },

    defaultSettings: {
      format: "base",
      radius: "md",
      effect: "hollow",
      size: "base",
      disabled: false,
    },
  }),

  /*=========================(Field)=========================*/
  // The input field
  field: createStyle({
    name: "numberfield-field",
    base: [TextInputFieldBase],
  }),

  /*=========================(Action)=========================*/
  // The call to action inside the field i.e unit-changer, dictatate, clear, search  etc...
  action: createStyle({
    name: "numberfield-action",
    base: [TextInputActionBase],
    settings: {
      ...TextInputActionSettings,
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
