import {
  ThemeAxis,
  ThemeBoxSize,
  ThemeDisabled,
  ThemeEffect,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";
import { ButtonFormat } from "@in/widget/ornament/button/style.ts";


/*################################(TEXT INPUT FIELD BASE STYLE)################################*/
// NOTE: Text Input is different from TextField.
// NOTE: TextField is a variant of TextInput.
// NOTE: TextInput is a variant of InputField.

export const TextInputFieldBase = {
  web: {
    display: "flex",
    height: "2.5rem", // h-10
    width: "100%",
    paddingLeft: "0.75rem", // px-3
    paddingRight: "0.75rem",
    paddingTop: "0.5rem", // py-2
    paddingBottom: "0.5rem",
    fontSize: "0.875rem", // text-sm
    lineHeight: "1.25rem",
    outline: "none",
    appearance: "textfield",
    MozAppearance: "textfield",
    "::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: "0",
    },
    "::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: "0",
    },
    "&:focus": {
      outline: "none",
    },
  },
} as const;

/*################################(TEXT INPUT SIZE BASE STYLE)################################*/

export const TextInputSizeBase = {
  xs: [
    {
      web: {
        height: "2rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingTop: "0.25rem",
        paddingBottom: "0.25rem",
        fontSize: "0.75rem",
        lineHeight: "1rem",
      },
    },
  ],
  sm: [
    {
      web: {
        height: "2.25rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      },
    },
  ],
  base: [
    {
      web: {
        height: "2.5rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      },
    },
  ],
  lg: [
    {
      web: {
        height: "3rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
    },
  ],
} as const;

/*################################(TEXT INPUT WRAPPER BASE STYLE)################################*/

export const TextInputWrapperBase = {
  web: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--muted)",
    padding: "0px 6px",
  },
} as const;

/*################################(TEXT INPUT FORMAT STYLE)################################*/
export const TextInputFormat = {
  base: [
    {
      web: {
        outline: "none",
      },
    },
  ],
  outline: [
    {
      web: {
        outlineStyle: "solid",
        outlineWidth: "2px",
      },
    },
  ],
} as const;

/*################################(TEXT INPUT WRAPPER SETTINGS)################################*/
export const TextInputWrapperSettings = {
  format: TextInputFormat,
  radius: ThemeRadius,
  effect: ThemeEffect,
  size: TextInputSizeBase,
  disabled: ThemeDisabled,
} as const;

/*################################(TEXT INPUT ACTION BASE STYLE)################################*/

export const TextInputActionBase = {
  web: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
} as const;

/*################################(TEXT INPUT ACTION SETTINGS)################################*/
export const TextInputActionSettings = {
  format: ButtonFormat,
  size: ThemeBoxSize,
  scale: ThemeScale,
  axis: ThemeAxis,
  disabled: ThemeDisabled,
} as const;
