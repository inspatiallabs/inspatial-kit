import type { Signal as _Signal } from "../../../signal/index.ts";
import { normalizeHref, isSafeHref } from "../../../route/sanitize.ts";
import type { detectBrowserEngine as _detectBrowserEngine } from "../../../env/index.ts";
import { getGlobalRenderer as _getGlobalRenderer } from "../../../runtime/jsx-runtime.ts";

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
  // Resolve the active renderer set by DOMRenderer.wrap
  const R: any = _getGlobalRenderer?.() || (globalThis as any).R || null;
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

  // Navigation handler via trigger-props
  const clickHandler = async (event?: any) => {
    if (props.disabled) return;
    const rt: any = (globalThis as any).InRoute;
    if (protect) {
      try {
        const res = await protect();
        if (res === false) return;
        if (typeof res === "string") {
          if (rt?.navigate) {
            event?.preventDefault?.();
            await rt.navigate(res, { replace: false });
          }
          return;
        }
      } catch {
        return;
      }
    }
    const sameOriginSafe = isSafeHref(normalized);
    if (rt?.navigate && sameOriginSafe) {
      event?.preventDefault?.();
      await rt.navigate(normalized, { replace: !!replace });
      return;
    }
    // Fallback: mutate history for SPA feel even if no router is set up
    if (sameOriginSafe) {
      event?.preventDefault?.();
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
    }
  };

  const rt: any = (globalThis as any).InRoute;
  const prefetchHandler = prefetch
    ? (_e?: any) => {
        try {
          rt?.prefetch?.(normalized);
        } catch {
          // best-effort prefetch
        }
      }
    : undefined;

  if (R && typeof R.c === "function") {
    return R.c(
      "a",
      {
        href: normalized,
        "on:tap": clickHandler,
        "on:pointerenter": prefetchHandler,
        ...rest,
      },
      ...children
    );
  }
  return null;
}
