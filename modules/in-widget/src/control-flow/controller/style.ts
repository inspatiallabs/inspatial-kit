import { createStyle } from "@in/style";

/*####################################(CONTROLLER STYLE)####################################*/
export const ControllerStyle = {
  /*==============================(ROOT)==============================*/
  root: createStyle({
    base: [
      {
        web: {
          width: "100%",
          height: "100%",
          padding: "16px",
          gap: "16px",
        },
      },
    ],
  }),
  /*==============================(WRAPPER)==============================*/
  wrapper: createStyle({
    base: [
      {
        web: {
          width: "auto",
          height: "auto",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
    ],
  }),
  /*==============================(LABEL)==============================*/
  label: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "40%",
          maxWidth: "40%",
        },
      },
    ],
  }),
  /*==============================(COLOR)==============================*/
  color: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(NUMBERFIELD)==============================*/
  numberfield: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(SWITCH)==============================*/
  switch: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(CHECKBOX)==============================*/
  checkbox: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(TAB)==============================*/
  tab: createStyle({
    base: [
      {
        web: {
          width: "100%",
        },
      },
    ],
  }),
  /*==============================(SELECT)==============================*/
  select: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(RADIO)==============================*/
  radio: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
  /*==============================(NOT SUPPORTED)==============================*/
  notSupported: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "60%",
          maxWidth: "100%",
        },
      },
    ],
  }),
};
