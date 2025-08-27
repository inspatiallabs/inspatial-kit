import {
  nextTick,
  bind,
  isSignal,
  type Signal,
} from "@in/teract/signal/index.ts";
import { detectEnvironment } from "@in/vader/env/index.ts";

/*#################################(Types)
#################################*/

export type PlatformType = "dom" | "native" | "gpu";

/** Mapping of keys to arrays of values */
type KeyValsMap = Record<string, string[]>;

/** TriggerProp handler function type */
export type TriggerPropHandler<Value = any> = (
  node: Element,
  value: Value
) => void;

/** TriggerProp factory function type */
export type TriggerPropFactory = (key: string) => TriggerPropHandler;

/** Namespace to tags mapping */
interface NamespaceToTagsMap {
  [namespace: string]: string[];
}

/** TriggerProps configuration */
interface TriggerPropsType {
  style: TriggerPropFactory;
  class: TriggerPropFactory;
  // className: TriggerPropFactory;
}

/** Configuration object for DOM renderer with triggerProps */
interface WithTriggerPropsType {
  doc: Document;
  namespaces: Record<string, string>;
  tagNamespaceMap: Record<string, string>;
  tagAliases: Record<string, string>;
  propAliases: Record<string, string>;
  onTriggerProp: (
    prefix: string,
    key: string,
    prop?: string
  ) => TriggerPropHandler | undefined;
}

/*#################################(Utilities)#################################*/

function reverseMap(keyValsMap: KeyValsMap): Record<string, string> {
  const reversed: Record<string, string> = {};
  for (const [key, vals] of Object.entries(keyValsMap)) {
    for (const val of vals) {
      reversed[val] = key;
    }
  }
  return reversed;
}

/*#################################(Constants)#################################*/

const namespaces: Record<string, string> = {
  xml: "http://www.w3.org/XML/1998/namespace",
  html: "http://www.w3.org/1999/xhtml",
  svg: "http://www.w3.org/2000/svg",
  math: "http://www.w3.org/1998/Math/MathML",
  xlink: "http://www.w3.org/1999/xlink",
};

export const tagAliases: Record<string, string> = {};

const attributes: string[] = [
  // reserved/directed via `style:*` and `class:*`; others should be handled by native attrs
  "viewBox",
  "d",
  "tabindex",
  "role",
  "for",
];

const namespaceToTagsMap: NamespaceToTagsMap = {
  svg: [
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tspan",
    "unknown",
    "use",
    "view",
  ],
};

export const tagNamespaceMap: Record<string, string> =
  reverseMap(namespaceToTagsMap);
// Removed attr:/prop: magic; keep only select aliases as plain attrs
export const propAliases: Record<string, string> = Object.fromEntries(
  attributes.map((k) => [k, k])
);

/*#################################(TriggerProps)#################################*/

export const triggerProps: TriggerPropsType = {
  /********************************* (Style) *********************************/
  style(key: string): TriggerPropHandler {
    return function (node: Element, val: any): void {
      if (val === undefined || val === null) return;

      const styleObj = (node as HTMLElement).style;

      function handler(newVal: any): void {
        nextTick(function (): void {
          if (newVal === undefined || newVal === null || newVal === false) {
            styleObj.setProperty(key, "unset");
          } else {
            styleObj.setProperty(key, String(newVal));
          }
        });
      }

      bind(handler, val);
    };
  },
  /********************************* (Class) *********************************/
  class(key: string): TriggerPropHandler {
    return function (node: Element, val: any): void {
      if (val === undefined || val === null) return;

      const classList = node.classList;

      function handler(newVal: any): void {
        nextTick(function (): void {
          if (newVal) {
            classList.add(key);
          } else {
            classList.remove(key);
          }
        });
      }

      bind(handler, val);
    };
  },
};

/*#################################(TriggerBridge Registry)#################################*/

interface TriggerBridgeHandler<Value = any> {
  handler: TriggerPropHandler<Value>;
  platforms?: PlatformType[];
  fallback?: string;
  priority?: number;
}

class TriggerBridgeRegistry {
  private handlers = new Map<string, TriggerBridgeHandler<any>>();

  register<Name extends string, V = any>(
    name: Name,
    config: TriggerBridgeHandler<V>
  ): void {
    this.handlers.set(name, config as TriggerBridgeHandler<any>);
  }

  getHandler(name: string): TriggerPropHandler | undefined {
    return this.handlers.get(name)?.handler as TriggerPropHandler | undefined;
  }

  has(prefix: string): boolean {
    return this.handlers.has(prefix);
  }

  clear(): void {
    this.handlers.clear();
  }
}

// Global registry instance
const triggerBridgeRegistry = new TriggerBridgeRegistry();

// Enhanced onTriggerProp with bridge support
function onTriggerProp(
  prefix: string,
  key: string
): TriggerPropHandler | undefined {
  // 1. Check built-in trigger props (style, class) - highest priority
  const builtinHandler = triggerProps[prefix as keyof TriggerPropsType];
  if (builtinHandler) return builtinHandler(key);

  // 2. Check platform bridge registry for dynamic handlers
  const bridgeHandlerByPrefix = triggerBridgeRegistry.getHandler(prefix);
  if (bridgeHandlerByPrefix) return bridgeHandlerByPrefix;

  const bridgeHandlerByKey = triggerBridgeRegistry.getHandler(key);
  if (bridgeHandlerByKey) return bridgeHandlerByKey;

  return undefined;
}

/*#################################(With TriggerProps)#################################*/

function getDocument(): Document {
  if (typeof document === "undefined") {
    throw new Error("Document is not available in this environment");
  }
  return document;
}

/*#################################(Platform Event Handlers)#################################*/

// Event name groups as const tuples for DX typing helpers
export const DOM_POINTER_EVENTS = [
  "click",
  "dblclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerout",
  "pointerenter",
  "pointerleave",
  "contextmenu",
] as const;

export const DOM_KEYBOARD_EVENTS = ["keydown", "keyup", "keypress"] as const;

export const DOM_FORM_EVENTS = [
  "input",
  "change",
  "submit",
  "reset",
  "focus",
  "blur",
  "focusin",
  "focusout",
] as const;

export const DOM_TOUCH_EVENTS = [
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
] as const;

export const DOM_MISC_EVENTS = [
  "scroll",
  "resize",
  "load",
  "unload",
  "error",
  "abort",
] as const;

// Create DOM event handler factory
type AnyEventHandler = (...args: any[]) => any;
type MaybeSignalHandler = AnyEventHandler | Signal<AnyEventHandler>;

function DOMEventHandler(
  eventName: string
): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!val) return;

    function _handler(_event: Event): void {}

    if (isSignal(val)) {
      let currentHandler: any = null;
      val.connect(function () {
        const newHandler = val.peek();
        if (currentHandler) {
          node.removeEventListener(eventName, currentHandler);
        }
        if (newHandler) {
          currentHandler = (event: Event) => newHandler(event);
          node.addEventListener(eventName, currentHandler as AnyEventHandler);
        }
      });
    } else if (typeof val === "function") {
      node.addEventListener(eventName, val as AnyEventHandler);
    }
  };
}

/**
 * Register standard DOM events into the bridge registry.
 * Call this from an extension setup hook.
 */
export function InDOMTriggerProps(): void {
  // Exported event name groups for DX typing helpers
  // Keeping as const tuples to power literal union types

  // Pointer events
  /** @internal */
  // deno-lint-ignore no-explicit-any
  (globalThis as any).INTERNAL_IN_POINTER_EVENTS = DOM_POINTER_EVENTS;
  // Keyboard events
  // deno-lint-ignore no-explicit-any
  (globalThis as any).INTERNAL_IN_KEYBOARD_EVENTS = DOM_KEYBOARD_EVENTS;
  // Form events
  // deno-lint-ignore no-explicit-any
  (globalThis as any).INTERNAL_IN_FORM_EVENTS = DOM_FORM_EVENTS;
  // Touch events
  // deno-lint-ignore no-explicit-any
  (globalThis as any).INTERNAL_IN_TOUCH_EVENTS = DOM_TOUCH_EVENTS;
  // Misc events
  // deno-lint-ignore no-explicit-any
  (globalThis as any).INTERNAL_IN_MISC_EVENTS = DOM_MISC_EVENTS;
  // Pointer events
  DOM_POINTER_EVENTS.forEach((event: (typeof DOM_POINTER_EVENTS)[number]) => {
    triggerBridgeRegistry.register(event, {
      handler: DOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Keyboard events
  DOM_KEYBOARD_EVENTS.forEach((event: (typeof DOM_KEYBOARD_EVENTS)[number]) => {
    triggerBridgeRegistry.register(event, {
      handler: DOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Form events
  DOM_FORM_EVENTS.forEach((event: (typeof DOM_FORM_EVENTS)[number]) => {
    triggerBridgeRegistry.register(event, {
      handler: DOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Touch events
  DOM_TOUCH_EVENTS.forEach((event: (typeof DOM_TOUCH_EVENTS)[number]) => {
    triggerBridgeRegistry.register(event, {
      handler: DOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Other common events
  DOM_MISC_EVENTS.forEach((event: (typeof DOM_MISC_EVENTS)[number]) => {
    triggerBridgeRegistry.register(event, {
      handler: DOMEventHandler(event),
      platforms: ["dom"],
    });
  });
}

/*#################################(Universal Triggers)#################################*/

export type InUniversalTriggerPropsType =
  | "tap"
  | "longpress"
  | "rightclick"
  | "escape"
  | "mount"
  | "route"
  | "beforeMount"
  | "frameChange"
  | "change"
  | "submit"
  | "focus"
  | "hover"
  | "hoverstart"
  | "hoverend"
  // Capacitor app lifecycle and navigation
  | "back"
  | "resume"
  | "pause"
  | "urlopen"
  | "statechange"
  | "restored";

function DOMLongPressHandler(durationMs = 500): TriggerPropHandler {
  return function (node: Element, val: any): void {
    if (!val) return;
    let timeoutId: number | null = null;

    const onDown = () => {
      cleanup();
      timeoutId = setTimeout(() => {
        if (typeof val === "function") val({ type: "longpress" });
      }, durationMs) as unknown as number;
    };
    const cleanup = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const onUp = cleanup;
    const onLeave = cleanup;

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointerleave", onLeave);
  };
}

function DOMMountHandler(): TriggerPropHandler<
  AnyEventHandler | Signal<AnyEventHandler>
> {
  const mounted = new WeakSet<Element>();
  return function (node: Element, val: any): void {
    if (!node || mounted.has(node)) return;
    mounted.add(node);
    const cb = isSignal(val) ? val.peek() : val;
    if (typeof cb === "function") {
      nextTick(function () {
        // Fire after current tick to ensure node is connected
        try {
          cb({ type: "mount" });
        } catch {
          // ignore errors from user callback
        }
      });
    }
  };
}

function DOMBeforeMountHandler(): TriggerPropHandler<MaybeSignalHandler> {
  const fired = new WeakSet<Element>();
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val || fired.has(node)) return;
    fired.add(node);
    const cb = isSignal(val) ? (val.peek() as any) : (val as any);
    if (typeof cb === "function") {
      try {
        cb({ type: "beforeMount" });
      } catch {
        // ignore user callback errors
      }
    }
  };
}

let ROUTE_EVENT_NAME: string | null = null;
let routeDocListener: ((ev: Event) => void) | null = null;
const routeCallbacks = new Map<Element, AnyEventHandler>();

function DOMRouteHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    ROUTE_EVENT_NAME =
      (globalThis as any).IN_ROUTE_EVENT_NAME || ROUTE_EVENT_NAME || "in-route";

    let currentHandler: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const cb = val.peek();
        currentHandler =
          typeof cb === "function"
            ? (detail: any) => (cb as AnyEventHandler)(detail)
            : null;
        if (currentHandler) routeCallbacks.set(node, currentHandler);
        else routeCallbacks.delete(node);
      });
    } else if (typeof val === "function") {
      currentHandler = val as AnyEventHandler;
      routeCallbacks.set(node, currentHandler);
    }

    if (!routeDocListener) {
      routeDocListener = function (ev: Event): void {
        const detail = (ev as any).detail || ev;
        // Iterate stable snapshot to allow mutation during iteration
        for (const [el, cb] of Array.from(routeCallbacks.entries())) {
          if (!(el as any).isConnected) {
            routeCallbacks.delete(el);
            continue;
          }
          try {
            cb(detail);
          } catch {
            // ignore user handler errors
          }
        }
      };
      document.addEventListener(
        ROUTE_EVENT_NAME || "in-route",
        routeDocListener as AnyEventHandler
      );
    }
  };
}

// ========================= (Escape Global Listener) =========================
let escapeDocListener: ((ev: KeyboardEvent) => void) | null = null;
const escapeCallbacks = new Map<Element, AnyEventHandler>();

function DOMEscapeHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;

    let currentHandler: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const cb = val.peek();
        currentHandler =
          typeof cb === "function"
            ? (detail: any) => (cb as AnyEventHandler)(detail)
            : null;
        if (currentHandler) escapeCallbacks.set(node, currentHandler);
        else escapeCallbacks.delete(node);
      });
    } else if (typeof val === "function") {
      currentHandler = val as AnyEventHandler;
      escapeCallbacks.set(node, currentHandler);
    }

    if (!escapeDocListener) {
      escapeDocListener = function (ev: KeyboardEvent): void {
        if (ev.key !== "Escape") return;
        // Snapshot to allow mutation during iteration
        for (const [el, cb] of Array.from(escapeCallbacks.entries())) {
          if (!(el as any).isConnected) {
            escapeCallbacks.delete(el);
            continue;
          }
          try {
            cb(ev);
          } catch {
            // ignore user handler errors
          }
        }
      };
      document.addEventListener("keydown", escapeDocListener as any);
    }
  };
}

// ========================= (FrameChange Global Loop) =========================
let rafId: number | null = null;
let lastTs: number | null = null;
let frameStart: number = 0;
let frameCount: number = 0;
let frameLoopActive = false;
const frameCallbacks = new Map<Element, AnyEventHandler>();

function startFrameLoop(): void {
  if (frameLoopActive) return;
  frameLoopActive = true;
  const w: any = typeof window !== "undefined" ? window : globalThis;
  const rAF: any = w?.requestAnimationFrame?.bind(w);
  const cAF: any = w?.cancelAnimationFrame?.bind(w);

  const step = (ts: number): void => {
    if (!frameStart) frameStart = ts;
    const delta = lastTs == null ? 0 : ts - lastTs;
    lastTs = ts;
    frameCount++;
    const elapsed = ts - frameStart;

    // Snapshot to allow mutation during iteration
    for (const [el, cb] of Array.from(frameCallbacks.entries())) {
      if (!(el as any).isConnected) {
        frameCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: "frameChange",
          time: ts,
          delta,
          elapsed,
          frame: frameCount,
        });
      } catch {
        // ignore user callback errors
      }
    }

    if (frameCallbacks.size === 0) {
      frameLoopActive = false;
      lastTs = null;
      frameStart = 0;
      frameCount = 0;
      if (cAF && rafId != null) cAF(rafId);
      rafId = null;
      return;
    }

    if (rAF) rafId = rAF(step);
    else
      rafId = setTimeout(
        () => step((w?.performance || performance).now()),
        16
      ) as any;
  };

  if (rAF) rafId = rAF(step);
  else
    rafId = setTimeout(
      () => step((w?.performance || performance).now()),
      16
    ) as any;
}

function DOMFrameChangeHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let cb: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        if (typeof v === "function") {
          cb = v as AnyEventHandler;
          frameCallbacks.set(node, cb);
          startFrameLoop();
        } else {
          frameCallbacks.delete(node);
        }
      });
    } else if (typeof val === "function") {
      cb = val as AnyEventHandler;
      frameCallbacks.set(node, cb);
      startFrameLoop();
    }
  };
}

// ========================= (Hover Handlers) =========================
function DOMHoverHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;

    let isHovering = false;
    const cb = isSignal(val) ? val.peek() : val;

    if (typeof cb !== "function") return;

    const handleEnter = (e: Event) => {
      if (!isHovering) {
        isHovering = true;
        cb({ type: "hover", hovering: true, event: e });
      }
    };

    const handleLeave = (e: Event) => {
      if (isHovering) {
        isHovering = false;
        cb({ type: "hover", hovering: false, event: e });
      }
    };

    node.addEventListener("pointerenter", handleEnter);
    node.addEventListener("pointerleave", handleLeave);

    // Cleanup
    return () => {
      node.removeEventListener("pointerenter", handleEnter);
      node.removeEventListener("pointerleave", handleLeave);
    };
  };
}

function DOMHoverStartHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;

    const cb = isSignal(val) ? val.peek() : val;
    if (typeof cb !== "function") return;

    const handler = (e: Event) => cb({ type: "hoverstart", event: e });
    node.addEventListener("pointerenter", handler);

    return () => {
      node.removeEventListener("pointerenter", handler);
    };
  };
}

function DOMHoverEndHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;

    const cb = isSignal(val) ? val.peek() : val;
    if (typeof cb !== "function") return;

    const handler = (e: Event) => cb({ type: "hoverend", event: e });
    node.addEventListener("pointerleave", handler);

    return () => {
      node.removeEventListener("pointerleave", handler);
    };
  };
}

// ========================= (RightClick / Context Menu) =========================
function DOMRightClickHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;

    const cb = isSignal(val) ? val.peek() : val;
    if (typeof cb !== "function") return;

    const handler = (e: MouseEvent) => {
      try {
        e.preventDefault();
      } catch {}
      (cb as AnyEventHandler)({
        type: "rightclick",
        event: e,
        x: e.clientX,
        y: e.clientY,
      });
    };

    node.addEventListener("contextmenu", handler as AnyEventHandler);

    return () => {
      node.removeEventListener("contextmenu", handler as AnyEventHandler);
    };
  };
}

/*#################################(Register Platform-Bridged Triggers)#################################*/

/** Register platform-bridged universal triggers */
export function InUniversalTriggerProps(): void {
  const env = detectEnvironment();

  // DOM/Web bridge
  if (env.type === "dom" || env.type === "electron" || env.type === "lynx") {
    // mount → fire once after mount
    createTrigger("mount", DOMMountHandler());
    // beforeMount → fire synchronously during directive setup
    createTrigger("beforeMount", DOMBeforeMountHandler());
    // route → global route event
    createTrigger("route", DOMRouteHandler());
    // frameChange → requestAnimationFrame loop
    createTrigger("frameChange", DOMFrameChangeHandler());
    // tap → click
    createTrigger("tap", DOMEventHandler("click"));
    // rightclick → contextmenu (prevent default)
    createTrigger("rightclick", DOMRightClickHandler());
    // escape → document-level keydown Escape
    createTrigger("escape", DOMEscapeHandler());
    // longpress → synth from pointer events
    createTrigger("longpress", DOMLongPressHandler());
    // change → change
    createTrigger("change", DOMEventHandler("change"));
    // submit → submit
    createTrigger("submit", DOMEventHandler("submit"));
    // focus → focus
    createTrigger("focus", DOMEventHandler("focus"));
    // hover → hover state tracking
    createTrigger("hover", DOMHoverHandler());
    // hoverstart → pointerenter
    createTrigger("hoverstart", DOMHoverStartHandler());
    // hoverend → pointerleave
    createTrigger("hoverend", DOMHoverEndHandler());
    return;
  }
  // Capacitor (WebView + native App bridge)
  if (env.type === "capacitor") {
    // Base DOM mappings still apply
    createTrigger("mount", DOMMountHandler());
    createTrigger("beforeMount", DOMBeforeMountHandler());
    createTrigger("route", DOMRouteHandler());
    createTrigger("frameChange", DOMFrameChangeHandler());
    createTrigger("tap", DOMEventHandler("click"));
    createTrigger("rightclick", DOMRightClickHandler());
    createTrigger("escape", DOMEscapeHandler());
    createTrigger("longpress", DOMLongPressHandler());
    createTrigger("change", DOMEventHandler("change"));
    createTrigger("submit", DOMEventHandler("submit"));
    createTrigger("focus", DOMEventHandler("focus"));

    // Dynamically attach Capacitor App event trigger props
    try {
      const dynamicImport = (s: string) =>
        new Function("s", "return import(s)")(s);
      (async () => {
        try {
          const { App } = await dynamicImport("@capacitor/app");
          // Android back button
          createTrigger("back", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("backButton", (ev: any) =>
              cb(ev ?? { type: "back" })
            );
          });
          // App resume
          createTrigger("resume", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("resume", (ev: any) =>
              cb(ev ?? { type: "resume" })
            );
          });
          // App pause
          createTrigger("pause", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("pause", (ev: any) => cb(ev ?? { type: "pause" }));
          });
          // Deep links
          createTrigger("urlopen", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("appUrlOpen", (ev: any) =>
              cb({ type: "urlopen", ...ev })
            );
          });
          // App active/inactive
          createTrigger("statechange", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("appStateChange", (ev: any) =>
              cb({ type: "statechange", ...ev })
            );
          });
          // Restored result
          createTrigger("restored", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("restoredResult", (ev: any) =>
              cb({ type: "restored", ...ev })
            );
          });
        } catch {
          // @capacitor/app not installed; skip app triggers
        }
      })();
    } catch {
      // Dynamic import not supported; skip app triggers
    }
    return;
  }
  // TODO(@benemma): Native/XR bridges (later)
}

/**
 * Register custom platform-specific trigger handlers
 */
export function createTrigger<Name extends string, V = any>(
  name: Name,
  handler: TriggerPropHandler<V>,
  options?: {
    platforms?: PlatformType[];
    fallback?: string;
    priority?: number;
  }
): void {
  triggerBridgeRegistry.register<Name, V>(name, {
    handler,
    ...options,
  });
}

export const withTriggerProps: WithTriggerPropsType = {
  get doc() {
    return getDocument();
  },
  namespaces,
  tagNamespaceMap,
  tagAliases,
  propAliases,
  onTriggerProp,
};
