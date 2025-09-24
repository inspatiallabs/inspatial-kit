// // import { createState } from "@in/teract/state/index.ts";
// import { CardStyle } from "./style.ts";
// import { iss } from "@in/style/utils/index.ts";
// import { Slot } from "../../structure/index.ts";
// import { Text } from "../../typography/index.ts";
// import type { CardProps } from "./type.ts";

// //##############################################(CARD)##############################################//

// export function CardWrapper({
//   format,
//   size,
//   disabled,
//   className,
//   children,
//   ...rest
// }: CardProps) {
//   return (
//     <Slot
//       className={iss(
//         CardStyle.wrapper.getStyle({ format, size, disabled }),
//         className
//       )}
//       disabled={disabled}
//       {...rest}
//     >
//       {children}
//     </Slot>
//   );
// }

// //##############################################(CARD HEADER)##############################################//

// export function CardHeader({ className, children, ...rest }: CardProps) {
//   return (
//     <Slot className={iss(CardStyle.header.getStyle({ className }))} {...rest}>
//       {children}
//     </Slot>
//   );
// }

// //##############################################(CARD TITLE)##############################################//

// export function CardTitle({ size, className, children, ...rest }: CardProps) {
//   return (
//     <Text
//       className={iss(CardStyle.title.getStyle({ size }), className)}
//       {...rest}
//     >
//       {children}
//     </Text>
//   );
// }

// //##############################################(CARD DESCRIPTION)##############################################//

// export function CardDescription({ className, children, ...rest }: CardProps) {
//   return (
//     <Text
//       className={iss(CardStyle.description.getStyle({ className }))}
//       {...rest}
//     >
//       {children}
//     </Text>
//   );
// }

// //##############################################(CARD CONTENT)##############################################//

// export function CardContent({ className, children, ...rest }: CardProps) {
//   return (
//     <Slot
//       className={iss(CardStyle.content.getStyle({ className }), className)}
//       {...rest}
//     >
//       {children}
//     </Slot>
//   );
// }

// //##############################################(CARD FOOTER)##############################################//

// export function CardFooter({ className, children, ...rest }: CardProps) {
//   return (
//     <Slot className={iss(CardStyle.footer.getStyle({ className }))} {...rest}>
//       {children}
//     </Slot>
//   );
// }

// //##############################################(CARD GLOW)##############################################//

// // export const CardGlow = ({className, children, ...rest}: CardProps) => {

// //   return (
// //     <section
// //       {...rest}
// //       ref={ref}
// //       onPointerEnter={() => {
// //         setMouseEnter(true);
// //       }}
// //       onPointerLeave={() => {
// //         setMouseEnter(false);
// //       }}
// //       className={iss("bg-inherit w-auto h-auto", className)}
// //     >
// //       <div className="flex justify-center items-center">
// //         <CardIllustration mouseEnter={mouseEnter} />
// //       </div>
// //       <div className="px-2">{children}</div>
// //     </section>
// //   );
// // });

// /********************************************(CARD (glow) ILLUSTRATION)********************************************/
// // interface CardIllustrationProps {}

// // const CardIllustration = ({className, ...rest }: CardIllustrationProps) => {
// //   const stars = 108;
// //   const columns = 18;

// //   const useGlowingStars = createState.in({
// //      initalState: {
// //         glowingStars: []
// //      }
// //      actions: {
// //         setGlowingStars: (glowingStars: number[]) => {
// //             glowingStars.set({
// //                 glowingStars: glowingStars
// //             })
// //         }
// //      }
// //   })

// //   createSideEffect(() => {
// //     let highlightedStars: number[] = [];

// //     const interval = setInterval(() => {
// //       highlightedStars = Array.from({ length: 30 }, () =>
// //         Math.floor(Math.random() * stars)
// //       );
// //       setGlowingStars([...highlightedStars]);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   });

// //   return (
// //     <section
// //       {...rest}
// //       ref={ref}
// //       className={iss("h-[250px] p-1 w-full", className)}
// //       style={{
// //         display: "grid",
// //         gridTemplateColumns: `repeat(${columns}, 1fr)`,
// //         gap: `1px`,
// //       }}
// //     >
// //       {[...Array(stars)].map((_, starIdx) => {
// //         const isGlowing = glowingStars.includes(starIdx);
// //         const delay = (starIdx % 10) * 0.1;
// //         const staticDelay = starIdx * 0.01;
// //         return (
// //           <div
// //             key={`matrix-col-${starIdx}}`}
// //             className="relative flex items-center justify-center"
// //           >
// //             <CardStar
// //               isGlowing={mouseEnter ? true : isGlowing}
// //               delay={mouseEnter ? staticDelay : delay}
// //             />
// //             {mouseEnter && <CardEffect delay={staticDelay} />}
// //             <Slot mode="wait">{isGlowing && <CardEffect delay={delay} />}</Slot>
// //           </div>
// //         );
// //       })}
// //     </section>
// //   );
// // });

// /********************************************(CARD (glow) STAR)********************************************/

// // const CardStar = ({
// //   isGlowing,
// //   delay,
// // }: {
// //   isGlowing: boolean;
// //   delay: number;
// // }) => {
// //   return (
// //     <Slot
// //       key={delay}
// //       initial={{
// //         scale: 1,
// //       }}
// //       animate={{
// //         scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
// //         background: isGlowing ? "#fff" : "#666",
// //       }}
// //       transition={{
// //         duration: 2,
// //         ease: "easeInOut",
// //         delay: delay,
// //       }}
// //       className={iss("bg-surface h-[1px] w-[1px] rounded-full relative")}
// //     />
// //   );
// // };

// /********************************************(CARD (glow) EFFECT)********************************************/

// // const CardEffect = ({ delay }: { delay: number }) => {
// //   return (
// //     <Slot
// //       initial={{
// //         opacity: 0,
// //       }}
// //       animate={{
// //         opacity: 1,
// //       }}
// //       transition={{
// //         duration: 2,
// //         ease: "easeInOut",
// //         delay: delay,
// //       }}
// //       exit={{
// //         opacity: 0,
// //       }}
// //       className="absolute left-1/2 -translate-x-1/2 h-[4px] w-[4px] rounded-full bg-brand blur-[1px]"
// //     />
// //   );
// // };
