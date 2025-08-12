import { createRenderer } from "./create-renderer.ts";
import {
  composeExtensions,
  type RendererExtensions,
} from "./create-extension.ts";

export interface NativeScriptOptions {
  rendererID?: string;
  extensions?: RendererExtensions;
}

/**
 * NativeScript renderer
 */
export function NativeScriptRenderer(options: NativeScriptOptions = {}): any {
  const { rendererID = "NativeScript" } = options;
  const { setups } = composeExtensions(options.extensions);

  // TODO: Implement NativeScript renderer
  // This will provide a DOM-compatible interface for NativeScript
  console.warn("NativeScript renderer not yet implemented - using fallback");

  interface NSNode {
    _isNSNode: true;
    tagName: string;
    children: NSNode[];
    props: Record<string, any>;
  }

  function createNode(tagName: string): NSNode {
    return {
      _isNSNode: true,
      tagName,
      children: [],
      props: {},
    };
  }

  const nodeOps = {
    isNode: (node: any) => node?._isNSNode,
    createNode,
    createTextNode: (text: string | any) => createNode("text"),
    createAnchor: (text: string | any) => createNode("anchor"),
    createFragment: () => createNode("fragment"),
    removeNode: () => {},
    appendNode: (parent: any, ...nodes: any[]) =>
      parent.children.push(...nodes),
    insertBefore: () => {},
    setProps: (node: any, props: any) => Object.assign(node.props, props),
  };

  const renderer = createRenderer(nodeOps, rendererID);
  setups.forEach((fn) => {
    try {
      fn(renderer);
    } catch (e) {
      console.warn("[extensions] setup() failed:", e);
    }
  });
  return renderer;
}
