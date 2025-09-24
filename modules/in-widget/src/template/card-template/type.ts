// import type { CardStyle } from "./style.ts";
// import type { StyleProps } from "@in/style/variant/index.ts";

// // type CardStyleProps = {
// //     wrapper: StyleProps<typeof CardStyle.wrapper>,
// //     header: StyleProps<typeof CardStyle.header>,
// //     title: StyleProps<typeof CardStyle.title>,
// //     description: StyleProps<typeof CardStyle.description>,
// //     content: StyleProps<typeof CardStyle.content>,
// //     footer: StyleProps<typeof CardStyle.footer>,
// // }


// // export type CardProps = JSX.SharedProps & CardStyleProps;



// import { createVariant, type VariantProps } from "@in/style/variant";
// import { SharedProps } from "@inspatial/type/util";
// import { type TextVariantType } from "../../typography/text/variant";
// import { PatternVariantType } from "../../pattern/variant";
// import { ButtonVariantType } from "../../ornament/button/variant";
// import { MediaVariantType } from "../../media/variant";



// //##############################################(CLASSES)##############################################//

// export const CardVariantClass = CardWidgetVariant.getVariant({
//   variant: "base",
// });
// export type CardVariant = typeof CardVariantClass;

// export const CardFormatClass = CardWidgetVariant.getVariant({
//   format: "base",
// });
// export type CardFormat = typeof CardFormatClass;

// export const CardLayoutClass = CardWidgetVariant.getVariant({
//   layout: "Left",
// });
// export type CardLayout = typeof CardLayoutClass;

// export const CardThemeClass = CardWidgetVariant.getVariant({
//   theme: "flat",
// });
// export type CardTheme = typeof CardThemeClass;

// // Conditional types for hover reveal properties
// export type HoverRevealProps = {
//   hoverRevealHeight?: string;
//   hoverRevealMaxHeight?: string;
// };

// //##############################################(TYPES)##############################################//
// // Conditional type that adds hover reveal props only when format is "hoverReveal"
// export type CardWidgetVariantType = VariantProps<typeof CardWidgetVariant> &
//   SharedProps & {
//     disabled?: boolean;
//     layout?: CardLayout;
//     pattern?: PatternVariantType["variant"];
//     to?: string; // For linking the entire card
//     children?: {
//       title?: TextVariantType | TextVariantType[];
//       subtitle?: TextVariantType | TextVariantType[];
//       description?: TextVariantType | TextVariantType[];
//       media?: MediaVariantType | MediaVariantType[];
//       button?: ButtonVariantType | ButtonVariantType[];
//       badge?: string; // TODO: replace with BadgeVariantType
//       icon?: string; // TODO: replace with IconVariantType
//       [key: string]: unknown;
//     };
//   } & (
//     | { format?: Exclude<CardFormat, "hoverReveal"> }
//     | {
//         format: "hoverReveal";
//         hoverRevealHeight?: string;
//         hoverRevealMaxHeight?: string;
//       }
//   );