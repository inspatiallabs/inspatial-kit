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
) => void | (() => void);

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
  // Normalize common alias keys to canonical universal trigger names
  const aliasMap: Record<string, string> = {
    // Gesture aliases
    press: "tap",
    pointertap: "tap",
    doubletap: "dblclick",
    dbltap: "dblclick",
    // Context/menu
    contextmenu: "rightclick",
    // Hover aliases
    mouseenter: "hoverstart",
    mouseover: "hoverstart",
    mouseleave: "hoverend",
    mouseout: "hoverend",
    // Gamepad aliases (DOM event names → universal trigger names)
    gamepadconnected: "gamepadconnect",
    gamepaddisconnected: "gamepaddisconnect",
    // Key naming preference: map keytap* → key*
    keytap: "key",
    "keytap:down": "key:down",
    "keytap:up": "key:up",
  };
  const canonicalKey = aliasMap[key] ?? key;

  // 1. Check built-in trigger props (style, class) - highest priority
  const builtinHandler = triggerProps[prefix as keyof TriggerPropsType];
  if (builtinHandler) return builtinHandler(key);

  // 2. Check platform bridge registry for dynamic handlers
  const bridgeHandlerByPrefix = triggerBridgeRegistry.getHandler(prefix);
  if (bridgeHandlerByPrefix) return bridgeHandlerByPrefix;

  const bridgeHandlerByKey = triggerBridgeRegistry.getHandler(canonicalKey);
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
  | "key"
  | "key:down"
  | "key:up"
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
  | "gamepad"
  | "gamepadconnect"
  | "gamepaddisconnect"
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

// ========================= (Keyboard: keytap base + escape sugar) =========================
let keyDocDownListener: ((ev: KeyboardEvent) => void) | null = null;
let keyDocUpListener: ((ev: KeyboardEvent) => void) | null = null;
const keytapCallbacks = new Map<Element, AnyEventHandler>();
const keytapDownCallbacks = new Map<Element, AnyEventHandler>();
const keytapUpCallbacks = new Map<Element, AnyEventHandler>();
const escapeCallbacks = new Map<Element, AnyEventHandler>();

function ensureKeyListeners(): void {
  if (keyDocDownListener && keyDocUpListener) return;
  keyDocDownListener = function (ev: KeyboardEvent): void {
    // keytap base (down phase)
    for (const [el, cb] of Array.from(keytapCallbacks.entries())) {
      if (!(el as any).isConnected) {
        keytapCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: "keytap",
          phase: "down",
          key: ev.key,
          code: ev.code,
          repeat: ev.repeat,
          event: ev,
        });
      } catch {
        // ignore user handler errors
      }
    }
    // keytap:down
    for (const [el, cb] of Array.from(keytapDownCallbacks.entries())) {
      if (!(el as any).isConnected) {
        keytapDownCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: "keytap",
          phase: "down",
          key: ev.key,
          code: ev.code,
          repeat: ev.repeat,
          event: ev,
        });
      } catch {
        // ignore user handler errors
      }
    }
    // escape sugar (down only)
    if (ev.key === "Escape") {
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
    }
  };
  keyDocUpListener = function (ev: KeyboardEvent): void {
    // keytap base (up phase)
    for (const [el, cb] of Array.from(keytapCallbacks.entries())) {
      if (!(el as any).isConnected) {
        keytapCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: "keytap",
          phase: "up",
          key: ev.key,
          code: ev.code,
          repeat: ev.repeat,
          event: ev,
        });
      } catch {
        // ignore user handler errors
      }
    }
    // keytap:up
    for (const [el, cb] of Array.from(keytapUpCallbacks.entries())) {
      if (!(el as any).isConnected) {
        keytapUpCallbacks.delete(el);
        continue;
      }
      try {
        cb({
          type: "keytap",
          phase: "up",
          key: ev.key,
          code: ev.code,
          repeat: ev.repeat,
          event: ev,
        });
      } catch {
        // ignore user handler errors
      }
    }
  };
  document.addEventListener("keydown", keyDocDownListener as any);
  document.addEventListener("keyup", keyDocUpListener as any);
}

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

    ensureKeyListeners();
  };
}

function DOMKeyTapBaseHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let cb: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        if (typeof v === "function") {
          cb = v as AnyEventHandler;
          keytapCallbacks.set(node, cb);
          ensureKeyListeners();
        } else {
          keytapCallbacks.delete(node);
        }
      });
    } else if (typeof val === "function") {
      cb = val as AnyEventHandler;
      keytapCallbacks.set(node, cb);
      ensureKeyListeners();
    }
  };
}

function DOMKeyTapDownHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let cb: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        if (typeof v === "function") {
          cb = v as AnyEventHandler;
          keytapDownCallbacks.set(node, cb);
          ensureKeyListeners();
        } else {
          keytapDownCallbacks.delete(node);
        }
      });
    } else if (typeof val === "function") {
      cb = val as AnyEventHandler;
      keytapDownCallbacks.set(node, cb);
      ensureKeyListeners();
    }
  };
}

function DOMKeyTapUpHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let cb: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        if (typeof v === "function") {
          cb = v as AnyEventHandler;
          keytapUpCallbacks.set(node, cb);
          ensureKeyListeners();
        } else {
          keytapUpCallbacks.delete(node);
        }
      });
    } else if (typeof val === "function") {
      cb = val as AnyEventHandler;
      keytapUpCallbacks.set(node, cb);
      ensureKeyListeners();
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
  return function (
    node: Element,
    val: MaybeSignalHandler
  ): void | (() => void) {
    if (!node || !val) return;

    let isHovering = false;
    let cleanupFn: (() => void) | null = null;

    // Handle signal changes for reactive hover handlers
    if (isSignal(val)) {
      val.connect(function () {
        // Clean up previous listeners
        if (cleanupFn) {
          cleanupFn();
          cleanupFn = null;
        }

        const cb = val.peek();
        if (typeof cb !== "function") return;

        const handleEnter = (_e: Event) => {
          if (!isHovering) {
            isHovering = true;
            cb(true);
          }
        };

        const handleLeave = (_e: Event) => {
          if (isHovering) {
            isHovering = false;
            cb(false);
          }
        };

        node.addEventListener("pointerenter", handleEnter);
        node.addEventListener("pointerleave", handleLeave);

        cleanupFn = () => {
          node.removeEventListener("pointerenter", handleEnter);
          node.removeEventListener("pointerleave", handleLeave);
          // Auto cleanup - ensure we send false when removing listeners
          if (isHovering) {
            isHovering = false;
            try {
              cb(false);
            } catch {
              // Ignore errors during cleanup
            }
          }
        };
      });
    } else if (typeof val === "function") {
      const cb = val;

      const handleEnter = (_e: Event) => {
        if (!isHovering) {
          isHovering = true;
          cb(true);
        }
      };

      const handleLeave = (_e: Event) => {
        if (isHovering) {
          isHovering = false;
          cb(false);
        }
      };

      node.addEventListener("pointerenter", handleEnter);
      node.addEventListener("pointerleave", handleLeave);

      cleanupFn = () => {
        node.removeEventListener("pointerenter", handleEnter);
        node.removeEventListener("pointerleave", handleLeave);
        // Auto cleanup - ensure we send false when removing listeners
        if (isHovering) {
          isHovering = false;
          try {
            cb(false);
          } catch {
            // Ignore errors during cleanup
          }
        }
      };
    }

    // Return cleanup function for proper disposal
    return cleanupFn || undefined;
  };
}

function DOMHoverStartHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (
    node: Element,
    val: MaybeSignalHandler
  ): void | (() => void) {
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
  return function (
    node: Element,
    val: MaybeSignalHandler
  ): void | (() => void) {
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
  return function (
    node: Element,
    val: MaybeSignalHandler
  ): void | (() => void) {
    if (!node || !val) return;

    const cb = isSignal(val) ? val.peek() : val;
    if (typeof cb !== "function") return;

    const handler = (e: MouseEvent) => {
      try {
        e.preventDefault();
      } catch {
        // ignore errors preventing default
      }
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

// ========================= (Gamepad Handlers) =========================
type GamepadInfo = {
  connected: boolean;
  buttonA: boolean;
  buttonB: boolean;
  buttonX: boolean;
  buttonY: boolean;
  joystick: [number, number];
  joystickRight: [number, number];
  RB: boolean;
  LB: boolean;
  RT: boolean;
  LT: boolean;
  start: boolean;
  select: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

function createDisconnectedInfo(): GamepadInfo {
  return {
    connected: false,
    buttonA: false,
    buttonB: false,
    buttonX: false,
    buttonY: false,
    joystick: [0, 0],
    joystickRight: [0, 0],
    RB: false,
    LB: false,
    RT: false,
    LT: false,
    start: false,
    select: false,
    up: false,
    down: false,
    left: false,
    right: false,
  };
}

function toGamepadInfo(gp: any): GamepadInfo {
  if (!gp) return createDisconnectedInfo();
  const buttons = gp.buttons || [];
  const axes = gp.axes || [];
  return {
    connected: true,
    buttonA: !!buttons[0]?.pressed,
    buttonB: !!buttons[1]?.pressed,
    buttonX: !!buttons[2]?.pressed,
    buttonY: !!buttons[3]?.pressed,
    joystickRight: [axes[2] ?? 0, axes[3] ?? 0],
    LT: !!buttons[6]?.pressed,
    RT: !!buttons[7]?.pressed,
    LB: !!buttons[4]?.pressed,
    RB: !!buttons[5]?.pressed,
    start: !!buttons[9]?.pressed,
    select: !!buttons[8]?.pressed,
    up: !!buttons[12]?.pressed,
    down: !!buttons[13]?.pressed,
    left: !!buttons[14]?.pressed,
    right: !!buttons[15]?.pressed,
    joystick: [axes[0] ?? 0, axes[1] ?? 0],
  };
}

let gamepadIntervalId: number | null = null;
let lastSerializedGamepadInfo: string | null = null;
const gamepadCallbacks = new Map<Element, AnyEventHandler>();

function readFirstGamepad(): any | null {
  try {
    // deno-lint-ignore no-explicit-any
    const n: any = typeof navigator !== "undefined" ? navigator : null;
    if (!n || typeof n.getGamepads !== "function") return null;
    const pads = n.getGamepads ? n.getGamepads() : [];
    return pads && pads[0] ? pads[0] : null;
  } catch {
    return null;
  }
}

function startGamepadPolling(): void {
  if (gamepadIntervalId != null) return;
  const w: any = typeof window !== "undefined" ? window : globalThis;
  // Poll ~10Hz
  gamepadIntervalId = (w?.setInterval || setInterval)(() => {
    const gp = readFirstGamepad();
    const info = toGamepadInfo(gp);
    const serialized = JSON.stringify(info);
    if (serialized === lastSerializedGamepadInfo) {
      // No change; skip notify
    } else {
      lastSerializedGamepadInfo = serialized;
      for (const [el, cb] of Array.from(gamepadCallbacks.entries())) {
        if (!(el as any).isConnected) {
          gamepadCallbacks.delete(el);
          continue;
        }
        try {
          cb(info);
        } catch {
          // ignore user callback errors
        }
      }
    }

    if (gamepadCallbacks.size === 0 && gamepadIntervalId != null) {
      (w?.clearInterval || clearInterval)(gamepadIntervalId);
      gamepadIntervalId = null;
      lastSerializedGamepadInfo = null;
    }
  }, 100);
}

function DOMGamepadPollHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let cb: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        if (typeof v === "function") {
          cb = v as AnyEventHandler;
          gamepadCallbacks.set(node, cb);
          startGamepadPolling();
        } else {
          gamepadCallbacks.delete(node);
        }
      });
    } else if (typeof val === "function") {
      cb = val as AnyEventHandler;
      gamepadCallbacks.set(node, cb);
      startGamepadPolling();
    }
  };
}

let gpConnectListener: ((ev: any) => void) | null = null;
let gpDisconnectListener: ((ev: any) => void) | null = null;
const gamepadConnectCallbacks = new Map<Element, AnyEventHandler>();
const gamepadDisconnectCallbacks = new Map<Element, AnyEventHandler>();

function DOMGamepadConnectHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let currentHandler: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        currentHandler =
          typeof v === "function"
            ? (d: any) => (v as AnyEventHandler)(d)
            : null;
        if (currentHandler) gamepadConnectCallbacks.set(node, currentHandler);
        else gamepadConnectCallbacks.delete(node);
      });
    } else if (typeof val === "function") {
      currentHandler = val as AnyEventHandler;
      gamepadConnectCallbacks.set(node, currentHandler);
    }

    if (!gpConnectListener) {
      gpConnectListener = function (ev: any): void {
        for (const [el, cb] of Array.from(gamepadConnectCallbacks.entries())) {
          if (!(el as any).isConnected) {
            gamepadConnectCallbacks.delete(el);
            continue;
          }
          try {
            cb({
              type: "gamepadconnect",
              event: ev,
              index: ev?.gamepad?.index,
              id: ev?.gamepad?.id,
            });
          } catch {
            // ignore user handler errors
          }
        }
      };
      const w: any = typeof window !== "undefined" ? window : globalThis;
      w.addEventListener?.(
        "gamepadconnected",
        gpConnectListener as AnyEventHandler
      );
    }
  };
}

function DOMGamepadDisconnectHandler(): TriggerPropHandler<MaybeSignalHandler> {
  return function (node: Element, val: MaybeSignalHandler): void {
    if (!node || !val) return;
    let currentHandler: AnyEventHandler | null = null;
    if (isSignal(val)) {
      val.connect(function () {
        const v = val.peek();
        currentHandler =
          typeof v === "function"
            ? (d: any) => (v as AnyEventHandler)(d)
            : null;
        if (currentHandler)
          gamepadDisconnectCallbacks.set(node, currentHandler);
        else gamepadDisconnectCallbacks.delete(node);
      });
    } else if (typeof val === "function") {
      currentHandler = val as AnyEventHandler;
      gamepadDisconnectCallbacks.set(node, currentHandler);
    }

    if (!gpDisconnectListener) {
      gpDisconnectListener = function (ev: any): void {
        for (const [el, cb] of Array.from(
          gamepadDisconnectCallbacks.entries()
        )) {
          if (!(el as any).isConnected) {
            gamepadDisconnectCallbacks.delete(el);
            continue;
          }
          try {
            cb({
              type: "gamepaddisconnect",
              event: ev,
              index: ev?.gamepad?.index,
              id: ev?.gamepad?.id,
            });
          } catch {
            // ignore user handler errors
          }
        }
      };
      const w: any = typeof window !== "undefined" ? window : globalThis;
      w.addEventListener?.(
        "gamepaddisconnected",
        gpDisconnectListener as AnyEventHandler
      );
    }
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
    // key unified keyboard
    createTrigger("key", DOMKeyTapBaseHandler());
    createTrigger("key:down", DOMKeyTapDownHandler());
    createTrigger("key:up", DOMKeyTapUpHandler());
    // Gamepad triggers
    createTrigger("gamepad", DOMGamepadPollHandler());
    createTrigger("gamepadconnect", DOMGamepadConnectHandler());
    createTrigger("gamepaddisconnect", DOMGamepadDisconnectHandler());
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
    // key unified keyboard
    createTrigger("key", DOMKeyTapBaseHandler());
    createTrigger("key:down", DOMKeyTapDownHandler());
    createTrigger("key:up", DOMKeyTapUpHandler());
    // Gamepad triggers (WebView)
    createTrigger("gamepad", DOMGamepadPollHandler());
    createTrigger("gamepadconnect", DOMGamepadConnectHandler());
    createTrigger("gamepaddisconnect", DOMGamepadDisconnectHandler());

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
