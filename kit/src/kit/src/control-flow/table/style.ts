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
      {
        web: {
          pointerEvents: "auto",
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
                borderBottom: "1px solid var(--muted)",
              },
              "& th": {
                borderRight: "1px solid var(--muted)",
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
          },
          "& > tr:nth-child(even)": {
            backgroundColor: "var(--surface)",
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
          "px-4",
          "text-left",
          "align-middle",
          "font-medium",
          {
            web: {
              height: "38px",
              padding: "0 16px",
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
      "cursor-pointer print:block print:cursor-default print:hover:bg-transparent print:ml-0",
      {
        web: {
          cursor: "pointer",
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
          "hover:rounded-b-none",
          "hover:bg-(--background)",
          {
            web: {
              width: "100%",
              color: "var(--primary)",
              marginLeft: "-14px",
              "&:hover": {
                borderRadius: "0",
                backgroundColor: "var(--background)",
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
