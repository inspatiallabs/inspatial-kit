"use client";

import { iss } from "@in/style";
import { createState, createEffect, $ } from "@in/teract/state";
import { createMotion, eases } from "@in/motion";
import { XStack } from "../../structure/index.ts";
import {
  sizeClassMap,
  weightClassMap,
  transformClassMap,
  letterSpacingMap,
} from "./helpers.ts";
import type { TypographyProps } from "./style.ts";

/*##############################################(ANIMATION HELPERS)##############################################*/
const animateLetters = (
  root: HTMLElement | null,
  style: TypographyProps["animate"],
  durationMs: number = 600,
  delayMs: number = 0
) => {
  if (!root) return;
  const letters = root.querySelectorAll('[data-letter="true"]');
  if (!letters.length) return;

  if (style === "fadeUp") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      translateY: { from: 10, to: 0, duration: durationMs },
      delay: (_t: any, i: number, l: number) =>
        delayMs + (i / Math.max(1, l)) * 250,
      ease: eases.inOutQuad,
    });
  } else if (style === "fadeIn") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      delay: (_t: any, i: number) => delayMs + i * 25,
      ease: eases.inOutQuad,
    });
  } else if (style === "reveal") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      translateY: { from: 8, to: 0, duration: durationMs },
      delay: (_t: any, i: number) => delayMs + i * 40,
      ease: eases.outQuad,
    });
  }
};

/*##############################################(TEXT COMPONENT)##############################################*/
/**
 * InSpatial Kit component that renders text with various animation effects.
 */
export const Text = ({
  className,
  font,
  weight,
  size,
  lineHeight,
  letterSpacing,
  transform,
  animate = "none",
  words,
  delay = 0,
  duration = 2500,
  children,
  ...props
}: TypographyProps) => {
  /*##############################################(STATE)##############################################*/
  const state = createState({
    wordIndex: 0,
    currentWord: Array.isArray(words)
      ? (words[0] as string)
      : (words as string) || "",
    isAnimating: false,
    displayedText: "",
    domId:
      "in-text-" +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36),
  });

  /*##############################################(FUNCTIONS)##############################################*/
  const rotateWords = () => {
    if (Array.isArray(words) && words.length > 1) {
      const next = (state.wordIndex.peek() + 1) % words.length;
      state.wordIndex.set(next);
      state.currentWord.set(words[next] as string);
    }
    state.isAnimating.set(true);
  };

  const typographyClasses = $(() => {
    let classes = "";
    if (size && sizeClassMap[size]) classes += ` ${sizeClassMap[size]}`;
    if (weight && weightClassMap[weight])
      classes += ` ${weightClassMap[weight]}`;
    if (transform && transformClassMap[transform])
      classes += ` ${transformClassMap[transform]}`;
    if (letterSpacing && letterSpacingMap[letterSpacing])
      classes += ` ${letterSpacingMap[letterSpacing]}`;
    return classes.trim();
  });

  /*##############################################(EFFECTS)##############################################*/
  createEffect(() => {
    if (Array.isArray(words) && animate !== "typing") {
      const id = setInterval(rotateWords, duration);
      return () => clearInterval(id as unknown as number);
    }
  });

  // Typing effect
  createEffect(() => {
    if (animate === "typing") {
      let i = 0;
      const text = state.currentWord.peek() || (children as string);
      const typing = setInterval(() => {
        if (i < text.length) {
          state.displayedText.set(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typing as unknown as number);
        }
      }, Math.max(16, duration / Math.max(1, text.length)));
      return () => clearInterval(typing as unknown as number);
    }
  });

  // Run letter animations when applicable
  // Letter animations are triggered via trigger props on mount (see on:mount below)

  // (Removed ticker/generate/flip/rotate etc. for initial InSpatial port)

  /*##############################################(RENDER)##############################################*/
  function renderContent() {
    const content = state.currentWord.peek() || children;

    const wrapLetters = (text: string) =>
      text.split("").map((ch, i) => (
        <XStack
          key={i}
          data-letter="true"
          className={
            animate === "none" || animate === "typing"
              ? "inline-block overflow-hidden"
              : "inline-block overflow-hidden opacity-0"
          }
        >
          {ch === " " ? "\u00A0" : ch}
        </XStack>
      ));

    switch (animate) {
      case "fadeUp":
      case "fadeIn":
      case "reveal":
        return (
          <XStack className="items-center">
            {wrapLetters(String(content))}
          </XStack>
        );
      case "typing":
        return (
          <XStack className="items-center">{state.displayedText.get()}</XStack>
        );
      default:
        return <XStack className="items-center">{content}</XStack>;
    }
  }

  /*##############################################(RETURN)##############################################*/

  return (
    <>
      <p
        id={state.domId.get()}
        on:mount={() => {
          if (
            animate === "fadeUp" ||
            animate === "fadeIn" ||
            animate === "reveal"
          ) {
            const root = document.getElementById(state.domId.peek());
            animateLetters(root as HTMLElement, animate, 600, delay || 0);
          }
        }}
        className={
          typeof iss === "function"
            ? iss(
                typographyClasses.get(),
                "overflow-hidden flex w-full",
                className
              )
            : `${typographyClasses.get()} overflow-hidden flex w-full ${
                className || ""
              }`
        }
        style={{
          lineHeight: lineHeight,
          ...(font?.heading && { fontFamily: font.heading }),
          ...(font?.body && { fontFamily: font.body }),
        }}
        {...props}
      >
        {animate !== "none" ? renderContent() : children}
      </p>
    </>
  );
};
