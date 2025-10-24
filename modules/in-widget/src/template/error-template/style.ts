import { createStyle } from "@in/style";

/*##################################(ERROR TEMPLATE STYLE)##################################*/
/**
 * ErrorTemplateStyle - Styling configuration for ErrorTemplate component
 *
 * Uses InSpatial createStyle API for cross-platform styling consistency
 *
 * Structure:
 * - root: Main container with centered layout
 * - wrapper: Error content container with red-themed styling
 * - header: Large, bold error title
 * - message: Primary error message
 * - description: Optional detailed description
 * - action: Action button container
 * - footer: Footer area for icon or additional content
 */
export const ErrorTemplateStyle = {
  /*==============================(ROOT)==============================*/
  root: createStyle({
    name: "error-template-root",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "32px",
          gap: "16px",
        },
      },
    ],
  }),

  /*==============================(WRAPPER)==============================*/
  wrapper: createStyle({
    name: "error-template-wrapper",
    base: [
      {
        web: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          gap: "16px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        },
      },
    ],
  }),

  /*==============================(HEADER)==============================*/
  header: createStyle({
    name: "error-template-header",
    base: [
      {
        web: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "700",
          color: "rgb(239, 68, 68)",
        },
      },
    ],
  }),

  /*==============================(MESSAGE)==============================*/
  message: createStyle({
    name: "error-template-message",
    base: [
      {
        web: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "rgb(185, 28, 28)",
          width: "100%",
        },
      },
    ],
  }),

  /*==============================(DESCRIPTION)==============================*/
  description: createStyle({
    name: "error-template-description",
    base: [
      {
        web: {
          textAlign: "center",
          color: "rgb(127, 29, 29)",
          width: "75%",
        },
      },
    ],
  }),

  /*==============================(ACTION)==============================*/
  action: createStyle({
    name: "error-template-action",
    base: [
      {
        web: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "8px",
        },
      },
    ],
  }),

  /*==============================(FOOTER)==============================*/
  footer: createStyle({
    name: "error-template-footer",
    base: [
      {
        web: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "16px",
          opacity: "0.7",
        },
      },
    ],
  }),
};
