import { createStyle } from "@in/style";

export const DividerStyle = {
  /*####################################(LEFT)####################################*/
  left: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "fit-content",
          height: "1px",
          maxHeight: "2px",
          flex: "m-auto",
          backgroundColor: "var(--background)",
        },
      },
    ],
  }),

  /*####################################(RIGHT)####################################*/
  right: createStyle({
    base: [
      {
        web: {
          width: "100%",
          minWidth: "fit-content",
          height: "1px",
          maxHeight: "2px",
          flex: "m-auto",
          backgroundColor: "var(--background)",
        },
      },
    ],
  }),

  /*####################################(MIDDLE)####################################*/

  middle: createStyle({
    base: [
      {
        web: {
          display: "flex",
          background: "inherit",
          justifyContent: "center",
          textAlign: "center",
          padding: "4px",
          borderRadius: "full",
          fontSize: "base",
          color: "var(--secondary)",
          margin: "auto",
        },
      },
    ],
  }),

  /*####################################(WRAPPER)####################################*/
  wrapper: createStyle({
    base: [
      {
        web: {
          display: "flex",
          width: "100%",
        },
      },
    ],
  }),
};
