import type { ThemeSpec } from "./type.ts";

/*##############################################(CREATE THEME)##############################################*/
export function createTheme(props: ThemeSpec) {
  const attr = props.attr || "data-theme";
  const variants = Object.keys(props).filter(
    (k) => k !== "root" && k !== "attr"
  );

  function ensureStyleEl(): HTMLStyleElement | null {
    if (typeof document === "undefined") return null as any;
    const id = "in-theme-runtime";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  }

  function serializeVars(vars: Record<string, string>): string {
    return Object.entries(vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n");
  }

  function buildCss(current: ThemeSpec): string {
    const root = current.root || {};
    const out: string[] = [];
    out.push(`:root{${serializeVars(root)}}`);
    for (const v of variants) {
      const vars = (current as any)[v];
      if (vars && typeof vars === "object") {
        out.push(`[${attr}="${v}"]{${serializeVars(vars)}}`);
      }
    }
    return out.join("\n");
  }

  let current = props;

  function mount(target?: HTMLElement) {
    const el = ensureStyleEl();
    if (!el) return;
    el.textContent = buildCss(current);
    if (target) return;
  }

  function set(variant: string, target?: HTMLElement) {
    if (typeof document === "undefined") return;
    const node = target || document.documentElement;
    if (variant === "root") {
      node.removeAttribute(attr);
    } else {
      node.setAttribute(attr, variant);
    }
  }

  function update(partial: Partial<ThemeSpec>) {
    current = { ...current, ...partial } as ThemeSpec;
    mount();
  }

  function unmount() {
    if (typeof document === "undefined") return;
    const el = document.getElementById("in-theme-runtime");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  return { mount, set, update, unmount };
}
