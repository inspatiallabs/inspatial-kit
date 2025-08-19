import { createStyle } from "@in/style";

/*################################(INPUT STYLE)################################*/
export const InputFieldStyle = createStyle({
  /*******************************(Base)********************************/
  base: [
    "flex w-full rounded-md px-3 py-2 text-sm outline-none focus:outline-none",
    {
      web: {
        display: "flex",
        height: "2.5rem", // h-10
        width: "100%",
        borderRadius: "0.375rem", // rounded-md
        paddingLeft: "0.75rem", // px-3
        paddingRight: "0.75rem",
        paddingTop: "0.5rem", // py-2
        paddingBottom: "0.5rem",
        fontSize: "0.875rem", // text-sm
        lineHeight: "1.25rem",
        outline: "none",
        "&:focus": {
          outline: "none",
        },
      },
    },
  ],

  /*******************************(Settings)********************************/
  settings: {
    //##############################################(FORMAT PROP)##############################################//
    format: {
      base: [
        "bg-(--muted) text-(--primary) shadow-(--shadow-hollow)",
        {
          web: {
            backgroundColor: "var(--muted)",
            color: "var(--primary)",
            boxShadow: "var(--shadow-hollow)",
          },
        },
      ],
      outline: [
        "border-2 border-(--brand) bg-(--muted)",
        {
          web: {
            border: "2px solid var(--brand)",
            backgroundColor: "var(--muted)",
          },
        },
      ],
      filled: [
        "bg-(--muted) border-0",
        {
          web: {
            backgroundColor: "var(--muted)",
            border: "none",
          },
        },
      ],
    },

    //##############################################(STATE PROP)##############################################//
    state: {
      idle: "",
      // hover: [
      //   "hover:shadow-hollow",
      //   {
      //     web: {
      //       "&:hover": {
      //         boxShadow: "var(--shadow-hollow, 0 0 0 1px rgba(0,0,0,0.1))",
      //       },
      //     },
      //   },
      // ],
      typing: [
        "",
        {
          web: {},
        },
      ],
      speaking: [
        "bg-(--brand)",
        {
          web: {
            backgroundColor: "var(--brand)",
          },
        },
      ],
      disabled: [
        "cursor-not-allowed opacity-20 ",
        {
          web: {
            cursor: "not-allowed",
            opacity: "0.2",
          },
        },
      ],
      // error: [
      //   "border-(--color-red-500) outline-2 outline-(--color-red-500)",
      //   {
      //     web: {
      //       borderColor: "var(--color-red-500)",
      //       outline: "2px solid var(--color-red-500)",
      //     },
      //   },
      // ],
      // success: [
      //   "border-(--color-green-500) outline-2 outline-(--color-green-500)",
      //   {
      //     web: {
      //       borderColor: "var(--color-green-500)",
      //       outline: "2px solid var(--color-green-500)",
      //     },
      //   },
      // ],
    },

    //##############################################(SIZE PROP)##############################################//
    size: {
      xs: [
        "h-8 px-2 py-1 text-xs",
        {
          web: {
            height: "2rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
            fontSize: "0.75rem",
            lineHeight: "1rem",
          },
        },
      ],
      sm: [
        "h-9 px-3 py-2 text-sm",
        {
          web: {
            height: "2.25rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          },
        },
      ],
      base: [
        "h-10 px-3 py-2 text-sm",
        {
          web: {
            height: "2.5rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          },
        },
      ],
      lg: [
        "h-12 px-4 py-3 text-base",
        {
          web: {
            height: "3rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            fontSize: "1rem",
            lineHeight: "1.5rem",
          },
        },
      ],
    },
  },

  /*******************************(Default Settings)********************************/
  defaultSettings: {
    format: "base",
    state: "idle",
    size: "lg",
  },
});
