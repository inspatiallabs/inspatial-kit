import type { AnyFunction, DrawerDirection } from "./type.ts";

interface Style {
  [key: string]: string;
}

const cache = new WeakMap();

export function isInView(el: any): boolean {
  const rect = el.getBoundingClientRect();

  if (!globalThis.visualViewport) return false;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    // Need + 40 for safari detection
    rect.bottom <= globalThis.visualViewport.height - 40 &&
    rect.right <= globalThis.visualViewport.width
  );
}

export function setPresentationDrawer(
  el: any | null | undefined,
  styles: Style,
  ignoreCache = false
) {
  if (!el || !(el as any).style) return;
  const originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value;
  });

  if (ignoreCache) return;

  cache.set(el, originalStyles);
}

export function reset(el: any | null, prop?: string) {
  if (!el || !(el as any).style) return;
  const originalStyles = cache.get(el);

  if (!originalStyles) {
    return;
  }

  if (prop) {
    (el.style as any)[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      (el.style as any)[key] = value;
    });
  }
}

export const isVerticalDrawer = (direction: DrawerDirection): boolean => {
  switch (direction) {
    case "top":
    case "bottom":
      return true;
    case "left":
    case "right":
      return false;
    default:
      return direction satisfies never;
  }
};

export function getTranslate(
  element: any,
  direction: DrawerDirection
): number | null {
  if (!element) {
    return null;
  }
  const style = globalThis.getComputedStyle(element);
  const transform =
    // @ts-ignore
    style.transform || style.webkitTransform || style.mozTransform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(
      mat[1].split(", ")[isVerticalDrawer(direction) ? 13 : 12]
    );
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat
    ? parseFloat(mat[1].split(", ")[isVerticalDrawer(direction) ? 5 : 4])
    : null;
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2);
}

export function assignStyle(
  element: any | null | undefined,
  style: Partial<JSX.ISSProps>
) {
  if (!element) return () => {};

  const prevStyle = element.style.cssText;
  Object.assign(element.style, style);

  return () => {
    element.style.cssText = prevStyle;
  };
}

/**
 * Receives functions as arguments and returns a new function that calls all.
 */
export function chain<T>(...fns: T[]) {
  return (...args: T extends AnyFunction ? Parameters<T> : never) => {
    for (const fn of fns) {
      if (typeof fn === "function") {
        // @ts-ignore
        fn(...args);
      }
    }
  };
}
