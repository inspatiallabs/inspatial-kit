import { isSignal, peek, bind } from "@in/teract/signal";
import { createRenderer } from "./create-renderer.ts";
import { cachedStrKeyNoFalsy, splitFirst } from "@in/vader";
import { env } from "@in/vader/env/index.ts";
import { wrap } from "@in/jsx-runtime";
import { composeExtensions, type RendererExtensions } from "@in/extension";
import { applyWebStyle, computeClassString } from "./helpers.ts";

const defaultRendererID = "DOM";

export interface DOMOptions {
  rendererID?: string;
  doc?: Document;
  extensions?: RendererExtensions;
}

export function DOMRenderer(options: DOMOptions = {}): any {
  const { rendererID = defaultRendererID, doc = document } = options;
  const { onDirective, namespaces, tagNamespaceMap, tagAliases, setups } =
    composeExtensions(options.extensions);

  function isNode(node: any): boolean {
    return !!(node && node.cloneNode);
  }

  const getNodeCreator = cachedStrKeyNoFalsy(function (tagNameRaw: string) {
    let [nsuri, tagName] = tagNameRaw.split(":");
    if (!tagName) {
      tagName = nsuri;
      nsuri = tagNamespaceMap[tagName];
    }
    tagName = tagAliases[tagName] || tagName;
    if (nsuri) {
      nsuri = namespaces[nsuri] || nsuri;
      return function () {
        return doc.createElementNS(nsuri, tagName);
      };
    }
    return function () {
      return doc.createElement(tagName);
    };
  });

  function createNode(tagName: string): any {
    // Ensure SVG root defaults to the correct namespace
    if (tagName === "svg") {
      return doc.createElementNS(namespaces.svg, "svg");
    }
    return getNodeCreator(tagName)();
  }
  function createAnchor(anchorName?: string): any {
    // Always use a Comment as fragment anchor to avoid text-node layout side-effects inside SVG or HTML
    return doc.createComment(env.isProduction() ? "" : anchorName || "");
  }
  function createTextNode(text: any): any {
    if (isSignal(text)) {
      // Dynamic region with start/end anchors to safely manage fragment children
      const start = doc.createComment("dyn-start");
      const end = doc.createComment("dyn-end");
      const frag = doc.createDocumentFragment();
      frag.appendChild(start);
      frag.appendChild(end);

      let currentNodes: Node[] = [];

      const clear = (parent: Node): void => {
        if (!currentNodes.length) return;
        for (const n of currentNodes) {
          try {
            if ((n as any).parentNode) (n as any).parentNode.removeChild(n);
          } catch {}
        }
        currentNodes = [];
      };

      const insert = (parent: Node, val: any): void => {
        if (val && (val as any).cloneNode) {
          const node = val as Node;
          if ((node as any).nodeType === 11) {
            // DocumentFragment → move its children
            while ((node as any).firstChild) {
              const child = (node as any).firstChild as Node;
              (parent as any).insertBefore(child, end);
              currentNodes.push(child);
            }
          } else {
            (parent as any).insertBefore(node, end);
            currentNodes.push(node);
          }
        } else {
          if (val === true || val === false) return; // don't render raw booleans
          const tn = doc.createTextNode(String(val));
          (parent as any).insertBefore(tn, end);
          currentNodes.push(tn);
        }
      };

      const mount = (val: any): void => {
        const parent = (end as any).parentNode;
        if (!parent) return;
        // Clear existing content
        clear(parent);
        if (val === undefined || val === null || val === false) return;
        insert(parent, val);
      };

      let latest: any = undefined;
      bind(function (next: any) {
        latest = next;
        queueMicrotask(() => mount(latest));
      }, text);
      // Initial: wait until anchors are attached to a parent before mounting
      (function tryInit(attempts = 0) {
        const parent = (end as any).parentNode;
        if (!parent) {
          if (attempts < 5) {
            requestAnimationFrame(() => tryInit(attempts + 1));
          } else {
            // Final attempt even if parent is still null
            queueMicrotask(() => mount(latest));
          }
          return;
        }
        mount(latest);
      })();
      return frag;
    }

    return doc.createTextNode(text);
  }
  function createFragment(): any {
    return doc.createDocumentFragment();
  }

  function removeNode(node: any): void {
    if (!node.parentNode) return;
    node.parentNode.removeChild(node);
  }
  function appendNode(parent: any, ...nodes: any[]): void {
    for (const node of nodes) {
      parent.insertBefore(node, null);
    }
  }
  function insertBefore(node: any, ref: any): void {
    // Defensive: if ref is a document fragment end marker (Text/Comment), use parent
    if (ref && ref.parentNode) ref.parentNode.insertBefore(node, ref);
  }

  // NOTE: Event listeners are resolved by extensions via onDirective; ensure triggers are available

  function setAttr(node: any, attr: string, val: any): void {
    if (val === undefined || val === null || val === false) return;

    function handler(newVal: any) {
      if (newVal === undefined || newVal === null || newVal === false)
        node.removeAttribute(attr);
      else if (newVal === true) node.setAttribute(attr, "");
      else node.setAttribute(attr, newVal);
    }

    bind(handler, val);
  }
  // eslint-disable-next-line max-params
  function setAttrNS(node: any, attr: string, val: any, ns: string): void {
    if (val === undefined || val === null || val === false) return;

    function handler(newVal: any) {
      if (newVal === undefined || newVal === null || newVal === false)
        node.removeAttributeNS(ns, attr);
      else if (newVal === true) node.setAttributeNS(ns, attr, "");
      else node.setAttributeNS(ns, attr, newVal);
    }

    bind(handler, val);
  }

  function applyClass(node: HTMLElement, value: any): void {
    const cls = computeClassString(value);
    // SVG elements need attribute-based class assignment for compatibility
    const isSVG = (node as any).namespaceURI === namespaces.svg;
    if (isSVG) (node as Element).setAttribute("class", cls || "");
    else (node as HTMLElement).className = cls;
  }

  const getPropSetter = cachedStrKeyNoFalsy(function (_prop: string) {
    const prop = _prop;
    const [prefix, key] = splitFirst(prop, ":");
    if (key) {
      // Delegate directive-like prefixes to extensions or namespaces
      // Unknown prefixes are ignored safely
      if (onDirective) {
        const setter = onDirective(prefix, key, prop);
        if (setter) return setter;
      }
      const nsuri = namespaces[prefix];
      if (nsuri) {
        return function (node: any, val: any) {
          return setAttrNS(node, key, val, nsuri);
        };
      }
      return function () {
        /* no-op for unrecognized directive prefixes */
      };
    }

    // Structured reactive className handling
    if (prop === "class" || prop === "className") {
      return function (node: any, val: any) {
        if (val === undefined || val === null) return;
        if (isSignal(val)) {
          val.connect(function () {
            applyClass(node as HTMLElement, peek(val));
          });
          // Initial
          applyClass(node as HTMLElement, peek(val));
        } else {
          // Connect to nested signals inside arrays/objects (best-effort)
          if (Array.isArray(val)) {
            for (const item of val) {
              if (isSignal(item)) {
                item.connect(function () {
                  applyClass(node as HTMLElement, val);
                });
              }
            }
          } else if (typeof val === "object") {
            for (const enabled of Object.values(val)) {
              if (isSignal(enabled)) {
                enabled.connect(function () {
                  applyClass(node as HTMLElement, val);
                });
              }
            }
          }
          applyClass(node as HTMLElement, val);
        }
      };
    }

    // Structured universal style prop
    if (prop === "style") {
      return function (node: any, val: any) {
        if (val === undefined || val === null) return;
        if (isSignal(val)) {
          val.connect(function () {
            applyWebStyle(node as HTMLElement, peek(val));
          });
        } else {
          applyWebStyle(node as HTMLElement, val);
        }
      };
    }

    // Hyphenated keys are always attributes (e.g., data-*, aria-*)
    if (prop.indexOf("-") > -1) {
      return function (node: any, val: any) {
        return setAttr(node, prop, val);
      };
    }

    // Default: SVG prefers attribute assignment; HTML prefers property when available
    return function (node: any, val: any) {
      if (val === undefined || val === null) return;
      const isSVG = (node as any).namespaceURI === namespaces.svg;
      const useProperty = !isSVG && prop in node;
      if (isSignal(val)) {
        val.connect(function () {
          const next = peek(val);
          if (useProperty) (node as any)[prop] = next;
          else setAttr(node, prop, next);
        });
      } else {
        if (useProperty) (node as any)[prop] = val;
        else setAttr(node, prop, val);
      }
    };
  });

  function setProps(node: any, props: Record<string, any>): void {
    for (const prop in props) getPropSetter(prop)(node, props[prop]);
  }

  const nodeOps = {
    isNode,
    createNode,
    createAnchor,
    createTextNode,
    createFragment,
    setProps,
    insertBefore,
    appendNode,
    removeNode,
  };

  const renderer = createRenderer(nodeOps, rendererID);

  // Automatically wrap JSX runtime with this renderer
  wrap(renderer);

  // Run extension setup hooks
  setups.forEach((fn) => {
    try {
      fn(renderer);
    } catch (e) {
      console.warn(`[extensions] setup() failed:`, e);
    }
  });

  return renderer;
}

export { defaultRendererID };
