// import { createStyle } from "@in/style/variant/index.ts";
// import { ThemeDisabled } from "../../theme/index.ts";

// //##############################################(CREATE STYLE)##############################################//

// export const CardStyle = {
//   wrapper: createStyle({
//     base: [
//       "pointer-events-auto",
//       {
//         web: {
//           pointerEvents: "auto",
//         },
//       },
//     ],

//     settings: {
//       //##########(FORMAT PROP)##########//
//       format: {
//         optionCard: [
//           "flex",
//           "flex-col",
//           "cursor-pointer",
//           "bg-inherit",
//           "hover:bg-(--surface)",
//           "border-[6px]",
//           "border-b-[24px]",
//           "border-(--muted)",
//           {
//             web: {
//               display: "flex",
//               flexDirection: "column",
//               cursor: "pointer",
//               backgroundColor: "inherit",
//               "&:hover": {
//                 backgroundColor: "var(--surface)",
//               },
//               border: "6px solid",
//               borderBottom: "24px solid",
//               borderColor: "var(--muted)",
//             },
//           },
//         ],
//       },

//       //##########(SIZE PROP)##########//
//       size: {
//         base: [
//           "w-full",
//           "min-h-fit",
//           "h-[500px]",
//           "rounded-2xl",
//           "text-base",
//           "leading-[22px]",
//           {
//             web: {
//               width: "100%",
//               minHeight: "fit-content",
//               height: "500px",
//               borderRadius: "24px",
//               fontSize: "16px",
//               lineHeight: "22px",
//             },
//           },
//         ],
//         sm: [
//           "px-2.5",
//           "w-full",
//           "h-full",
//           "max-h-[125px]",
//           "rounded-md",
//           "text-base",
//           "leading-none",
//           "tracking-tight",
//           {
//             web: {
//               padding: "10px",
//               width: "100%",
//               height: "100%",
//               maxHeight: "125px",
//               borderRadius: "8px",
//               fontSize: "16px",
//               lineHeight: "1",
//               letterSpacing: "0.2px",
//             },
//           },
//         ],
//       },

//       //##########(DISABLED PROP)##########//
//       disabled: ThemeDisabled,
//     },

//     defaultSettings: {
//       format: "optionCard",
//       size: "base",
//       disabled: false,
//     },
//   }),

//   /*******************************(HEADER)********************************/

//   header: createStyle({
//     base: [
//       "flex",
//       "flex-col",
//       "space-y-1.5",
//       "p-6",
//       {
//         web: {
//           display: "flex",
//           flexDirection: "column",
//           gap: "1.5",
//           padding: "24px",
//         },
//       },
//     ],

//     settings: {
//       //##########(SIZE PROP)##########//
//       size: {
//         base: [
//           "text-(--text-base)",
//           "font-(--heading)",
//           {
//             web: {
//               fontSize: "16px",
//               fontFamily: "var(--font-heading)",
//             },
//           },
//         ],
//       },
//     },

//     defaultSettings: {
//       size: "base",
//     },
//   }),

//   /*******************************(TITLE)********************************/

//   title: createStyle({
//     base: [
//       "text-(--text-base)",
//       "font-heading",
//       {
//         web: {
//           fontSize: "16px",
//           fontFamily: "var(--font-heading)",
//         },
//       },
//     ],
//   }),

//   /*******************************(DESCRIPTION)********************************/

//   description: createStyle({
//     base: [
//       "text-xs",
//       "text-(--secondary)",
//       "text-center",
//       "max-w-[250px]",
//       {
//         web: {
//           fontSize: "12px",
//           color: "var(--secondary)",
//           textAlign: "center",
//           maxWidth: "250px",
//         },
//       },
//     ],
//   }),

//   /*******************************(CONTENT)********************************/

//   content: createStyle({
//     base: [
//       "flex",
//       "flex-col",
//       "w-full",
//       "h-auto",
//       "m-auto",
//       "justify-center",
//       "items-center",
//       "p-6",
//       "pt-0",
//       "gap-10",
//       {
//         web: {
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           height: "auto",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "24px",
//           paddingTop: "0",
//           gap: "40px",
//         },
//       },
//     ],
//   }),

//   /*******************************(FOOTER)********************************/

//   footer: createStyle({
//     base: [
//       "flex",
//       {
//         web: {
//           display: "flex",
//         },
//       },
//     ],
//   }),
// };
