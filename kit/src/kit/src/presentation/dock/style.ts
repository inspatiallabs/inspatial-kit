import { createStyle } from "@in/style";
import { PresentationStyle } from "../style.ts";

//##############################################(DOCK STYLE)##############################################//

export const DockStyle = {
  /*******************************(Overlay)********************************/

  overlay: PresentationStyle.overlay,

  /*******************************(Wrapper)********************************/

  wrapper: createStyle({
    base: [
      "fixed inset-0",
      "z-[2147483647]",
      "pointer-events-none",
      {
        web: {
          position: "fixed",
          inset: 0,
          zIndex: 2147483647,
          pointerEvents: "none",
        },
      },
    ],
  }),

  /*******************************(View)********************************/

  view: createStyle({
    base: [
      "absolute",
      "flex",
      "items-center",
      "rounded-full",
      "bg-(--brand)",
      "text-white",
      "shadow-subtle",
      "max-w-fit",
      "pointer-events-auto",
      {
        web: {
          position: "absolute",
          display: "flex",
          alignItems: "center",
          borderRadius: "1000px",
          backgroundColor: "var(--brand)",
          color: "white",
          boxShadow: "var(--shadow-subtle)",
          maxWidth: "fit-content",
          pointerEvents: "auto",
        },
      },
    ],
    settings: {
      direction: {
        top: [
          "top-4 left-1/2 -translate-x-1/2",
          "inmotion-position-top",
          "inmotion-slide-from-top",
          {
            web: {
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
            },
          },
        ],
        bottom: [
          "bottom-4 left-1/2 -translate-x-1/2",
          "inmotion-position-bottom",
          "inmotion-slide-from-bottom",
          {
            web: {
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
            },
          },
        ],
        left: [
          "left-4 top-1/2 -translate-y-1/2",
          "inmotion-position-left",
          "inmotion-slide-from-left",
          {
            web: {
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            },
          },
        ],
        right: [
          "right-4 top-1/2 -translate-y-1/2",
          "inmotion-position-right",
          "inmotion-slide-from-right",
          {
            web: {
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            },
          },
        ],
      },
      axis: {
        x: ["flex-row", { web: { flexDirection: "row" } }],
        y: ["flex-col", { web: { flexDirection: "column" } }],
      },
      padded: {
        true: ["p-2", { web: { padding: "0.5rem" } }],
        false: [""],
      },
    },
    defaultSettings: {
      direction: "bottom",
      axis: "x",
      padded: true,
    },
  }),

  /*******************************(Items)********************************/

  items: createStyle({
    base: [
      "flex gap-2",
      {
        web: {
          display: "flex",
          gap: "0.5rem",
        },
      },
    ],
    settings: {
      axis: {
        x: ["flex-row", { web: { flexDirection: "row" } }],
        y: ["flex-col", { web: { flexDirection: "column" } }],
      },
    },
    defaultSettings: {
      axis: "x",
    },
  }),

  /*******************************(Item)********************************/

  item: createStyle({
    base: [
      "group",
      "relative",
      "cursor-pointer",
      "flex items-center justify-center",
      "h-10 w-10",
      "aspect-square",
      "rounded-full",
      "bg-(--surface)",
      "text-(--primary)",
      "shadow-prime",
      "transition-transform duration-200",
      "hover:scale-110",
      "active:scale-95",
      {
        web: {
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "2.5rem",
          width: "2.5rem",
          aspectRatio: "1/1",
          borderRadius: "50%",
          backgroundColor: "var(--surface)",
          color: "var(--primary)",
          boxShadow: "var(--shadow-prime)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        },
      },
    ],
    settings: {},
    defaultSettings: {},
  }),

  /*******************************(Icon)********************************/

  icon: createStyle({
    base: [
      "flex",
      "items-center",
      "justify-center",
      "h-6 w-6",
      "text-(--brand)",
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "1.5rem",
          width: "1.5rem",
          color: "var(--brand)",
        },
      },
    ],
    settings: {},
  }),

  /*******************************(Label)********************************/

  label: createStyle({
    base: [
      "pointer-events-none",
      "absolute",
      "z-[9999]",
      "top-full",
      "mt-1",
      "left-1/2",
      "-translate-x-1/2",
      "px-2 py-0.5",
      "whitespace-nowrap",
      "rounded-md",
      "bg-(--surface)",
      "text-(--primary)",
      "text-xs",
      "shadow-prime",
      "opacity-0",
      "group-hover:opacity-100",
      "transition-opacity duration-150",
      {
        web: {
          pointerEvents: "none",
          position: "absolute",
          zIndex: 9999,
          top: "100%",
          marginTop: "0.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "0.125rem 0.5rem",
          whiteSpace: "nowrap",
          borderRadius: "0.375rem",
          backgroundColor: "var(--surface)",
          color: "var(--primary)",
          fontSize: "0.75rem",
          boxShadow: "var(--shadow-prime)",
          opacity: 0,
          transition: "opacity 0.15s ease-in-out",
        },
      },
    ],
    settings: {
      showOnHover: {
        true: [
          "opacity-0 group-hover:opacity-100",
          {
            web: {
              opacity: 0,
              ".group:hover &": {
                opacity: 1,
              },
            },
          },
        ],
        false: ["opacity-100", { web: { opacity: 1 } }],
      },
    },
    defaultSettings: {
      showOnHover: true,
    },
  }),

  /*******************************(Minimized Shell)********************************/

  minimizedShell: createStyle({
    base: [
      "cursor-pointer",
      "size-10",
      "flex items-center justify-center",
      "rounded-full",
      "bg-(--surface)",
      "shadow-prime",
      "transition-transform duration-200",
      "hover:scale-110",
      "active:scale-95",
      {
        web: {
          cursor: "pointer",
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-prime)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        },
      },
    ],
  }),
};
