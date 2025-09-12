import { createStyle } from "@in/style/index.ts";
import {
  ThemeDisabled,
  ThemeMaterial,
  ThemeEffect,
  ThemeMode,
  ThemeRadius,
  ThemeBoxSize,
  ThemeScale,
  ThemeSpacing,
  ThemeView,
  ThemeTypography,
} from "@in/widget/theme/style.ts";

//##############################################(TOPBAR ANCHOR FORMATS)##############################################//

const megaFull = [
  {
    web: {
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%",
      alignItems: "center",
    },
  },
];

const compact = [
  {
    web: {
      position: "absolute",
      left: "50%",
      top: "50px",
      transform: "translateX(-50%)",
      background: "var(--background)",
      zIndex: 10,
      boxShadow: ThemeEffect.base,
      borderRadius: "0 0 0.5rem 0.5rem",
      border: "1px solid var(--border)",
      padding: 0,
      minWidth: "250px",
      width: "max-content",
      maxWidth: "320px",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      transition: "all 200ms ease-in-out",
      marginTop: 0,
      overflow: "visible",
      justifyContent: "center",
    },
  },
];

/*####################################(TOPBAR STYLES)####################################*/

export const TopbarStyle = {
  /**=============================== Wrapper =============================== */
  wrapper: createStyle({
    name: "topbar-wrapper",
    base: [
      {
        web: {
          display: "flex",
        },
      },
    ],

    settings: {
      radius: ThemeRadius,
      spacing: ThemeSpacing,
      view: ThemeView,
      scale: ThemeScale,
      effect: ThemeEffect,
      mode: ThemeMode,
      disabled: ThemeDisabled,
      material: ThemeMaterial,
    },

    defaultSettings: {
      radius: "none",
      spacing: "none",
      view: "base",
      scale: "none",
    },
  }),

  /**=============================== Left =============================== */
  left: {
    container: createStyle({
      name: "topbar-left-container",
    }),
    anchor: createStyle({
      name: "topbar-left-anchor",
    }),
  },

  /**=============================== Right =============================== */
  right: {
    container: createStyle({
      name: "topbar-right-container",
    }),
    anchor: createStyle({
      name: "topbar-right-anchor",
    }),
  },

  /**=============================== Center =============================== */
  center: {
    container: createStyle({
      name: "topbar-center-container",
    }),
    anchor: createStyle({
      name: "topbar-center-anchor",
    }),
  },

  /**=============================== Border =============================== */
  border: createStyle({
    name: "topbar-border",
    base: [
      {
        web: {
          display: "block",
        },
      },
    ],
    settings: {
      size: {
        xs: [
          {
            web: {
              width: "100%",
              borderWidth: "1px",
            },
          },
        ],
        sm: [
          {
            web: {
              width: "100%",
              borderWidth: "2px",
            },
          },
        ],
        md: [
          {
            web: {
              width: "100%",
              borderWidth: "3px",
            },
          },
        ],
        lg: [
          {
            web: {
              width: "100%",
              borderWidth: "4px",
            },
          },
        ],
        xl: [
          {
            web: {
              width: "100%",
              borderWidth: "5px",
            },
          },
        ],
      },
      position: {
        top: [
          {
            web: {
              borderTop: "solid",
            },
          },
        ],
        bottom: [
          {
            web: {
              borderBottom: "solid",
            },
          },
        ],
      },
      format: {
        solid: [
          {
            web: {
              borderStyle: "solid",
            },
          },
        ],
        dashed: [
          {
            web: {
              borderStyle: "dashed",
            },
          },
        ],
        dotted: [
          {
            web: {
              borderStyle: "dotted",
            },
          },
        ],
        double: [
          {
            web: {
              borderStyle: "double",
            },
          },
        ],
      },
      theme: {
        brand: [
          {
            web: {
              borderColor: "var(--brand)",
            },
          },
        ],
      },
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },

    defaultSettings: {
      size: "md",
      position: "top",
      format: "solid",
      theme: "brand",
      radius: "none",
      disabled: false,
    },
  }),
};
