export type AllowedScheme = "http:" | "https:" | "mailto:" | "tel:";

const DEFAULT_ALLOWED_SCHEMES: AllowedScheme[] = [
  "http:",
  "https:",
  "mailto:",
  "tel:",
];

/**
 * Check whether a given href is safe to navigate to.
 * - Disallows javascript:, data: and other unknown schemes
 * - Optionally enforces same-origin and prefix
 */
export function isSafeHref(
  href: string,
  options: {
    allowedSchemes?: AllowedScheme[];
    origin?: string;
    requireSameOrigin?: boolean;
    prefix?: string;
  } = {}
): boolean {
  const {
    allowedSchemes = DEFAULT_ALLOWED_SCHEMES,
    origin = typeof globalThis !== "undefined" && (globalThis as any).location
      ? (globalThis as any).location.origin
      : undefined,
    requireSameOrigin = true,
    prefix,
  } = options;

  if (!href) return false;

  // Allow hash-only navigations
  if (href.startsWith("#")) return true;

  // Construct URL relative to current origin when possible
  let url: URL | null = null;
  try {
    url = new URL(href, origin || undefined);
  } catch {
    return false;
  }

  // Scheme allowlist
  if (!allowedSchemes.includes(url.protocol as AllowedScheme)) return false;

  // Same-origin policy
  if (requireSameOrigin && origin && url.origin !== origin) return false;

  // Optional path prefix enforcement
  if (prefix && !url.pathname.startsWith(prefix)) return false;

  return true;
}

/** Normalize a href relative to current origin and optional prefix */
export function normalizeHref(href: string, prefix = ""): string {
  if (!href) return href;
  if (href.startsWith("#")) return href;
  try {
    const url = new URL(
      href,
      typeof globalThis !== "undefined" && (globalThis as any).location
        ? (globalThis as any).location.origin
        : "http://localhost"
    );
    const pathto = url.pathname;
    const search = url.search;
    const hash = url.hash;
    const base = prefix
      ? pathto.startsWith(prefix)
        ? pathto
        : prefix + pathto
      : pathto;
    return `${base}${search}${hash}`;
  } catch {
    return href;
  }
}

export function isLocalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return true;
  try {
    const url = new URL(
      href,
      typeof globalThis !== "undefined" && (globalThis as any).location
        ? (globalThis as any).location.origin
        : "http://localhost"
    );
    const origin =
      typeof globalThis !== "undefined" && (globalThis as any).location
        ? (globalThis as any).location.origin
        : url.origin;
    return url.origin === origin;
  } catch {
    return false;
  }
}
