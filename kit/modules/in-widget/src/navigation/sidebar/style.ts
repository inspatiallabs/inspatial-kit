import { createStyle } from "@in/style";
import { ThemeDisabled } from "@in/widget/theme/style.ts";

export const SidebarStyle = {
  /*################################(Main Wrapper)################################*/
  wrapper: createStyle({
    name: "sidebar-wrapper",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow-effect)",
          transition: "all 0.3s ease",
          position: "relative",
          overflowY: "auto",
          padding: "1rem",
        },
      },
    ],
    settings: {
      format: {
        minimized: [
          {
            web: {
              backgroundColor: "yellow",
              minWidth: "60px",
              maxWidth: "60px",
            },
          },
        ],
        expanded: [
          {
            web: {
              backgroundColor: "blue",
              minWidth: "228px",
              maxWidth: "228px",
            },
          },
        ],
      },
    },
    defaultSettings: {
      format: "expanded",
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
          width: "100%",
          transition: "all 0.2s ease",
        },
      },
    ],
  }),

  /*################################(Item)################################*/
  item: createStyle({
    name: "sidebar-item",
    base: [
      {
        web: {
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          gap: "10px",
          backgroundColor: "green",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
        },
      },
    ],
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
