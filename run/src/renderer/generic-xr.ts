import { createRenderer } from "./create-renderer.ts";
import {
  composeExtensions,
  type RendererExtensions,
} from "./create-extension.ts";

export interface GenericXROptions {
  rendererID?: string;
  extensions?: RendererExtensions;
}

/**
 * Generic XR renderer fallback
 */
export function GenericXRRenderer(options: GenericXROptions = {}): any {
  const { rendererID = "GenericXR" } = options;
  const { setups } = composeExtensions(options.extensions);

  // Basic XR renderer for WebXR environments
  console.log("Using generic XR renderer for WebXR environment");

  interface XRNode {
    _isXRNode: true;
    tagName: string;
    children: XRNode[];
    props: Record<string, any>;
    spatial?: {
      position: [number, number, number];
      rotation: [number, number, number, number];
    };
  }

  function createNode(tagName: string): XRNode {
    return {
      _isXRNode: true,
      tagName,
      children: [],
      props: {},
      spatial: {
        position: [0, 0, -1], // Default 1 meter away
        rotation: [0, 0, 0, 1],
      },
    };
  }

  const nodeOps = {
    isNode: (node: any) => node?._isXRNode,
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
