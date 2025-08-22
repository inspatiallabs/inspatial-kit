import { iss } from "@in/style";
import { createState } from "@in/teract/state";
import { createMotion, eases } from "@in/motion";
import { ScrollViewStyle } from "./style.ts";
import type { ScrollViewProps } from "./type.ts";
import { Slot } from "../slot/index.tsx";

/*################################ (HELPERS) ###############################*/
let inScrollViewCssInjected = false;
function ensureHideScrollbarCss() {
  if (inScrollViewCssInjected) return;
  try {
    const styleEl = (globalThis as any).document?.createElement?.("style");
    if (styleEl) {
      styleEl.textContent = `
        [data-in-scrollbar="hide"] { -ms-overflow-style: none; scrollbar-width: none; }
        [data-in-scrollbar="hide"]::-webkit-scrollbar { display: none; width: 0 !important; height: 0 !important; }

        /* Theme: auto (system default enhanced) */
        .in-scrollbar-auto::-webkit-scrollbar { width: 12px; height: 12px; }
        .in-scrollbar-auto::-webkit-scrollbar-thumb { background-color: color-mix(in oklab, var(--muted) 65%, transparent); border-radius: 8px; border: 3px solid transparent; background-clip: content-box; }
        .in-scrollbar-auto::-webkit-scrollbar-track { background: transparent; }
        .in-scrollbar-auto { scrollbar-color: color-mix(in oklab, var(--muted) 65%, transparent) transparent; scrollbar-width: auto; }

        /* Theme: thin */
        .in-scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
        .in-scrollbar-thin::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 9999px; }
        .in-scrollbar-thin { scrollbar-width: thin; scrollbar-color: var(--muted) transparent; }

        /* Theme: minimal (thumb only on hover) */
        .in-scrollbar-minimal::-webkit-scrollbar { width: 10px; height: 10px; }
        .in-scrollbar-minimal::-webkit-scrollbar-thumb { background: transparent; border-radius: 6px; }
        .in-scrollbar-minimal:hover::-webkit-scrollbar-thumb { background: color-mix(in oklab, var(--muted) 60%, transparent); }
        .in-scrollbar-minimal { scrollbar-width: none; }

        /* Theme: rounded (track with soft background) */
        .in-scrollbar-rounded::-webkit-scrollbar { width: 12px; height: 12px; }
        .in-scrollbar-rounded::-webkit-scrollbar-thumb { background: var(--brand); border-radius: 9999px; }
        .in-scrollbar-rounded::-webkit-scrollbar-track { background: color-mix(in oklab, var(--brand) 10%, transparent); border-radius: 9999px; }
        .in-scrollbar-rounded { scrollbar-width: thin; scrollbar-color: var(--brand) transparent; }

        /* Theme: pill (thumb with inset border for contrast) */
        .in-scrollbar-pill::-webkit-scrollbar { width: 14px; height: 14px; }
        .in-scrollbar-pill::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 9999px; border: 3px solid var(--surface); }
        .in-scrollbar-pill::-webkit-scrollbar-track { background: var(--surface); }
        .in-scrollbar-pill { scrollbar-width: auto; scrollbar-color: var(--primary) var(--surface); }

        /* Theme: gradient (thumb with gradient fill) */
        .in-scrollbar-gradient::-webkit-scrollbar { width: 12px; height: 12px; }
        .in-scrollbar-gradient::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--brand), var(--primary)); border-radius: 8px; }
        .in-scrollbar-gradient::-webkit-scrollbar-track { background: transparent; }
        .in-scrollbar-gradient { scrollbar-width: thin; scrollbar-color: var(--brand) transparent; }
      `;
      (globalThis as any).document.head.appendChild(styleEl);
      inScrollViewCssInjected = true;
    }
  } catch {}
}

function animateIn(
  node: HTMLElement,
  type: ScrollViewProps["animate"],
  duration: number,
  delay: number
) {
  if (!node || type === "none") return;

  // Initialize with invisible state for smooth animation
  node.style.opacity = "0";

  const animationParams: Record<string, any> = {
    duration,
    delay,
    autoplay: true,
    ease: eases.outQuad,
    composition: "replace",
  };

  switch (type) {
    case "fade":
      animationParams.opacity = [0, 1];
      break;

    case "fadeUp":
      animationParams.opacity = [0, 1];
      animationParams.translateY = [20, 0];
      break;

    case "scale":
      animationParams.opacity = [0, 1];
      animationParams.scale = [0.9, 1];
      // Add translateZ for GPU acceleration
      animationParams.translateZ = 0;
      break;
  }

  try {
    const animation = createMotion(node, {
      ...animationParams,
      onBegin: () => {
        // Ensure the element is ready for animation
        node.style.willChange = "opacity, transform";
      },
      onComplete: () => {
        // Clean up inline styles after animation
        node.style.opacity = "";
        node.style.transform = "";
        node.style.willChange = "";
      },
    });

    // Fallback safety: ensure visible state after animation time
    const totalTime = delay + duration + 100;
    const fallbackTimer = setTimeout(() => {
      if (node && getComputedStyle(node).opacity === "0") {
        node.style.opacity = "1";
        node.style.transform = "";
      }
    }, totalTime);

    // Clean up timer if animation completes normally
    animation.onComplete = () => {
      clearTimeout(fallbackTimer);
      node.style.opacity = "";
      node.style.transform = "";
      node.style.willChange = "";
    };

    return animation;
  } catch (error) {
    // Fallback: immediately show the element if animation fails
    console.warn("ScrollView animation failed:", error);
    node.style.opacity = "1";
    node.style.transform = "";
  }
}

/*################################ (COMPONENT) ###############################*/
export function ScrollView(props: ScrollViewProps) {
  /*********************************(Props)*********************************/
  const {
    children,
    className,
    $ref,
    animate = "fadeUp", // Default animation now works properly with InMotion
    duration = 400,
    delay = 0,
    preserveChildren,
    scrollable = true,
    scrollbar = false,
    axis = "y",
    ...rest
  } = props as any;

  /*********************************(State)*********************************/
  const state = createState.in({
    initialState: {
      mounted: false,
      domId: "in-scroll-" + Math.random().toString(36).slice(2),
    },
    action: {
      mountView: { key: "mounted", fn: () => true },
    },
  });

  /*********************************(Handlers)*********************************/

  function mountView() {
    ensureHideScrollbarCss();
    state.action.mountView?.();

    // Get the DOM node for animation
    requestAnimationFrame(() => {
      try {
        const id = (state.domId as any).peek
          ? (state.domId as any).peek()
          : state.domId;
        const node = document?.getElementById?.(id) as HTMLElement | null;

        if (node) {
          animateIn(node, animate, duration, delay);
          if (typeof $ref === "function") ($ref as any)(node);
        }
      } catch (error) {
        console.warn("ScrollView mount animation error:", error);
      }
    });
  }

  /*********************************(Const)*********************************/

  const wrapperClass = iss(
    ScrollViewStyle.getStyle({
      scrollable,
      scrollbar,
      scrollbarTheme: (props as any).scrollbarTheme ?? "thin",
      className,
    })
  );

  /*********************************(Render)*********************************/
  return (
    <>
      <Slot
        id={
          (state.domId as any).get
            ? (state.domId as any).get()
            : (state.domId as any)
        }
        className={wrapperClass}
        on:mount={() => mountView()}
        {...rest}
      >
        <Slot
          className={iss(
            scrollable
              ? axis === "x"
                ? "overflow-x-auto overflow-y-hidden"
                : axis === "y"
                ? "overflow-y-auto overflow-x-hidden"
                : "overflow-auto"
              : "overflow-hidden",
            "scroll-smooth w-full h-full overscroll-contain",
            !scrollbar ? "scrollbar-hide" : "",
            scrollbar
              ? `in-scrollbar-${(props as any).scrollbarTheme ?? "thin"}`
              : ""
          )}
          style={{
            web: {
              width: "100%",
              height: "100%",
              minWidth: 0,
              minHeight: 0,
              overflowX: scrollable
                ? axis === "x"
                  ? "auto"
                  : axis === "both"
                  ? "auto"
                  : "hidden"
                : "hidden",
              overflowY: scrollable
                ? axis === "y"
                  ? "auto"
                  : axis === "both"
                  ? "auto"
                  : "hidden"
                : "hidden",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            },
          }}
          data-in-scrollbar={scrollbar ? undefined : "hide"}
        >
          {preserveChildren ? (
            children
          ) : (
            <Slot className="min-w-full min-h-full">{children}</Slot>
          )}
        </Slot>
      </Slot>
    </>
  );
}
