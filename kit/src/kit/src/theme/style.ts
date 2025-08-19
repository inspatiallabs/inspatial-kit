import { createStyle } from "@in/style";

/*################################(THEME STYLE)################################*/
// For the <ThemeController> Widget as well as global theme settings
//#############################################################################
export const ThemeStyle = createStyle({
  /*******************************(Base)********************************/
  base: [""],

  /*******************************(Settings)********************************/
  settings: {
    //##############################################(COMPONENT VARIANT PROP)##############################################//

    mode: {
      base: [""],
    },

    material: {
      base: [""],
    },

    // Theme (Shadow) Effect
    variant: {
      flat: [""],
      hollow: [""],
    },

    // Theme (Variable) Presets
    format: {
      inspatial: [""],
      amethyst: [""],
    },

    // typography: {
    //   base: [""],
    // },

    // radius: {
    //   base: [""],
    // },

    // scale: {
    //   base: [""],
    // },

    //##############################################(SIZE PROP)##############################################//
    size: {
      base: [
        "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4 ",
        {
          web: {
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      sm: [
        "h-[36px] min-w-[36px] min-h-[36px] max-h-[36px] max-w-full px-4",
        {
          web: {
            height: "36px",
            minWidth: "36px",
            minHeight: "36px",
            maxHeight: "36px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      md: [
        "h-[40px] min-w-[40px] min-h-[40px] max-h-[40px] max-w-full px-4",
        {
          web: {
            height: "40px",
            minWidth: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      lg: [
        "h-[48px] min-w-[48px] min-h-[48px] max-h-[48px] max-w-full px-4",
        {
          web: {
            height: "48px",
            minWidth: "48px",
            minHeight: "48px",
            maxHeight: "48px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
      xl: [
        "h-[52px] min-w-[52px] min-h-[52px] max-h-[52px] max-w-full px-4",
        {
          web: {
            height: "52px",
            minWidth: "52px",
            minHeight: "52px",
            maxHeight: "52px",
            maxWidth: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      ],
    },

    //##############################################(RADIUS PROP)##############################################//

    radius: {
      base: ["rounded-lg", { web: { borderRadius: "0.5rem" } }],
      sm: ["rounded-sm", { web: { borderRadius: "0.125rem" } }],
      md: ["rounded-md", { web: { borderRadius: "0.375rem" } }],
      lg: ["rounded-lg", { web: { borderRadius: "0.5rem" } }],
      xl: ["rounded-xl", { web: { borderRadius: "0.75rem" } }],
      full: ["rounded-full", { web: { borderRadius: "9999px" } }],
    },

    //##############################################(DISABLED PROP)##############################################//

    disabled: {
      true: [
        "opacity-disabled opacity-50 text-(--muted) pointer-events-none cursor-disabled",
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
            color: "var(--muted)",
          },
        },
      ],
      false: [""],
    },
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    mode: "base",
    material: "base",
    variant: "flat",
    format: "inspatial",
    size: "base",
    radius: "base",
    disabled: false,
  },
});
