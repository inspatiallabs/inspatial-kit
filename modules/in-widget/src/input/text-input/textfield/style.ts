import { createStyle } from "@in/style";
import {
  TextInputActionBase,
  TextInputActionSettings,
  TextInputFieldBase,
  TextInputWrapperBase,
  TextInputWrapperSettings,
} from "../style.ts";

/*################################(TEXTFIELD STYLE)################################*/
export const TextFieldStyle = {
  /*=========================(Wrapper)=========================*/
  // The layout wrapper for the input field and the action
  wrapper: createStyle({
    name: "textfield-wrapper",
    base: [TextInputWrapperBase],

    settings: {
      ...TextInputWrapperSettings,
    },

    defaultSettings: {
      radius: "md",
      effect: "hollow",
      disabled: false,
    },
  }),

  /*=========================(Field)=========================*/
  // The input field
  field: createStyle({
    name: "textfield-field",
    base: [TextInputFieldBase],
  }),

  /*=========================(Action)=========================*/
  // The call to action inside the field i.e unit-changer, dictatate, clear, search  etc...
  action: createStyle({
    name: "textfield-action",
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
        "$textfield-wrapper.radius": "full",
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
