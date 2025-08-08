import { nextTick, bind, isSignal } from "../../signal/index.ts";

/*#################################(Types)
#################################*/

export type PlatformType = "dom" | "native" | "gpu";

/** Mapping of keys to arrays of values */
type KeyValsMap = Record<string, string[]>;

/** TriggerProp handler function type */
export type TriggerPropHandler = (node: Element, value: any) => void;

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

function prefix(prefixStr: string, keyArr: string[]): Record<string, string> {
  return Object.fromEntries(
    keyArr.map(function (i: string): [string, string] {
      return [i, `${prefixStr}${i}`];
    })
  );
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
  "class",
  "style",
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
export const propAliases: Record<string, string> = prefix("attr:", attributes);

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

interface TriggerBridgeHandler {
  handler: TriggerPropHandler;
  platforms?: PlatformType[];
  fallback?: string;
  priority?: number;
}

class TriggerBridgeRegistry {
  private handlers = new Map<string, TriggerBridgeHandler>();

  register(prefix: string, config: TriggerBridgeHandler): void {
    this.handlers.set(prefix, config);
  }

  getHandler(prefix: string): TriggerPropHandler | undefined {
    return this.handlers.get(prefix)?.handler;
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

// Create DOM event handler factory
function createDOMEventHandler(eventName: string): TriggerPropHandler {
  return function (node: Element, val: any): void {
    if (!val) return;

    function handler(event: Event): void {
      if (typeof val === "function") {
        val(event);
      }
    }

    if (isSignal(val)) {
      let currentHandler: any = null;
      val.connect(function () {
        const newHandler = val.peek();
        if (currentHandler) {
          node.removeEventListener(eventName, currentHandler);
        }
        if (newHandler) {
          currentHandler = (event: Event) => newHandler(event);
          node.addEventListener(eventName, currentHandler);
        }
      });
    } else if (typeof val === "function") {
      node.addEventListener(eventName, handler);
    }
  };
}

/**
 * Register standard DOM events into the bridge registry.
 * Call this from an extension setup hook.
 */
export function registerStandardDOMEvents(): void {
  // Pointer events
  [
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
  ].forEach((event) => {
    triggerBridgeRegistry.register(event, {
      handler: createDOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Keyboard events
  ["keydown", "keyup", "keypress"].forEach((event) => {
    triggerBridgeRegistry.register(event, {
      handler: createDOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Form events
  [
    "input",
    "change",
    "submit",
    "reset",
    "focus",
    "blur",
    "focusin",
    "focusout",
  ].forEach((event) => {
    triggerBridgeRegistry.register(event, {
      handler: createDOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Touch events
  ["touchstart", "touchend", "touchmove", "touchcancel"].forEach((event) => {
    triggerBridgeRegistry.register(event, {
      handler: createDOMEventHandler(event),
      platforms: ["dom"],
    });
  });

  // Other common events
  ["scroll", "resize", "load", "unload", "error", "abort"].forEach((event) => {
    triggerBridgeRegistry.register(event, {
      handler: createDOMEventHandler(event),
      platforms: ["dom"],
    });
  });
}

/**
 * Register custom platform-specific trigger handlers
 */
export function registerTriggerHandler(
  prefix: string,
  handler: TriggerPropHandler,
  options?: {
    platforms?: PlatformType[];
    fallback?: string;
    priority?: number;
  }
): void {
  triggerBridgeRegistry.register(prefix, {
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
