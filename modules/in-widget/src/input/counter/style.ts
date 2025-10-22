import { createStyle } from "@in/style";
import {
  ThemeAxis,
  ThemeBoxSize,
  ThemeDisabled,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";
import { ButtonFormat } from "@in/widget/ornament/button/index.ts";

/*####################################(COUNTER STYLE)####################################*/
export const CounterStyle = {
  /**============================= WRAPPER =============================*/

  wrapper: createStyle({
    name: "counter-wrapper",
    base: [
      {
        web: {
          display: "flex",
          gap: "2px",
          // border: "2px solid var(--background)",
        },
      },
    ],
    settings: {
      axis: ThemeAxis,
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },
    composition: [
      {
        "$counter-wrapper.axis": "x",
        style: {
          web: {
            flexDirection: "row-reverse",
          },
        },
      },
      {
        "$counter-wrapper.axis": "y",
        style: {
          web: {
            flexDirection: "column",
          },
        },
      },
    ],
    defaultSettings: {
      axis: "x",
      radius: "md",
      disabled: false,
    },
  }),

  /**============================= INCREMENT =============================*/
  increment: createStyle({
    name: "counter-increment",
    base: [
      {
        web: {
          display: "flex",
        },
      },
    ],
    settings: {
      format: ButtonFormat,
      size: ThemeBoxSize,
      scale: ThemeScale,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      format: "background",
      size: "base",
      scale: "none",
      disabled: false,
    },
    composition: [
      {
        "$counter-wrapper.axis": "x",
        style: {
          web: {
            borderBottomLeftRadius: "0px",
            borderTopLeftRadius: "0px",
          },
        },
      },
      {
        "$counter-wrapper.axis": "y",
        style: {
          web: {
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        },
      },
    ],
  }),

  /**============================= FORMAT =============================*/
  //   format: createStyle({
  //     name: "counter-format-wrapper",
  //     base: [
  //       {
  //         web: {
  //           display: "flex",
  //           padding: "3px",
  //         },
  //       },
  //     ],
  //   }),

  /**============================= DECREMENT =============================*/
  decrement: createStyle({
    name: "counter-decrement",
    base: [
      {
        web: {
          display: "flex",
        },
      },
    ],
    settings: {
      format: ButtonFormat,
      size: ThemeBoxSize,
      scale: ThemeScale,
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      format: "background",
      size: "base",
      scale: "none",
      radius: "md",
      disabled: false,
    },
    composition: [
      {
        "$counter-wrapper.axis": "x",
        style: {
          web: {
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          },
        },
      },
      {
        "$counter-wrapper.axis": "y",
        style: {
          web: {
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          },
        },
      },
    ],
  }),

  /**============================= RESET =============================*/
  reset: createStyle({
    name: "counter-reset",
    base: [
      {
        web: {
          display: "flex",
        },
      },
    ],
    settings: {
      format: ButtonFormat,
      size: ThemeBoxSize,
      scale: ThemeScale,
      radius: ThemeRadius,
      axis: ThemeAxis,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      format: "base",
      size: "md",
      scale: "none",
      radius: "md",
      axis: "x",
      disabled: false,
    },
  }),
};
