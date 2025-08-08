import { isSignal, peek, bind } from "../signal/index.ts";
import { createRenderer } from "./create-renderer.ts";
import { cachedStrKeyNoFalsy, splitFirst } from "../utils.ts";
import { env } from "../env/index.ts";
import { wrap } from "../runtime/jsx-runtime.ts";
import { normalizeExtensions, type RendererExtensions } from "./extensions.ts";

const defaultRendererID = "DOM";

export interface DOMOptions {
  rendererID?: string;
  doc?: Document;
  extensions?: RendererExtensions;
}

export function DOMRenderer(options: DOMOptions = {}): any {
  const { rendererID = defaultRendererID, doc = document } = options;
  const {
    onDirective,
    namespaces,
    tagNamespaceMap,
    tagAliases,
    propAliases,
    setups,
  } = normalizeExtensions(options.extensions);

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
    return getNodeCreator(tagName)();
  }
  function createAnchor(anchorName?: string): any {
    if (!env.isProduction() && anchorName) {
      return doc.createComment(anchorName);
    }
    return doc.createTextNode("");
  }
  function createTextNode(text: any): any {
    if (isSignal(text)) {
      const node = doc.createTextNode("");
      text.connect(function () {
        const newData = peek(text);
        if (newData === undefined) node.data = "";
        else node.data = newData;
      });
      return node;
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
    for (let node of nodes) {
      parent.insertBefore(node, null);
    }
  }
  function insertBefore(node: any, ref: any): void {
    ref.parentNode.insertBefore(node, ref);
  }

  // Event listeners removed - now handled entirely by extensions

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

  const getPropSetter = cachedStrKeyNoFalsy(function (prop: string) {
    prop = propAliases[prop] || prop;
    const [prefix, key] = splitFirst(prop, ":");
    if (key) {
      switch (prefix) {
        default: {
          // All directives now go through extensions
          if (onDirective) {
            const setter = onDirective(prefix, key, prop);
            if (setter) {
              return setter;
            }
          }
          // Quietly ignore unknown directive-like props if no extensions handle them
          // If a known namespace is provided, set as namespaced attribute
          const nsuri = namespaces[prefix];
          if (nsuri) {
            return function (node: any, val: any) {
              return setAttrNS(node, key, val, nsuri);
            };
          }
          // Otherwise, ignore unsupported prefixed directives when no extension is connected
          return function () {
            /* no-op without trigger extensions */
          };
        }
        case "attr": {
          return function (node: any, val: any) {
            return setAttr(node, key, val);
          };
        }
        case "prop": {
          prop = key;
        }
      }
    } else if (prop.indexOf("-") > -1) {
      return function (node: any, val: any) {
        return setAttr(node, prop, val);
      };
    }

    return function (node: any, val: any) {
      if (val === undefined || val === null) return;
      if (isSignal(val)) {
        val.connect(function () {
          node[prop] = peek(val);
        });
      } else {
        node[prop] = val;
      }
    };
  });

  function setProps(node: any, props: Record<string, any>): void {
    for (let prop in props) getPropSetter(prop)(node, props[prop]);
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
