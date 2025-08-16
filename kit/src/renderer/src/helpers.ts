import { isSignal, peek, bind } from "@in/teract/signal";

export function toKebabCase(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function computeClassString(input: any): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    return input
      .map((item) =>
        isSignal(item) ? String(peek(item) || "") : String(item || "")
      )
      .join(" ");
  }
  if (typeof input === "object") {
    const parts: string[] = [];
    for (const [cls, enabled] of Object.entries(input)) {
      const on = isSignal(enabled) ? peek(enabled) : enabled;
      if (on) parts.push(cls);
    }
    return parts.join(" ");
  }
  return String(input);
}

/** Serialize a style object (with optional platform selection) to a CSS string */
export function serializeStyle(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  const raw = (val as any).web ?? val;
  const styleObj = raw as Record<string, any>;
  const parts: string[] = [];
  for (const [k, v] of Object.entries(styleObj || {})) {
    const cssKey = toKebabCase(k);
    const next = isSignal(v) ? peek(v) : v;
    if (next === undefined || next === null || next === false) continue;
    parts.push(`${cssKey}: ${String(next)}`);
  }
  return parts.join("; ");
}

/** Apply a style object (with optional platform selection) to a DOM element */
export function applyWebStyle(node: HTMLElement, styleVal: any): void {
  if (styleVal === undefined || styleVal === null) return;
  if (typeof styleVal === "string") {
    node.setAttribute("style", styleVal);
    return;
  }
  const raw = styleVal.web ?? styleVal;
  const styleObj = raw as Record<string, any>;
  const style = (node as HTMLElement).style;
  for (const [k, v] of Object.entries(styleObj || {})) {
    const cssKey = toKebabCase(k);
    const needsPx =
      cssKey === "gap" || cssKey === "row-gap" || cssKey === "column-gap";
    if (isSignal(v)) {
      // Connect reactive value per key
      bind(() => {
        const next = peek(v as any);
        if (next === undefined || next === null || next === false)
          style.removeProperty(cssKey);
        else {
          const val =
            typeof next === "number" && needsPx ? `${next}px` : String(next);
          style.setProperty(cssKey, val);
        }
      }, v);
    } else if (v === undefined || v === null || v === false) {
      style.removeProperty(cssKey);
    } else {
      const val = typeof v === "number" && needsPx ? `${v}px` : String(v);
      style.setProperty(cssKey, val);
    }
  }
}
