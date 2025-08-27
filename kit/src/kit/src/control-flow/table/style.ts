import { createStyle } from "@in/style";

/*#################################(CELL STYLES)#################################*/

// export const cellStyle = `
//   cursor-pointer print:block text-primary ml-[-14px] hover:rounded-b-none w-full hover:bg-background hover:text-primary
//   print:cursor-default print:hover:bg-transparent print:ml-0
// `;

// export const cellStyleSpan =
//   "flex cursor-pointer w-full h-auto items-center justify-start text-sm print:cursor-default";


export const TableStyle = createStyle({
  base: [
    "pointer-events-auto",
    {
      web: {
        pointerEvents: "auto",
      },
    },
  ],
  settings: {
    /*####################################(TABLE HEADER)####################################*/
    header: {
      base: [
        "[&_tr]:border-b border-(--muted)",
        {
          web: {
            "& tr": {
              borderBottom: "1px solid var(--muted)",
            },
          },
        },
      ],
    },
    /*####################################(TABLE BODY)####################################*/
    body: {
      base: [
        "[&_tr:last-child]:border-0",
        {
          web: {
            "& tr:last-child": {
              borderBottom: "0px solid var(--muted)",
            },
          },
        },
      ],
    },
    /*####################################(TABLE FOOTER)####################################*/
    footer: {
      base: [
        "border-t bg-(--muted)/50 font-medium [&>tr]:last:border-b-0",
        {
          web: {
            "& tr:last-child": {
              borderBottom: "0px solid var(--muted)",
              backgroundColor: "var(--muted)/50",
              fontWeight: "medium",
              "& tr:last-child": {
                borderBottom: "0px solid var(--muted)",
              },
            },
          },
        },
      ],
    },
    /*####################################(TABLE ROW)####################################*/
    row: {
      base: [
        "border-b transition-colors hover:bg-(--muted)/50 data-[state=selected]:bg-(--muted)",
        {
          web: {
            "& tr": {
              borderBottom: "1px solid var(--muted)",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--muted)/50",
              },
              "&[data-state=selected]": {
                backgroundColor: "var(--muted)",
              },
            },
          },
        },
      ],
    },
    /*####################################(TABLE HEAD)####################################*/
    head: {
      base: [
        "h-12 px-4 text-left align-middle font-medium text-(--muted) [&:has([role=checkbox])]:pr-0",
        {
          web: {
            "& th": {
              height: "48px",
              padding: "0 16px",
              textAlign: "left",
              verticalAlign: "middle",
              fontWeight: "medium",
              color: "var(--muted)",
              "&:has([role=checkbox])": {
                paddingRight: "0px",
              },
            },
          },
        },
      ],
    },
    /*####################################(TABLE CELL)####################################*/
    cell: {
      base: [
        "p-4 text-base align-middle [&:has([role=checkbox])]:pr-0",
        {
          web: {
            "& td": {
              padding: "16px",
              textAlign: "left",
              verticalAlign: "middle",
            },
          },
        },
      ],
    },
    /*####################################(TABLE CAPTION)####################################*/
    caption: {
      base: [
        "mt-4 text-sm text-(--muted)",
        {
          web: {
            "& caption": {
              marginTop: "16px",
              fontSize: "12px",
              color: "var(--muted)",
            },
          },
        },
      ],
    },
  },
  defaultSettings: {
    header: "base",
    body: "base",
    footer: "base",
    row: "base",
    head: "base",
    cell: "base",
    caption: "base",
  },
});
