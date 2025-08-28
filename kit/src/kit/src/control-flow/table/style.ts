import { createStyle } from "@in/style";

/*#################################(TABLE STYLE)#################################*/

export const TableStyle = {
  //##############################################(WRAPPER)##############################################//
  wrapper: createStyle({
    base: [
      "relative",
      "pointer-events-auto",
      {
        web: {
          position: "relative",
          pointerEvents: "auto",
        },
      },
    ],
    settings: {
      format: {
        "1": [
          "min-w-full",
          {
            web: {
              minWidth: "100%",
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "1",
    },
  }),

  //##############################################(HEADER)##############################################//
  header: createStyle({
    base: [
      "pointer-events-auto",
      "bg-inherit",
      "hover:bg-var(--surface)",
      {
        web: {
          pointerEvents: "auto",
          backgroundColor: "inherit",
          "&:has(:hover)": {
            backgroundColor: "var(--surface)",
          },
        },
      },
    ],
    settings: {
      format: {
        "1": [
          "border-(--muted)",
          {
            web: {
              borderBottom: "2px solid var(--muted)",
              "& tr": {
                borderBottom: "2px solid var(--muted)",
              },
              "& th": {
                borderRight: "2px solid var(--muted)",
              },
              "& th:last-child": {
                borderRight: "0",
              },
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "1",
    },
  }),

  //##############################################(LIST/BODY)##############################################//
  list: createStyle({
    base: [
      "border-b-none",
      {
        web: {
          "& > tr:nth-child(odd)": {
            backgroundColor: "var(--background)",
            "&:hover": {
              backgroundColor: "var(--window)",
            },
          },
          "& > tr:nth-child(even)": {
            backgroundColor: "var(--surface)",
            "&:hover": {
              backgroundColor: "var(--window)",
            },
          },
          "& tr:last-child": {
            borderBottom: "0",
          },
        },
      },
    ],
  }),

  //##############################################(FOOTER)##############################################//
  footer: createStyle({
    base: [
      "border-t",
      "bg-(--muted)/50",
      "font-medium",
      {
        web: {
          borderTop: "2px solid var(--muted)",
          backgroundColor: "color-mix(in oklab, var(--muted) 50%, transparent)",
          fontWeight: "medium",
          "& > tr:last-child": {
            borderBottom: "0",
          },
        },
      },
    ],
  }),

  //##############################################(ROW)##############################################//
  row: createStyle({
    base: [""],
    settings: {
      format: {
        "1": [
          "bg-(--surface)",
          "border-b",
          "transition-colors",
          "hover:bg-(--muted)/50",
          "data-[state=selected]:bg-(--muted)",
          {
            web: {
              backgroundColor: "var(--surface)",
              borderBottom: "2px solid var(--muted)",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--muted)/50",
              },
              "&[data-state=selected]": {
                backgroundColor: "var(--muted)",
              },
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "1",
    },
  }),

  //##############################################(HEAD)##############################################//
  head: createStyle({
    base: [""],
    settings: {
      format: {
        "1": [
          "h-[38px]",
          "min-h-[38px]",
          "max-h-[38px]",

          "text-left",
          "align-middle",
          "font-medium",
          {
            web: {
              height: "38px",
              minHeight: "38px",
              maxHeight: "38px",
              textAlign: "left",
              verticalAlign: "middle",
              fontWeight: "medium",
              "&:has([role=checkbox])": {
                paddingRight: "0",
              },
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "1",
    },
  }),

  //##############################################(CELL)##############################################//
  cell: createStyle({
    base: [
      "cursor-pointer",
      "p-[16px]",
      "hover:rounded-none",
      "hover:bg-(--background)",

      "print:block",
      "print:cursor-default",
      "print:ml-0",
      "print:hover:bg-transparent",

      {
        web: {
          cursor: "pointer",
          padding: "16px",
          "&:hover": {
            borderRadius: "0",
            backgroundColor: "var(--background)",
          },
          "&:print": {
            display: "block",
            cursor: "default",
            marginLeft: "0",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
      },
    ],
    settings: {
      format: {
        "1": [
          "p-4 text-base align-middle [&:has([role=checkbox])]:pr-0",
          {
            web: {
              padding: "16px",
              textAlign: "left",
              verticalAlign: "middle",
              "&:has([role=checkbox])": {
                paddingRight: "0",
              },
            },
          },
        ],
        "2": [
          // Formerly cellStyle
          "w-full",
          "text-(--primary)",
          "ml-[-14px]",
          {
            web: {
              width: "100%",
              color: "var(--primary)",
              marginLeft: "-14px",
            },
          },
        ],
        "cell-span": [
          "flex",
          "cursor-pointer",
          "w-full",
          "h-38px",
          "min-h-38px",
          "max-h-38px",
          "items-center",
          "justify-start",
          "text-sm",
          "gap-[8px]",
          "print:cursor-default",
          "bg-none",
          {
            web: {
              display: "flex",
              cursor: "pointer",
              width: "100%",
              height: "38px",
              minHeight: "38px",
              maxHeight: "38px",
              alignItems: "center",
              justifyContent: "start",
              fontSize: "var(--font-size-sm)",
              gap: "8px",
              backgroundColor: "none",
            },
          },
        ],
      },
    },

    defaultSettings: {
      format: "1",
    },
  }),

  //##############################################(CAPTION)##############################################//
  caption: createStyle({
    base: [""],
    settings: {
      format: {
        "1": [
          "mt-4 text-sm text-(--muted)",
          {
            web: {
              marginTop: "16px",
              fontSize: "12px",
              color: "var(--muted)",
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "1",
    },
  }),
};
