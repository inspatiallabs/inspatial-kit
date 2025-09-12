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
  ThemeFormat,
} from "@in/widget/theme/style.ts";
import {
KitBorderFormat,
  KitBorderPosition,
  KitBorderSize,
  KitBorderStyle,
} from "@in/widget/ornament/kit-border/index.ts";

//##############################################(TOPBAR item FORMATS)##############################################//

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
          position: "relative",
          backgroundColor: "var(--surface)",
          width: "100%",
        },
      },
    ],

    settings: {
      size: {
        xs: [
          {
            web: {
              height: "52px",
              minHeight: "52px",
              maxHeight: "52px",
            },
          },
        ],
        sm: [
          {
            web: {
              height: "56px",
              minHeight: "56px",
              maxHeight: "56px",
            },
          },
        ],
        md: [
          {
            web: {
              height: "64px",
              minHeight: "64px",
              maxHeight: "64px",
            },
          },
        ],
        lg: [
          {
            web: {
              height: "72px",
              minHeight: "72px",
              maxHeight: "72px",
            },
          },
        ],
        xl: [
          {
            web: {
              height: "80px",
              minHeight: "80px",
              maxHeight: "80px",
            },
          },
        ],
        "2xl": [
          {
            web: {
              height: "88px",
              minHeight: "88px",
              maxHeight: "88px",
            },
          },
        ],
        "3xl": [
          {
            web: {
              height: "96px",
              minHeight: "96px",
              maxHeight: "96px",
            },
          },
        ],
      },
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
      size: "sm",
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
    item: createStyle({
      name: "topbar-left-item",
    }),
  },

  /**=============================== Right =============================== */
  right: {
    container: createStyle({
      name: "topbar-right-container",
    }),
    item: createStyle({
      name: "topbar-right-item",
    }),
  },

  /**=============================== Center =============================== */
  center: {
    container: createStyle({
      name: "topbar-center-container",
    }),
    item: createStyle({
      name: "topbar-center-item",
    }),
  },

  /**=============================== Border =============================== */
  border: createStyle({
    name: "topbar-border",

    // base: [
    //   {
    //     web: {
    //       backgroundColor: "yellow",
    //     },
    //   },
    // ],

    settings: {
      size: KitBorderSize,
      position: KitBorderPosition,
      format: KitBorderFormat,
      radius: ThemeRadius,
      disabled: ThemeDisabled,
    },

    composition: [
      {
        format: "brand",
        style: {
          web: {
            backgroundColor: "yellow",
            borderColor: "var(--brand)",
            height: "10px",
          },
        },
      },
    ],

    defaultSettings: {
      size: "md",
      position: "top",
      format: "brand",
      radius: "none",
      disabled: false,
    },
  }),
};
