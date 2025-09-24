import { createRenderer } from "@in/renderer/create-renderer";
import {
  composeExtensions,
  type RendererExtensions,
} from "@in/teract/extension";

export interface HorizonOSOptions {
  rendererID?: string;
  extensions?: RendererExtensions;
}

/**
 * HorizonOS renderer for Meta Quest/VR platforms
 */
export function HorizonOSRenderer(options: HorizonOSOptions = {}): any {
  const { rendererID = "HorizonOS" } = options;
  const { setups } = composeExtensions(options.extensions);

  // TODO: Implement HorizonOS-specific rendering
  // This would integrate with Meta's Spatial SDK and WebXR
  console.warn("HorizonOS renderer not yet implemented - using fallback");

  interface HorizonOSNode {
    _isHorizonOSNode: true;
    tagName: string;
    children: HorizonOSNode[];
    props: Record<string, any>;
    spatial?: {
      position: [number, number, number];
      rotation: [number, number, number, number];
      scale: [number, number, number];
    };
  }

  function createNode(tagName: string): HorizonOSNode {
    return {
      _isHorizonOSNode: true,
      tagName,
      children: [],
      props: {},
      spatial: {
        position: [0, 0, -1], // Default position in VR space
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
      },
    };
  }

  const nodeOps = {
    isNode: (node: any) => node?._isHorizonOSNode,
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

export { HorizonOSRenderer as createHorizonOSRenderer };