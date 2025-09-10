import { createStyle } from "@in/style";
import {
  ThemeDisabled,
  ThemeRadius,
  ThemeScale,
} from "@in/widget/theme/style.ts";

export const SidebarStyle = {
  /*################################(Main Wrapper)################################*/
  wrapper: createStyle({
    /*===================(Name)===================*/

    name: "sidebar-wrapper",

    /*===================(Base)===================*/
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "16px",
          height: "100%",
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-effect)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          paddingTop: "16px",
          paddingBottom: "16px",
        },
      },
    ],
    /***********************(Settings)************************/
    settings: {
      size: {
        xs: [
          {
            web: {
              width: "52px",
              minWidth: "52px",
              maxWidth: "52px",
              alignItems: "center",
            },
          },
        ],
        sm: [
          {
            web: {
              width: "56px",
              minWidth: "56px",
              maxWidth: "56px",
              alignItems: "center",
            },
          },
        ],
        md: [
          {
            web: {
              width: "64px",
              minWidth: "64px",
              maxWidth: "64px",
              alignItems: "center",
            },
          },
        ],
        lg: [
          {
            web: {
              width: "100px",
              minWidth: "100px",
              maxWidth: "100px",
              alignItems: "center",
            },
          },
        ],
        xl: [
          {
            web: {
              width: "228px",
              minWidth: "228px",
              maxWidth: "228px",
            },
          },
        ],
        "2xl": [
          {
            web: {
              width: "300px",
              minWidth: "300px",
              maxWidth: "300px",
            },
          },
        ],
        "3xl": [
          {
            web: {
              width: "428px",
              minWidth: "428px",
              maxWidth: "428px",
            },
          },
        ],
      },
      /***********************(Disabled)************************/

      scale: ThemeScale,

      /***********************(Disabled)************************/

      disabled: ThemeDisabled,
    },

    /*===================(Default Settings)===================*/
    defaultSettings: {
      size: "xl",
      scale: "5xs",
      disabled: false,
    },
  }),

  /*################################(Header Section)################################*/
  header: createStyle({
    name: "sidebar-header",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "red",
        },
      },
    ],
  }),

  /*################################(Footer Section)################################*/
  footer: createStyle({
    name: "sidebar-footer",
    base: [
      {
        web: {
          marginTop: "auto",
          borderTop: "1px solid var(--background)",
          padding: "0.75rem",
        },
      },
    ],
  }),

  /*################################(Section)################################*/
  section: createStyle({
    name: "sidebar-section",
    base: [
      {
        web: {
          width: "100%",
        },
      },
    ],
  }),

  /*################################(Group)################################*/
  group: createStyle({
    name: "sidebar-group",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          transition: "all 0.2s ease",
          overflow: "hidden",

          // Default expanded state
          backgroundColor: "var(--background)",
          borderRadius: "0 0 10px 10px",
          padding: "10px",

          // Minimized state using selector - hide group when minimized
          ".sidebar-minimized &": {
            display: "none",
          },
        },
      },
    ],

    settings: {
      disabled: ThemeDisabled,
    },

    defaultSettings: {
      disabled: false,
    },
  }),

  /*################################(Item)################################*/
  item: createStyle({
    name: "sidebar-item",
    base: [
      {
        web: {
          display: "flex",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.2s ease",
          color: "var(--primary)",

          // Default expanded state
          justifyContent: "start",
          alignItems: "center",
          gap: "8px",

          // Hover state
          "&:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
            backgroundBlendMode: "color-dodge, normal, normal",
            opacity: "0.6",
          },

          // Minimized state using selector
          ".sidebar-minimized &": {
            justifyContent: "center",
            alignItems: "center",
          },
        },
      },
    ],
    settings: {
      active: {
        true: [
          {
            web: {
              backgroundColor: "var(--brand)",
              color: "var(--primary)",
              fontWeight: "500",
              "&:hover": {
                background:
                  "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--brand))",
                backgroundBlendMode: "color-dodge, normal, normal",
                opacity: "0.6",
              },
            },
          },
        ],
        false: [
          {
            web: {
              // Default styles already applied in base
            },
          },
        ],
      },

      /***********************(Scale)************************/

      scale: ThemeScale,

      /***********************(Radius)************************/

      radius: ThemeRadius,

      /***********************(Disabled)************************/

      disabled: ThemeDisabled,
    },
    defaultSettings: {
      active: false,
      scale: "10xs",
      radius: "md",
      disabled: false,
    },
  }),

  /*################################(Toggle)################################*/

  toggle: createStyle({
    name: "sidebar-toggle",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2rem",
          height: "2.5rem",
          backgroundColor: "var(--background)",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        },
      },
    ],
  }),

  /*################################(Pluck)################################*/
  pluck: createStyle({
    name: "sidebar-pluck",
    base: [
      {
        web: {
          position: "absolute",
          left: "0",
          backgroundColor: "var(--brand)",
          borderTopRightRadius: "50%",
          borderBottomRightRadius: "50%",
          transition: "all 0.3s ease",
        },
      },
    ],
  }),
};
