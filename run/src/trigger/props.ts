import { nextTick, bind, isSignal } from "../signal/index.ts";
import type { PlatformType } from "../state/trigger-types.ts";

/*#################################(Types)#################################*/

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
  /********************************* (ClassName) *********************************/
  // className(key: string): TriggerPropHandler {
  //   return function (node: Element, val: any): void {
  //     if (val === undefined || val === null) return;

  //     const htmlElement = node as HTMLElement;

  //     function handler(newVal: any): void {
  //       nextTick(function (): void {
  //         if (newVal === undefined || newVal === null || newVal === false) {
  //           htmlElement.className = "";
  //         } else if (typeof newVal === "string") {
  //           htmlElement.className = newVal;
  //         } else if (Array.isArray(newVal)) {
  //           htmlElement.className = newVal.filter(Boolean).join(" ");
  //         } else if (typeof newVal === "object") {
  //           // Handle object format: { 'class1': true, 'class2': false }
  //           const classes = Object.entries(newVal)
  //             .filter(([_, active]) => Boolean(active))
  //             .map(([className, _]) => className);
  //           htmlElement.className = classes.join(" ");
  //         } else {
  //           htmlElement.className = String(newVal);
  //         }
  //       });
  //     }

  //     bind(handler, val);
  //   };
  // },
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
  const bridgeHandler = triggerBridgeRegistry.getHandler(prefix);
  if (bridgeHandler) return bridgeHandler;
  
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
      if (typeof val === 'function') {
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
    } else if (typeof val === 'function') {
      node.addEventListener(eventName, handler);
    }
  };
}

// Register basic DOM events
triggerBridgeRegistry.register('click', {
  handler: createDOMEventHandler('click'),
  platforms: ['dom'],
});

triggerBridgeRegistry.register('input', {
  handler: createDOMEventHandler('input'),
  platforms: ['dom'],
});

triggerBridgeRegistry.register('change', {
  handler: createDOMEventHandler('change'),
  platforms: ['dom'],
});

triggerBridgeRegistry.register('focus', {
  handler: createDOMEventHandler('focus'),
  platforms: ['dom'],
});

triggerBridgeRegistry.register('blur', {
  handler: createDOMEventHandler('blur'),
  platforms: ['dom'],
});

/**
 * Register custom platform-specific trigger handlers
 * 
 * @example
 * ```typescript
 * // Example: Custom swipe gesture handler
 * registerTriggerHandler('swipe', function (node: Element, val: any): void {
 *   if (!val) return;
 *   
 *   let startX = 0, startY = 0;
 *   
 *   function handleTouchStart(e: TouchEvent): void {
 *     startX = e.touches[0].clientX;
 *     startY = e.touches[0].clientY;
 *   }
 *   
 *   function handleTouchEnd(e: TouchEvent): void {
 *     const endX = e.changedTouches[0].clientX;
 *     const endY = e.changedTouches[0].clientY;
 *     const deltaX = endX - startX;
 *     const deltaY = endY - startY;
 *     
 *     // Detect swipe (minimum distance of 50px)
 *     if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
 *       const direction = Math.abs(deltaX) > Math.abs(deltaY) 
 *         ? (deltaX > 0 ? 'right' : 'left')
 *         : (deltaY > 0 ? 'down' : 'up');
 *       
 *       const swipeEvent = { direction, deltaX, deltaY, isSwipeEvent: true };
 *       if (typeof val === 'function') val(swipeEvent);
 *     }
 *   }
 *   
 *   // Handle signal connections
 *   if (isSignal(val)) {
 *     let currentHandler: any = null;
 *     val.connect(() => {
 *       const newHandler = val.peek();
 *       if (currentHandler) {
 *         node.removeEventListener('touchstart', handleTouchStart);
 *         node.removeEventListener('touchend', handleTouchEnd);
 *       }
 *       if (newHandler) {
 *         currentHandler = newHandler;
 *         node.addEventListener('touchstart', handleTouchStart);
 *         node.addEventListener('touchend', handleTouchEnd);
 *       }
 *     });
 *   } else if (typeof val === 'function') {
 *     node.addEventListener('touchstart', handleTouchStart);
 *     node.addEventListener('touchend', handleTouchEnd);
 *   }
 * }, {
 *   platforms: ['dom', 'native:ios', 'native:android'],
 *   priority: 1
 * });
 * 
 * // Usage in JSX:
 * <div on:swipe={(e) => console.log('Swiped:', e.direction)} />
 * 
 * // iOS-specific input example:
 * registerTriggerHandler('iosOnlyInput', createIOSInputHandler(), {
 *   platforms: ['native:ios'],
 *   fallback: 'input'
 * });
 * 
 * // XR spatial tap example:
 * registerTriggerHandler('spatialTap', createSpatialHandler(), {
 *   platforms: ['native:visionos', 'native:horizonos'],
 *   fallback: 'click'
 * });
 * ```
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
