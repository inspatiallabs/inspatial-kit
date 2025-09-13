import { createRenderer } from "@in/renderer/create-renderer.ts";
import {
  composeExtensions,
  type RendererExtensions,
} from "@in/extension/index.ts";
import { isSignal, peek } from "@in/teract/signal/index.ts";
import { computeClassString, serializeStyle } from "@in/renderer/helpers.ts";

const defaultRendererID = "SSR";

export interface SSROptions {
  rendererID?: string;
  selfClosingTags?: Set<string>;
  extensions?: RendererExtensions;
}

export function SSRRenderer(options: SSROptions = {}): any {
  const {
    rendererID = defaultRendererID,
    selfClosingTags = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]),
  } = options;
  // Normalize extensions and capture setups for parity with DOM renderer
  const { setups } = composeExtensions(options.extensions);

  interface SSRNode {
    _isHTMLNode: true;
    tagName: string;
    children: SSRNode[];
    props: Record<string, any>;
    text?: string;
    parent?: SSRNode;
    toString(): string;
  }

  function isNode(node: any): boolean {
    return (
      typeof node === "object" && node !== null && (node as any)._isHTMLNode
    );
  }

  function createNode(tagName: string): SSRNode {
    return {
      _isHTMLNode: true,
      tagName,
      children: [],
      props: {},
      toString() {
        const props = Object.entries(this.props || {})
          .filter(([key, value]) => value != null && key !== "children")
          .map(([key, value]) => {
            if (typeof value === "boolean") {
              return value ? key : "";
            }
            return `${key}="${String(value).replace(/"/g, "&quot;")}` + `"`;
          })
          .filter(Boolean)
          .join(" ");

        const propsStr = props ? ` ${props}` : "";

        if (selfClosingTags.has(tagName.toLowerCase())) {
          return `<${tagName}${propsStr} />`;
        }

        const childrenStr = (this.children || [])
          .map((c) => c.toString())
          .join("");
        return `<${tagName}${propsStr}>${childrenStr}</${tagName}>`;
      },
    };
  }

  function createTextNode(text: any): SSRNode {
    const textContent = isSignal(text) ? peek(text) : text;
    return {
      _isHTMLNode: true,
      tagName: "#text",
      children: [],
      props: {},
      text: String(textContent || ""),
      toString() {
        return (this.text || "").replace(/[<>&"]/g, (match) => {
          switch (match) {
            case "<":
              return "&lt;";
            case ">":
              return "&gt;";
            case "&":
              return "&amp;";
            case '"':
              return "&quot;";
            default:
              return match;
          }
        });
      },
    };
  }

  function createAnchor(text?: string): SSRNode {
    return createTextNode(text || "");
  }

  function createFragment(): SSRNode {
    return {
      _isHTMLNode: true,
      tagName: "#fragment",
      children: [],
      props: {},
      toString() {
        return (this.children || []).map((c) => c.toString()).join("");
      },
    };
  }

  function removeNode(_node: SSRNode): void {
    // SSR renderer doesn't need to track removal for string generation
  }

  function appendNode(parent: SSRNode, ...nodes: SSRNode[]): void {
    if (parent.children) {
      parent.children.push(...nodes);
      nodes.forEach((node) => {
        node.parent = parent;
      });
    }
  }

  function insertBefore(node: SSRNode, ref: SSRNode): void {
    if (ref.parent && ref.parent.children) {
      const index = ref.parent.children.indexOf(ref);
      if (index >= 0) {
        ref.parent.children.splice(index, 0, node);
        node.parent = ref.parent;
      }
    }
  }

  function resolvePropValue(value: any): any {
    return isSignal(value) ? peek(value) : value;
  }

  function setProps(node: SSRNode, props: Record<string, any>): void {
    const out: Record<string, any> = node.props || {};
    for (const [key, value] of Object.entries(props || {})) {
      if (key === "class" || key === "className") {
        out.class = computeClassString(value);
        continue;
      }
      if (key === "style") {
        out.style = serializeStyle(value);
        continue;
      }
      out[key] = resolvePropValue(value);
    }
    node.props = out;
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

  // Run extension setup hooks to keep behavior consistent across renderers
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
