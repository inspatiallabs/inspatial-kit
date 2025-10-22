import { createStyle } from "@in/style";
import {
  TextInputActionBase,
  TextInputActionSettings,
  TextInputFieldBase,
  TextInputWrapperBase,
  TextInputWrapperSettings,
} from "../style.ts";

/*################################(PASSWORDFIELD STYLE)################################*/
export const PasswordFieldStyle = {
  /*=========================(Wrapper)=========================*/
  // The layout wrapper for the input field and the action
  wrapper: createStyle({
    name: "passwordfield-wrapper",
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
    name: "passwordfield-field",
    base: [TextInputFieldBase],
  }),

  /*=========================(Action)=========================*/
  // The call to action inside the field i.e unit-changer, dictatate, clear, search  etc...
  action: createStyle({
    name: "passwordfield-action",
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
        "$passwordfield-wrapper.radius": "full",
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
