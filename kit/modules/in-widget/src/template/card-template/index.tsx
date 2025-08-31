// import { View } from "../../structure";
// import { Flipper, FlipperFront, FlipperBack } from "../../structure/flipper";
// import { Text } from "../../typography/text/text.dom";
// import { CardWidgetVariant, CardWidgetVariantType } from "./variant";
// import { Link } from "react-router";
// import { kit } from "@inspatial/theme/variant";
// import SafePatternWrapper from "../../pattern/safe-pattern";
// import { Button } from "../../ornament/button";
// import { motion } from "motion/react";
// import { ensureArray, isSingleItem } from "../widget-tree/utils/array-utils";

// // Helper function for retrieving hover reveal settings
// function getHoverRevealSettings(props: CardWidgetVariantType) {
//   if (props.format === "hoverReveal") {
//     return {
//       hoverRevealHeight: props.hoverRevealHeight || "60%",
//       hoverRevealMaxHeight: props.hoverRevealMaxHeight || "80%",
//     };
//   }

//   // Default values for non-hoverReveal formats
//   return {
//     hoverRevealHeight: "60%",
//     hoverRevealMaxHeight: "80%",
//   };
// }

// export default function CardWidget({
//   disabled = false,
//   class: classNameAlt,
//   css,
//   className,
//   format,
//   variant,
//   layout = "Left",
//   pattern = "none",
//   theme,
//   to,
//   children = {},
//   hoverRevealHeight,
//   hoverRevealMaxHeight,
//   ...rest
// }: CardWidgetVariantType) {
//   // Get hover reveal settings if format is hoverReveal
//   const hoverSettings = getHoverRevealSettings({
//     format,
//     hoverRevealHeight,
//     hoverRevealMaxHeight,
//   } as CardWidgetVariantType);

//   // Prepare children as arrays
//   const titles = ensureArray(children.title);
//   const subtitles = ensureArray(children.subtitle);
//   const descriptions = ensureArray(children.description);
//   const buttons = ensureArray(children.button);

//   // Log for debugging
//   // console.log("CardWidget array data:", {
//   //   format,
//   //   titlesCount: titles.length,
//   //   subtitlesCount: subtitles.length,
//   //   descriptionsCount: descriptions.length,
//   //   buttonsCount: buttons.length,
//   //   firstTitle: titles.length > 0 ? titles[0] : null,
//   // });

//   // Media content section
//   function MediaSection() {
//     if (!children.media) return null;

//     // Prepare media as array
//     const mediaItems = ensureArray(children.media);

//     // Get first media item
//     const firstMedia =
//       mediaItems.length > 0 && isSingleItem(mediaItems[0])
//         ? mediaItems[0]
//         : null;

//     // Extract media source
//     const mediaSrc =
//       typeof children.media === "string"
//         ? children.media
//         : firstMedia?.src || "";

//     // Ensure altText is always a string by using the first title if available
//     const altText =
//       firstMedia?.alt ||
//       (titles.length > 0 &&
//       isSingleItem(titles[0]) &&
//       typeof titles[0].label === "string"
//         ? titles[0].label
//         : "Card image");

//     // if (variant === "flipper") {
//     //   return (
//     //     <Flipper
//     //       axis="none" // NOTE: There is a bug with axis x that occasionally causes the back to be empty until rehovered
//     //       trigger={{ mobile: "onClick", desktop: "onHover" }}
//     //       screensize="md"
//     //       className={kit(
//     //         "flex",
//     //         firstMedia?.className || firstMedia?.class || firstMedia?.css
//     //       )}
//     //     >
//     //       <FlipperFront>
//     //         <img
//     //           src={mediaSrc}
//     //           alt={altText}
//     //           loading={firstMedia?.loading || "lazy"}
//     //           srcSet={firstMedia?.srcSet}
//     //           sizes={
//     //             firstMedia?.sizes ||
//     //             "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//     //           }
//     //           className={kit(
//     //             "flex",
//     //             firstMedia?.className || firstMedia?.class || firstMedia?.css
//     //           )}
//     //         />
//     //       </FlipperFront>
//     //       <FlipperBack>
//     //         <img
//     //           src={mediaSrc}
//     //           alt={altText}
//     //           loading={firstMedia?.loading || "lazy"}
//     //           srcSet={firstMedia?.srcSet}
//     //           sizes={
//     //             firstMedia?.sizes ||
//     //             "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//     //           }
//     //           className={kit(
//     //             `${disabled && "opacity-70"} flex absolute inset-0 opacity-50`,
//     //             firstMedia?.className || firstMedia?.class || firstMedia?.css
//     //           )}
//     //           width={firstMedia?.width}
//     //           height={firstMedia?.height}
//     //         />
//     //         <div className="z-10 relative w-full h-full flex items-center justify-center">
//     //           {format === "contentInMedia" && renderCardContentWithButton()}
//     //           {format === "buttonInMedia" && (
//     //             <div
//     //               className={`absolute inset-0 z-10 flex items-end ${
//     //                 layout === "Left"
//     //                   ? "justify-start"
//     //                   : layout === "Right"
//     //                   ? "justify-end"
//     //                   : "justify-center"
//     //               } pb-6`}
//     //             >
//     //               <div
//     //                 className={`${
//     //                   layout === "Left"
//     //                     ? "pl-6"
//     //                     : layout === "Right"
//     //                     ? "pr-6"
//     //                     : ""
//     //                 } p-4`}
//     //               >
//     //                 {children.button && buttons.length > 0 && (
//     //                   <Link
//     //                     to={
//     //                       isSingleItem(buttons[0]) && buttons[0].to
//     //                         ? buttons[0].to
//     //                         : "#"
//     //                     }
//     //                   >
//     //                     <Button
//     //                       className={kit(
//     //                         `text-sm font-medium`,
//     //                         (buttons.length > 0 &&
//     //                           isSingleItem(buttons[0]) &&
//     //                           buttons[0].className) ||
//     //                           (buttons.length > 0 &&
//     //                             isSingleItem(buttons[0]) &&
//     //                             buttons[0].class) ||
//     //                           (buttons.length > 0 &&
//     //                             isSingleItem(buttons[0]) &&
//     //                             buttons[0].css)
//     //                       )}
//     //                       {...(buttons.length > 0 && isSingleItem(buttons[0])
//     //                         ? buttons[0]
//     //                         : {})}
//     //                     >
//     //                       {buttons.length > 0 &&
//     //                         isSingleItem(buttons[0]) &&
//     //                         buttons[0].label}
//     //                     </Button>
//     //                   </Link>
//     //                 )}
//     //               </div>
//     //             </div>
//     //           )}
//     //         </div>
//     //       </FlipperBack>
//     //     </Flipper>
//     //   );
//     // }

//     // For base variant - show the media with content in it when format is contentInMedia
//     if (format === "contentInMedia") {
//       return (
//         <div className="relative">
//           <img
//             src={mediaSrc}
//             alt={altText}
//             loading={firstMedia?.loading || "lazy"}
//             srcSet={firstMedia?.srcSet}
//             sizes={
//               firstMedia?.sizes ||
//               "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             }
//             className={kit(
//               "flex",
//               firstMedia?.className || firstMedia?.class || firstMedia?.css
//             )}
//           />
//           <div className="absolute inset-0 z-10 flex items-center justify-center">
//             <div className="bg-black/30 backdrop-blur-sm w-full h-full flex items-center justify-center p-4">
//               {renderCardContentWithButton()}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // New buttonInMedia format - only button appears over media
//     if (format === "buttonInMedia") {
//       return (
//         <div className="relative">
//           <img
//             src={mediaSrc}
//             alt={altText}
//             loading={firstMedia?.loading || "lazy"}
//             srcSet={firstMedia?.srcSet}
//             sizes={
//               firstMedia?.sizes ||
//               "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             }
//             className={kit(
//               "flex",
//               firstMedia?.className || firstMedia?.class || firstMedia?.css
//             )}
//           />
//           <div
//             className={`absolute inset-0 z-10 flex items-end ${
//               layout === "Left"
//                 ? "justify-start"
//                 : layout === "Right"
//                 ? "justify-end"
//                 : "justify-center"
//             } pb-6`}
//           >
//             <div
//               className={`${
//                 layout === "Left" ? "pl-6" : layout === "Right" ? "pr-6" : ""
//               } p-4`}
//             >
//               {children.button && buttons.length > 0 && (
//                 <Link
//                   to={
//                     isSingleItem(buttons[0]) && buttons[0].to
//                       ? buttons[0].to
//                       : "#"
//                   }
//                 >
//                   <Button
//                     className={kit(
//                       `text-sm font-medium`,
//                       (buttons.length > 0 &&
//                         isSingleItem(buttons[0]) &&
//                         buttons[0].className) ||
//                         (buttons.length > 0 &&
//                           isSingleItem(buttons[0]) &&
//                           buttons[0].class) ||
//                         (buttons.length > 0 &&
//                           isSingleItem(buttons[0]) &&
//                           buttons[0].css)
//                     )}
//                     {...(buttons.length > 0 && isSingleItem(buttons[0])
//                       ? buttons[0]
//                       : {})}
//                   >
//                     {buttons.length > 0 &&
//                       isSingleItem(buttons[0]) &&
//                       buttons[0].label}
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // For hoverReveal variant - show only title by default and reveal all content on hover
//     if (format === "hoverReveal") {
//       // Use the settings from the props
//       const { hoverRevealHeight, hoverRevealMaxHeight } = hoverSettings;

//       return (
//         <motion.div
//           className="relative cursor-pointer overflow-hidden h-full"
//           initial="default"
//           whileHover="hover"
//         >
//           <img
//             src={mediaSrc}
//             alt={altText}
//             loading={firstMedia?.loading || "lazy"}
//             srcSet={firstMedia?.srcSet}
//             sizes={
//               firstMedia?.sizes ||
//               "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             }
//             className={kit(
//               "flex",
//               firstMedia?.className || firstMedia?.class || firstMedia?.css
//             )}
//           />

//           <div className="absolute inset-0 flex flex-col justify-end">
//             {/* Container for title and content with motion */}
//             <motion.div
//               className="w-full bg-gradient-to-t from-[#22223B]/70 via-[#22223B]/70 to-transparent"
//               variants={{
//                 default: { height: "auto", maxHeight: "80px" },
//                 hover: {
//                   height: hoverRevealHeight,
//                   maxHeight: hoverRevealMaxHeight,
//                   transition: { duration: 0.3, ease: "easeOut" },
//                 },
//               }}
//             >
//               {/* Title section - always visible */}
//               <motion.div
//                 className={`p-4 ${
//                   layout === "Left"
//                     ? "text-left"
//                     : layout === "Right"
//                     ? "text-right"
//                     : "text-center"
//                 }`}
//                 variants={{
//                   default: { y: 0 },
//                   hover: { y: 0 }, // Keep title in place instead of moving up
//                 }}
//               >
//                 {titles.length > 0 &&
//                   titles.map((title, index) => {
//                     const titleItem = isSingleItem(title) ? title : null;
//                     if (!titleItem) return null;

//                     return (
//                       <Text
//                         key={`hover-title-${index}`}
//                         className={kit(
//                           `text-(--surface) text-lg font-bold ${
//                             index > 0 ? "mt-1" : ""
//                           }`,
//                           titleItem.className ||
//                             titleItem.class ||
//                             titleItem.css
//                         )}
//                         {...titleItem}
//                       >
//                         {titleItem.label}
//                       </Text>
//                     );
//                   })}
//               </motion.div>

//               {/* Content section - revealed on hover */}
//               <motion.div
//                 className={`p-4 pt-0 ${
//                   layout === "Left"
//                     ? "text-left"
//                     : layout === "Right"
//                     ? "text-right"
//                     : "text-center"
//                 }`}
//                 variants={{
//                   default: { opacity: 0 },
//                   hover: {
//                     opacity: 1,
//                     transition: { duration: 0.3, delay: 0.1, ease: "easeOut" },
//                   },
//                 }}
//               >
//                 {/* Additional title items (after first one) */}
//                 {titles.length > 1 &&
//                   titles.slice(1).map((title, index) => {
//                     const titleItem = isSingleItem(title) ? title : null;
//                     if (!titleItem) return null;

//                     return (
//                       <Text
//                         key={`additional-title-${index}`}
//                         className={kit(
//                           `text-(--surface) text-base mb-2`,
//                           titleItem.className ||
//                             titleItem.class ||
//                             titleItem.css
//                         )}
//                         {...titleItem}
//                       >
//                         {titleItem.label}
//                       </Text>
//                     );
//                   })}

//                 {subtitles.length > 0 &&
//                   subtitles.map((subtitle, index) => {
//                     const subtitleItem = isSingleItem(subtitle)
//                       ? subtitle
//                       : null;
//                     if (!subtitleItem) return null;

//                     return (
//                       <Text
//                         key={`hover-subtitle-${index}`}
//                         className={kit(
//                           `text-(--surface) font-uppercase text-xs mb-2`,
//                           subtitleItem.className ||
//                             subtitleItem.class ||
//                             subtitleItem.css
//                         )}
//                         {...subtitleItem}
//                       >
//                         {subtitleItem.label}
//                       </Text>
//                     );
//                   })}

//                 {descriptions.length > 0 &&
//                   descriptions.map((description, index) => {
//                     const descItem = isSingleItem(description)
//                       ? description
//                       : null;
//                     if (!descItem) return null;

//                     return (
//                       <Text
//                         key={`hover-description-${index}`}
//                         className={kit(
//                           `text-(--surface) text-sm mb-4`,
//                           descItem.className || descItem.class || descItem.css
//                         )}
//                         {...descItem}
//                       >
//                         {descItem.label}
//                       </Text>
//                     );
//                   })}

//                 {buttons.length > 0 && (
//                   <div
//                     className={`w-full flex ${
//                       layout === "Left"
//                         ? "justify-start"
//                         : layout === "Right"
//                         ? "justify-end"
//                         : "justify-center"
//                     }`}
//                   >
//                     {buttons.map((button, index) => {
//                       const buttonItem = isSingleItem(button) ? button : null;
//                       if (!buttonItem) return null;

//                       // Only show the first button in the hover menu
//                       if (index > 0) return null;

//                       return (
//                         <Link
//                           key={`hover-button-${index}`}
//                           to={buttonItem.to || "#"}
//                         >
//                           <Button
//                             className={kit(
//                               `text-sm font-medium`,
//                               buttonItem.className ||
//                                 buttonItem.class ||
//                                 buttonItem.css
//                             )}
//                             {...buttonItem}
//                           >
//                             {buttonItem.label}
//                           </Button>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>
//       );
//     }

//     // Default case: Just show the media
//     return (
//       <img
//         src={mediaSrc}
//         alt={altText}
//         loading={firstMedia?.loading || "lazy"}
//         srcSet={firstMedia?.srcSet}
//         sizes={
//           firstMedia?.sizes ||
//           "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         }
//         className={kit(
//           "flex",
//           firstMedia?.className || firstMedia?.class || firstMedia?.css
//         )}
//       />
//     );
//   }

//   // Content section with title, subtitle, and description
//   function ContentSection() {
//     return (
//       <View
//         scrollable={false}
//         animate="blurFade"
//         className={`flex flex-col w-full mx-auto overflow-hidden ${
//           layout === "Left"
//             ? "text-left"
//             : layout === "Right"
//             ? "text-right"
//             : "text-center"
//         }`}
//       >
//         {titles.map((title, index) => {
//           const titleItem = isSingleItem(title) ? title : null;
//           if (!titleItem) return null;

//           return (
//             <Text
//               key={`title-${index}`}
//               className={kit(
//                 `text-base font-bold pt-[12px] capitalize overflow-hidden ${
//                   layout === "Left"
//                     ? "text-left"
//                     : layout === "Right"
//                     ? "text-right justify-end items-end"
//                     : "text-center justify-center items-center mx-auto"
//                 }`,
//                 titleItem.className || titleItem.class || titleItem.css
//               )}
//               {...titleItem}
//             >
//               {titleItem.label}
//             </Text>
//           );
//         })}

//         {subtitles.map((subtitle, index) => {
//           const subtitleItem = isSingleItem(subtitle) ? subtitle : null;
//           if (!subtitleItem) return null;

//           return (
//             <Text
//               key={`subtitle-${index}`}
//               className={kit(
//                 `font-uppercase text-xs md:text-[9px] overflow-hidden ${
//                   layout === "Left"
//                     ? "text-left"
//                     : layout === "Right"
//                     ? "text-right justify-end items-end"
//                     : "text-center justify-center items-center mx-auto"
//                 }`,
//                 subtitleItem.className || subtitleItem.class || subtitleItem.css
//               )}
//               {...subtitleItem}
//             >
//               {subtitleItem.label}
//             </Text>
//           );
//         })}

//         {descriptions.map((description, index) => {
//           const descriptionItem = isSingleItem(description)
//             ? description
//             : null;
//           if (!descriptionItem) return null;

//           return (
//             <Text
//               key={`description-${index}`}
//               className={kit(
//                 `text-sm overflow-hidden mt-2 ${
//                   layout === "Left"
//                     ? "text-left"
//                     : layout === "Right"
//                     ? "text-right justify-end items-end"
//                     : "text-center justify-center items-center mx-auto"
//                 }`,
//                 descriptionItem.className ||
//                   descriptionItem.class ||
//                   descriptionItem.css
//               )}
//               {...descriptionItem}
//             >
//               {descriptionItem.label}
//             </Text>
//           );
//         })}
//       </View>
//     );
//   }

//   // Button section
//   function ButtonSection() {
//     if (buttons.length === 0) return null;

//     return (
//       <div className="flex flex-col gap-2">
//         {buttons.map((button, index) => {
//           const buttonItem = isSingleItem(button) ? button : null;
//           if (!buttonItem) return null;

//           return (
//             <Link key={`button-${index}`} to={buttonItem.to || "#"}>
//               <Button
//                 className={kit(
//                   `mt-4 text-sm font-medium ${
//                     layout === "Left"
//                       ? "float-left"
//                       : layout === "Right"
//                       ? "float-right"
//                       : "mx-auto"
//                   }`,
//                   buttonItem.className || buttonItem.class || buttonItem.css
//                 )}
//                 {...buttonItem}
//               >
//                 {buttonItem.label}
//               </Button>
//             </Link>
//           );
//         })}
//       </div>
//     );
//   }

//   // Card wrapper based on layout
//   function renderCardContentWithButton() {
//     const content = (
//       <>
//         {(format === "base" ||
//           format === "contentInMedia" ||
//           format === "hoverReveal" ||
//           format === "buttonInMedia") && <ContentSection />}
//         {(format === "base" ||
//           format === "contentInMedia" ||
//           format === "hoverReveal") && <ButtonSection />}
//       </>
//     );

//     if (layout === "Left") {
//       return (
//         <div className="flex flex-col w-full mx-auto gap-3 overflow-hidden">
//           {content}
//         </div>
//       );
//     } else if (layout === "Right") {
//       return (
//         <div className="flex flex-col w-fit mx-auto gap-3 overflow-hidden">
//           {content}
//         </div>
//       );
//     } else {
//       // Center
//       return (
//         <div className="flex flex-col w-full mx-auto gap-3 overflow-hidden items-center">
//           {content}
//         </div>
//       );
//     }
//   }

//   // If a "to" prop is provided, wrap the card in a Link
//   if (to) {
//     return (
//       <SafePatternWrapper
//         variant={pattern}
//         className={className}
//         classNameAlt={classNameAlt}
//         css={css}
//         variantApplyFn={CardWidgetVariant.getVariant}
//         variantProps={{ format, theme, variant }}
//         {...rest}
//       >
//         <View animate="linear" delay={0.8}>
//           <Link to={to}>
//             <MediaSection />
//             {format !== "contentInMedia" &&
//               format !== "hoverReveal" &&
//               renderCardContentWithButton()}
//           </Link>
//         </View>
//       </SafePatternWrapper>
//     );
//   }

//   // Otherwise, just return the card
//   return (
//     <SafePatternWrapper
//       variant={pattern}
//       className={className}
//       classNameAlt={classNameAlt}
//       css={css}
//       variantApplyFn={CardWidgetVariant.getVariant}
//       variantProps={{ format, theme, variant }}
//       {...rest}
//     >
//       <View animate="linear" delay={0.8}>
//         <MediaSection />
//         {format !== "contentInMedia" &&
//           format !== "hoverReveal" &&
//           renderCardContentWithButton()}
//       </View>
//     </SafePatternWrapper>
//   );
// }