import { createStyle } from "@in/style";
import {
  ThemeBoxSize,
  ThemeDisabled,
  ThemeMaterial,
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
          overflow: "visible",
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
              width: "96px",
              minWidth: "96px",
              maxWidth: "96px",
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
          gap: "4px",
          // Hide header title when sidebar is minimized (SSC)
          ".sidebar-minimized & .sidebar-header-title": {
            display: "none",
          },
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

  /*################################(Group)################################*/
  group: {
    container: createStyle({
      name: "sidebar-group",
      base: [
        {
          web: {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            width: "100%",
            transition: "all 0.2s ease",
            overflow: "visible",

            ".sidebar-minimized &": {
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
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

    header: {
      head: createStyle({
        name: "sidebar-group-header",
        base: [
          {
            web: {
              display: "flex",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.2s ease",
              color: "var(--primary)",
              outline: "none",
              ring: "none",

              justifyContent: "start",
              alignItems: "center",
              gap: "8px",

              "&:hover": {
                background:
                  "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--color-inherit))",
                backgroundBlendMode: "color-dodge, normal, normal",
                opacity: "0.6",
              },

              // Show header indicator ONLY when a child is active (independent of click state)
              ".sidebar-group.sidebar-group-expanded:has(.sidebar-item-active) & .sidebar-indicator":
                {
                  display: "block",
                },
              ".sidebar-group & .sidebar-indicator": {
                display: "none",
              },

              // When expanded and any child is active, tint header
              ".sidebar-group.sidebar-group-expanded:has(.sidebar-item-active) &":
                {
                  backgroundColor: "var(--background)",
                  borderRadius: "var(--radius-none)",
                  borderTopLeftRadius: "var(--radius-lg)",
                },
            },
          },
        ],

        settings: {
          scale: ThemeScale,
          radius: ThemeRadius,
          disabled: ThemeDisabled,
        },
        defaultSettings: {
          scale: "12xs",
          radius: "md",
          disabled: false,
        },
      }),
      title: createStyle({
        name: "sidebar-group-header-title",
        base: [
          {
            web: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              transition: "all 0.2s ease",

              ".sidebar-minimized &": {
                display: "none",
              },
            },
          },
        ],
      }),
    },

    children: createStyle({
      name: "sidebar-group-children",
      base: [
        {
          web: {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            gap: "8px",
            backgroundColor: "var(--background)",
            borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
            padding: "10px",

            ".sidebar-minimized &": {
              display: "none",
            },
          },
        },
      ],
    }),
  },

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
          outline: "none",
          ring: "none",

          // Default expanded state
          justifyContent: "start",
          alignItems: "center",
          gap: "8px",

          // Hover state
          "&:hover": {
            background:
              "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--color-inherit))",
            backgroundBlendMode: "color-dodge, normal, normal",
            opacity: "0.6",
          },

          // Minimized state using selector
          ".sidebar-minimized &": {
            justifyContent: "center",
            alignItems: "center",
          },

          // Hide item title when minimized (SSC)
          ".sidebar-minimized & .sidebar-item-title": {
            display: "none",
          },

          // Peer-checked (native radio inside item)
          '&:has(input[type="radio"]:checked)': {
            backgroundColor: "var(--brand)",
            color: "var(--primary)",
            cursor: "pointer",
            "&:hover": {
              background:
                "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--color-inherit))",
              backgroundBlendMode: "color-dodge, normal, normal",
              opacity: "0.6",
            },
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
              "&:hover": {
                background:
                  "radial-gradient(101.08% 100% at 50% 100%, rgba(94, 94, 94, 0.14) 0%, rgba(94, 94, 94, 0.00) 73.85%), radial-gradient(100.02% 100% at 50% 100%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.00) 55.59%), var(--color-inherit-default, var(--color-inherit))",
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
      scale: "12xs",
      radius: "md",
      disabled: false,
    },
  }),

  /*################################(Icon)################################*/
  icon: createStyle({
    name: "sidebar-icon",
    base: [
      {
        web: {
          backgroundColor: "inherit",
          fontSize: "12px",

          ".sidebar-minimized &": {},
        },
      },
    ],
    settings: {
      size: ThemeBoxSize,
      scale: ThemeScale,
      disabled: ThemeDisabled,
    },
    defaultSettings: {
      // size: "xs",
      // scale: "12xs",
      disabled: false,
    },
  }),

  /*################################(Toggle)################################*/

  toggle: createStyle({
    name: "sidebar-toggle",
    base: [
      {
        web: {
          cursor: "pointer",
          transition: "transform 0.2s ease",
        },
      },
    ],
    settings: {
      /***********************(Format)************************/
      format: {
        base: [
          {
            web: {
              backgroundColor: "var(--background)",
              color: "var(--secondary)",
              stroke: "var(--secondary)",
              fill: "var(--secondary)",

              "&:hover": {
                backgroundColor: "var(--surface)",
                color: "var(--primary)",
                stroke: "var(--primary)",
                fill: "var(--primary)",
                border: "2px solid var(--muted)",
              },
            },
          },
        ],
        modern: [
          {
            web: {
              backgroundColor: "var(--surface)",
              color: "var(--secondary)",
              stroke: "var(--secondary)",
              fill: "var(--secondary)",
              border: "4px solid var(--background)",

              "&:hover": {
                backgroundColor: "var(--surface)",
                color: "var(--primary)",
                stroke: "var(--primary)",
                fill: "var(--primary)",
                shadow: "var(--shadow-prime)",
              },
            },
          },
        ],
      },

      /***********************(Position)************************/
      position: {
        inline: [
          {
            web: {
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            },
          },
        ],
        top: [
          {
            web: {
              position: "absolute",
              right: "0",
              top: "10%",

              // ".sidebar-minimized &": {
              //   right: "50%",
              //   top: "50%",
              //   transform: "translate(-50%, -50%)",
              // },
            },
          },
        ],
        // center: [
        //   {
        //     web: {
        //       position: "absolute",
        //       right: "50%",
        //       top: "50%",
        //       transform: "translate(-50%, -50%)",
        //     },
        //   },
        // ],
      },

      /***********************(Size)************************/
      size: ThemeBoxSize,

      /***********************(Scale)************************/

      scale: ThemeScale,

      /***********************(Radius)************************/
      radius: ThemeRadius,

      /***********************(Material)************************/

      material: ThemeMaterial,

      /***********************(Disabled)************************/
      disabled: ThemeDisabled,
    },

    /*===================(Composition)===================*/
    composition: [
      {
        format: "modern",
        style: {
          web: {
            borderBottomLeftRadius: "var(--radius-none)",
            borderTopLeftRadius: "var(--radius-none)",
            borderTopRightRadius: "var(--radius-full)",
            borderBottomRightRadius: "var(--radius-full)",
          },
        },
      },
      {
        format: "modern",
        size: "xs",
        style: {
          web: {
            minWidth: "32px",
            minHeight: "40px",
          },
        },
      },
    ],

    /*===================(Default Settings)===================*/
    defaultSettings: {
      format: "modern",
      position: "top",
      size: "xs",
      scale: "10xs",
      radius: "md",
      material: "flat",
      disabled: false,
    },
  }),

  /*################################(Indicator)################################*/
  indicator: createStyle({
    name: "sidebar-indicator",
    base: [
      {
        web: {
          display: "flex",
          width: "8px",
          height: "60%",
          top: "50%",
          transform: "translateY(-50%)",
          position: "absolute",
          left: "-16px",
          backgroundColor: "var(--brand)",
          borderTopRightRadius: "var(--radius-full)",
          borderBottomRightRadius: "var(--radius-full)",
          transition: "all 0.3s ease",

          ".sidebar-minimized &": {
            width: "4px",
            left: "-2px",
            borderTopRightRadius: "var(--radius-md)",
            borderBottomRightRadius: "var(--radius-md)",
          },
        },
      },
    ],
  }),
};
