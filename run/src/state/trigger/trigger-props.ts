import { nextTick, bind, isSignal } from "../../signal/index.ts";
import type { Signal } from "../../signal/index.ts";
import { detectEnvironment } from "../../renderer/environment.ts";

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
export function StandardDOMProps(): void {
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

export type UniversalTriggerProps =
  | "tap"
  | "longpress"
  | "change"
  | "submit"
  | "focus"
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

/** Register platform-bridged universal triggers */
export function registerUniversalTriggerProps(): void {
  const env = detectEnvironment();

  // DOM/Web bridge
  if (env.type === "dom" || env.type === "electron" || env.type === "lynx") {
    // tap → click
    createTriggerHandle("tap", DOMEventHandler("click"));
    // longpress → synth from pointer events
    createTriggerHandle("longpress", DOMLongPressHandler());
    // change → change
    createTriggerHandle("change", DOMEventHandler("change"));
    // submit → submit
    createTriggerHandle("submit", DOMEventHandler("submit"));
    // focus → focus
    createTriggerHandle("focus", DOMEventHandler("focus"));
    return;
  }
  // Capacitor (WebView + native App bridge)
  if (env.type === "capacitor") {
    // Base DOM mappings still apply
    createTriggerHandle("tap", DOMEventHandler("click"));
    createTriggerHandle("longpress", DOMLongPressHandler());
    createTriggerHandle("change", DOMEventHandler("change"));
    createTriggerHandle("submit", DOMEventHandler("submit"));
    createTriggerHandle("focus", DOMEventHandler("focus"));

    // Dynamically attach Capacitor App event trigger props
    try {
      const dynamicImport = (s: string) =>
        new Function("s", "return import(s)")(s);
      (async () => {
        try {
          const { App } = await dynamicImport("@capacitor/app");
          // Android back button
          createTriggerHandle("back", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("backButton", (ev: any) =>
              cb(ev ?? { type: "back" })
            );
          });
          // App resume
          createTriggerHandle("resume", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("resume", (ev: any) =>
              cb(ev ?? { type: "resume" })
            );
          });
          // App pause
          createTriggerHandle("pause", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("pause", (ev: any) => cb(ev ?? { type: "pause" }));
          });
          // Deep links
          createTriggerHandle("urlopen", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("appUrlOpen", (ev: any) =>
              cb({ type: "urlopen", ...ev })
            );
          });
          // App active/inactive
          createTriggerHandle("statechange", (_node, cb: any) => {
            if (!cb || !App?.addListener) return;
            App.addListener("appStateChange", (ev: any) =>
              cb({ type: "statechange", ...ev })
            );
          });
          // Restored result
          createTriggerHandle("restored", (_node, cb: any) => {
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
export function createTriggerHandle<Name extends string, V = any>(
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
