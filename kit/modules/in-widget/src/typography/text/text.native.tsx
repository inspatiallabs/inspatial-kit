"use client";

import { iss } from "@in/style";
import { createState, createEffect, $ } from "@in/teract/state";
import { createMotion, eases } from "@in/motion";
import { XStack } from "@in/widget/structure/index.ts";
import {
  sizeClassMap,
  weightClassMap,
  transformClassMap,
  letterSpacingMap,
} from "./helpers.ts";
import type { TypographyProps } from "./type.ts";

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

  // Ensure starting state is hidden before we hand to Motion
  letters.forEach((n) => ((n as HTMLElement).style.opacity = "0"));

  if (style === "fadeUp" || style === "fadeUpContainer") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      translateY: { from: 10, to: 0, duration: durationMs },
      delay: (_t: any, i: number, l: number) =>
        delayMs + (i / Math.max(1, l)) * 250,
      ease: eases.inOutQuad,
      onComplete: () => {
        // Cleanup inline opacity in case anything stuck
        letters.forEach((n) => ((n as HTMLElement).style.opacity = ""));
      },
    });
  } else if (style === "fadeIn") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      delay: (_t: any, i: number) => delayMs + i * 25,
      ease: eases.inOutQuad,
      onComplete: () => {
        letters.forEach((n) => ((n as HTMLElement).style.opacity = ""));
      },
    });
  } else if (style === "reveal") {
    createMotion(letters, {
      opacity: { from: 0, to: 1, duration: durationMs },
      translateY: { from: 8, to: 0, duration: durationMs },
      delay: (_t: any, i: number) => delayMs + i * 40,
      ease: eases.outQuad,
      onComplete: () => {
        letters.forEach((n) => ((n as HTMLElement).style.opacity = ""));
      },
    });
  }

  // Fallback safety: force show after total time
  const total = delayMs + durationMs + 50;
  setTimeout(() => {
    letters.forEach((n) => {
      const el = n as HTMLElement;
      if (getComputedStyle(el).opacity === "0") el.style.opacity = "1";
    });
  }, total);
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
      {(() => {
        const controlId = (props as any)?.id;
        const { id: _ignoredId, ...restProps } = (props as any) || {};

        const commonId = state.domId.get();
        const commonOnMount = () => {
          const root = document.getElementById(state.domId.peek());
          if (!root) return;
          if (animate === "fadeInContainer") {
            try {
              (root as HTMLElement).style.opacity = "0";
            } catch {}
            createMotion(root, {
              opacity: { from: 0, to: 1, duration: 700 },
              ease: eases.inOutQuad,
              onComplete: () => {
                try {
                  (root as HTMLElement).style.opacity = "";
                } catch {}
              },
            } as any);
            setTimeout(() => {
              try {
                if (getComputedStyle(root).opacity === "0")
                  (root as HTMLElement).style.opacity = "1";
              } catch {}
            }, 750);
          } else if (animate === "fadeUpContainer") {
            try {
              (root as HTMLElement).style.opacity = "0";
            } catch {}
            createMotion(root, {
              opacity: { from: 0, to: 1, duration: 700 },
              translateY: { from: 12, to: 0, duration: 700 },
              ease: eases.inOutQuad,
              onComplete: () => {
                try {
                  (root as HTMLElement).style.opacity = "";
                } catch {}
              },
            } as any);
            setTimeout(() => {
              try {
                if (getComputedStyle(root).opacity === "0")
                  (root as HTMLElement).style.opacity = "1";
              } catch {}
            }, 750);
          } else if (
            animate === "fadeUp" ||
            animate === "fadeIn" ||
            animate === "reveal"
          ) {
            animateLetters(root as HTMLElement, animate, 600, delay || 0);
          }
        };

        const commonClass =
          typeof iss === "function"
            ? iss(
                typographyClasses.get(),
                "overflow-hidden flex w-full",
                className
              )
            : `${typographyClasses.get()} overflow-hidden flex w-full ${
                className || ""
              }`;

        const commonStyle = {
          lineHeight: lineHeight,
          ...(font?.heading && { fontFamily: font.heading }),
          ...(font?.body && { fontFamily: font.body }),
        } as const;

        if (typeof controlId === "string" && controlId.length > 0) {
          return (
            <label
              id={commonId}
              htmlFor={controlId}
              on:mount={commonOnMount}
              className={commonClass}
              style={commonStyle}
              {...restProps}
            >
              {animate !== "none" ? renderContent() : children}
            </label>
          );
        }

        return (
          <p
            id={commonId}
            on:mount={commonOnMount}
            className={commonClass}
            style={commonStyle}
            {...props}
          >
            {animate !== "none" ? renderContent() : children}
          </p>
        );
      })()}
    </>
  );
};
