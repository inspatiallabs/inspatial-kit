import type { Signal as _Signal } from "../../../signal/index.ts";
import { createRenderer } from "../../../renderer/create-renderer.ts";
import { normalizeHref } from "../../../route/sanitize.ts";
import { createTriggerHandle } from "../../../state/trigger/trigger-props.ts";

interface LinkProps {
  to: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  replace?: boolean;
  prefetch?: boolean;
  modeOverride?: "spa" | "mpa";
  protect?: () => boolean | string | Promise<boolean | string>;
  class?: any;
  [prop: string]: any;
}

export function Link(props: LinkProps, ...children: any[]): any {
  const R: any =
    (createRenderer as any) ||
    (globalThis as any).jsxRuntime?.getGlobalRenderer?.();
  const {
    to,
    params,
    query,
    replace,
    prefetch,
    protect,
    modeOverride: _modeOverride,
    ...rest
  } = props;

  // Build href string from to/params/query
  let href = to;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      href = href.replace(new RegExp(`\\[${k}\\]`, "g"), encodeURIComponent(v));
      href = href.replace(
        new RegExp(`\\{${k}(?::[^}]*)?\\}`, "g"),
        encodeURIComponent(v)
      );
    }
  }
  if (query && Object.keys(query).length > 0) {
    const qs = Object.entries(query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    href += (href.includes("?") ? "&" : "?") + qs;
  }
  const normalized = normalizeHref(href);

  // Bridge trigger events using trigger-props
  const clickHandler = async () => {
    if (props.disabled) return;
    if (protect) {
      try {
        const res = await protect();
        if (res === false) return;
        if (typeof res === "string") {
          (globalThis as any).history?.pushState({ path: res }, "", res);
          // notify
          if (
            (globalThis as any).dispatchEvent &&
            (globalThis as any).PopStateEvent
          ) {
            (globalThis as any).dispatchEvent(
              new (globalThis as any).PopStateEvent("popstate")
            );
          }
          return;
        }
      } catch {
        return;
      }
    }
    if (replace)
      (globalThis as any).history?.replaceState(
        { path: normalized },
        "",
        normalized
      );
    else
      (globalThis as any).history?.pushState(
        { path: normalized },
        "",
        normalized
      );
    if (
      (globalThis as any).dispatchEvent &&
      (globalThis as any).PopStateEvent
    ) {
      (globalThis as any).dispatchEvent(
        new (globalThis as any).PopStateEvent("popstate")
      );
    }
  };

  function onRef(node: Element) {
    // Map universal triggers to platform-specific
    createTriggerHandle("tap", (_node, cb: any) => {
      _node.addEventListener("click", () => cb?.());
    });
    createTriggerHandle("pointerenter", (_node, cb: any) => {
      _node.addEventListener("pointerenter", () => cb?.());
    });
    // Attach our handlers via bridge
    const tap = clickHandler as any;
    const enter = prefetch ? () => {} : undefined;
    // Use trigger-props attributes through renderer; here we manually wire for now
    if (tap) (node as any).onclick = tap;
    if (enter) (node as any).onpointerenter = enter;
  }

  return R.c("a", { href: normalized, $ref: onRef, ...rest }, ...children);
}
