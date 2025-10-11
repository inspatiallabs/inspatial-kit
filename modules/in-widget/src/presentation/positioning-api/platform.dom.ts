/*#######################(Get Element Rect)#######################*/
export function getElementRect(node: any): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  if (!node || !node.getBoundingClientRect)
    return { top: 0, left: 0, width: 0, height: 0 };
  const r = node.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/*#######################(Get Virtual Point Rect)#######################*/
export function getVirtualPointRect(point: { x: number; y: number }): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  return { top: point.y, left: point.x, width: 1, height: 1 };
}

/*#######################(Get Floating Size)#######################*/
export function getFloatingSize(node: any): { width: number; height: number } {
  if (!node || !node.getBoundingClientRect) return { width: 0, height: 0 };
  const r = node.getBoundingClientRect();
  return { width: r.width, height: r.height };
}

/*#######################(Get Nearest Scroll Root)#######################*/
export function getNearestScrollRoot(from: any): any {
  try {
    let node: any =
      (from && (from.nodeType === 1 ? from : from?.parentElement)) || null;
    while (
      node &&
      node !== document.body &&
      node !== document.documentElement
    ) {
      const style = getComputedStyle(node);
      const oy = style.overflowY;
      const ox = style.overflowX;
      const isScroll = (v: string) => v === "auto" || v === "scroll";
      if (isScroll(oy) || isScroll(ox)) return node;
      node = node.parentElement;
    }
  } catch {}
  return (document.scrollingElement || document.documentElement) as any;
}

/*#######################(Get Rect)#######################*/
export function getRect(nodeOrElement: any): {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
} {
  const r = (nodeOrElement?.getBoundingClientRect?.() || {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }) as any;
  return {
    top: r.top || 0,
    left: r.left || 0,
    width: r.width || 0,
    height: r.height || 0,
    right: (r.left || 0) + (r.width || 0),
    bottom: (r.top || 0) + (r.height || 0),
  };
}

/*#######################(Is RTL)#######################*/
export function isRTL(el?: any): boolean {
  try {
    const root = (el?.ownerDocument || document).documentElement;
    return (root && root.dir === "rtl") || false;
  } catch {
    return false;
  }
}
