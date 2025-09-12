import { styleContextRegistry } from "./context.ts";
import { signalStyleContextRegistry } from "./signal-context.ts";
import { globalStyleRegistry } from "./global-registry.ts";

/*##############################################(TYPES)##############################################*/

type ClassValueProp =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValueProp[];

type OmitUndefined<T> = T extends undefined ? never : T;
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Extract props type from a style function or object
 * Works with direct style functions and style objects
 */
type StyleProps<T> = T extends (props?: infer P) => string
  ? OmitUndefined<P>
  : T extends { getStyle: (props?: infer P) => string }
  ? OmitUndefined<P>
  : never;

/*##############################################(UTILITIES)##############################################*/

// Tailwind-style class merging
const TW_PROPERTIES: Record<string, boolean> = {
  // Layout
  float: true,
  clear: true,
  position: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  z: true,
  order: true,

  // Display & Box Behavior
  grid: true,
  flex: true,
  basis: true,
  grow: true,
  shrink: true,

  // Spacing (Margin/Padding)
  m: true,
  mx: true,
  my: true,
  mt: true,
  mr: true,
  mb: true,
  ml: true,
  p: true,
  px: true,
  py: true,
  pt: true,
  pr: true,
  pb: true,
  pl: true,

  // Sizing
  w: true,
  "min-w": true,
  "max-w": true,
  h: true,
  "min-h": true,
  "max-h": true,

  // Typography
  text: true,
  font: true,
  tracking: true,
  leading: true,
  list: true,
  decoration: true,
  underline: true,
  "line-through": true,
  "no-underline": true,

  // Backgrounds
  bg: true,
  from: true,
  via: true,
  to: true,

  // Borders
  border: true,
  "border-t": true,
  "border-r": true,
  "border-b": true,
  "border-l": true,
  rounded: true,
  "rounded-t": true,
  "rounded-r": true,
  "rounded-b": true,
  "rounded-l": true,
  "rounded-tl": true,
  "rounded-tr": true,
  "rounded-br": true,
  "rounded-bl": true,
  divide: true,

  // Effects
  shadow: true,
  opacity: true,
  "mix-blend": true,
  blur: true,

  // Transitions & Animation
  transition: true,
  duration: true,
  ease: true,
  delay: true,

  // Transforms
  scale: true,
  rotate: true,
  translate: true,
  skew: true,
  origin: true,

  // Interactivity
  cursor: true,
  select: true,
  resize: true,

  // SVG
  fill: true,
  stroke: true,

  // Accessibility
  sr: true,

  // Tables
  table: true,

  // Effects
  filter: true,
  backdrop: true,

  // Color utilities
  color: true,
  accent: true,

  // Display
  display: true,
  visibility: true,

  // Flexbox & Grid
  items: true,
  justify: true,
  content: true,
  place: true,
  self: true,

  // Columns & Gaps
  gap: true,
  "gap-x": true,
  "gap-y": true,
  col: true,
  row: true,

  // Overflow
  overflow: true,
  "overflow-x": true,
  "overflow-y": true,

  // Overscroll
  overscroll: true,
  "overscroll-x": true,
  "overscroll-y": true,
};

/*##############################################(SPLIT-TAILWIND-CLASS)##############################################*/

function _splitTailwindClass(className: string): [string, string, string] {
  // Handle pseudo-classes and breakpoints
  const [styles, ...rest] = className.split(":").reverse();
  const base = rest.length ? rest.reverse().join(":") : "";

  // Extract property and value
  // Tailwind class structure is either 'property' or 'property-value'
  const matches = styles.match(/^([a-zA-Z0-9-]+)(?:-(.+))?$/);
  if (!matches) return ["", "", styles];

  const [, property, value = ""] = matches;
  return [base, property, value];
}

/*##############################################(MERGE-CLASSES)##############################################*/

function mergeClasses(classes: string[]): string {
  // Flatten the input classes and filter out falsy values
  const allClassNames: string[] = [];
  classes.forEach((cls) => {
    if (!cls) return;
    allClassNames.push(...cls.split(/\s+/).filter(Boolean));
  });

  // Keep track of Tailwind utilities we've seen
  const utilityMap: Record<string, string> = {};
  const finalClasses: string[] = [];

  // Process class names in reverse order so later ones win
  for (let i = allClassNames.length - 1; i >= 0; i--) {
    const className = allClassNames[i];
    if (!className) continue;

    // For Tailwind utility classes, check for conflicts
    if (isTailwindClass(className)) {
      const { style, utility, fullClass } = parseTailwindClass(className);

      // Special handling for specific utility types that need more granular keys
      // For classes like text-sm, text-base, text-lg we want to keep all of them
      // and not treat them as conflicts
      let key;

      // For text utilities, use the full class as the key if it's a size value
      if (
        utility === "text" &&
        /text-(xs|sm|base|lg|xl|[0-9]+xl)/.test(fullClass)
      ) {
        key = style ? `${style}:${fullClass}` : fullClass;
      }
      // For padding and margin, p-1, p-2, etc. should conflict
      else {
        key = style ? `${style}:${utility}` : utility;
      }

      // If we haven't seen this utility type before, add it
      if (!utilityMap[key]) {
        utilityMap[key] = className;
        finalClasses.unshift(className); // Add to beginning since we're going in reverse
      }
    } else {
      // For non-Tailwind classes, just add them if we haven't seen them
      if (!finalClasses.includes(className)) {
        finalClasses.unshift(className);
      }
    }
  }

  return finalClasses.join(" ");
}

/**
 * Checks if a class name is a Tailwind utility class
 */
function isTailwindClass(className: string): boolean {
  // Get the base class without styles
  const baseName = className.split(":").pop() || "";
  // Extract the utility prefix
  const utilityPrefix = baseName.split("-")[0];

  return Boolean(utilityPrefix && TW_PROPERTIES[utilityPrefix]);
}

/**
 * Parses a Tailwind class into its style and utility parts
 */
function parseTailwindClass(className: string): {
  style: string;
  utility: string;
  fullClass: string;
} {
  const parts = className.split(":");
  let style = "";
  let baseClass = className;

  // Handle style prefixes
  if (parts.length > 1) {
    style = parts.slice(0, -1).join(":");
    baseClass = parts[parts.length - 1];
  }

  // Extract the utility prefix from the base class
  const utilityPrefix = baseClass.split("-")[0];

  return {
    style,
    utility: utilityPrefix,
    fullClass: baseClass,
  };
}

/*##############################################(TO-VAL)##############################################*/
function toVal(mix: ClassValueProp): string {
  let str = "";

  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object") {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k]);
          if (y) {
            str && (str += " ");
            str += y;
          }
        }
      }
    } else {
      for (const key in mix) {
        if (mix && typeof mix === "object" && mix[key]) {
          str && (str += " ");
          str += key;
        }
      }
    }
  }
  return str;
}

/*##############################################(iss-UTIL)##############################################*/
function issUtil(...inputs: ClassValueProp[]): string {
  let str = "";
  for (let i = 0; i < inputs.length; i++) {
    const tmp = inputs[i];
    if (tmp) {
      const x = toVal(tmp);
      if (x) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}

/*##############################################(FALSY-TO-STRING)##############################################*/
const falsyToString = <T extends unknown>(value: T) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

/*##############################################(style-SYSTEM)##############################################*/

type StyleShapeProp = Record<string, Record<string, ClassValueProp>>;
type StyleSchemaProp<V extends StyleShapeProp> = {
  [Style in keyof V]?: StringToBoolean<keyof V[Style]> | undefined;
};

/**
 * Type definition for style configuration objects
 * For type inference and IDE autocompletion
 */
export interface InSpatialStyleConfig<V extends StyleShapeProp> {
  /** Name identifier for cross-style composition references */
  name?: string;

  /** Base classes applied to all instances */
  base?: ClassValueProp;

  /** Style settings mapping style names to their possible values */
  settings?: V;

  /** Compound styles for complex combinations */
  composition?: Array<{
    [key: string]: any;
    class?: ClassValueProp;
    className?: ClassValueProp;
    style?: JSX.UniversalStyleProps;
  }>;

  /** Default values for styles */
  defaultSettings?: StyleSchemaProp<V>;

  /** Hooks for customizing the output class names */
  hooks?: {
    /** Function called after generating the final className */
    onComplete?: (className: string) => string;
  };
}

type StyleConfigProp = InSpatialStyleConfig<any>;

interface ComposeStyleProp {
  <T extends ReturnType<StyleProp>[]>(...components: [...T]): (
    props?: (
      | UnionToIntersection<
          {
            [K in keyof T]: StyleProps<T[K]>;
          }[number]
        >
      | undefined
    ) & {
      class?: ClassValueProp;
      className?: ClassValueProp;
    }
  ) => string;
}

interface StyleProp {
  <V extends StyleShapeProp>(config: InSpatialStyleConfig<V>): (
    props?: StyleSchemaProp<V> & {
      class?: ClassValueProp;
      className?: ClassValueProp;
    }
  ) => string;
}

/**
 * Standard interface for all style system returns
 * Ensures consistency across different creation methods
 */
interface StyleSystemReturn<V extends StyleShapeProp = any> {
  /** Core function to apply styles */
  getStyle: (
    props?: StyleSchemaProp<V> & {
      class?: ClassValueProp;
      className?: ClassValueProp;
    }
  ) => string;

  /** Utility for combining classes with intelligent conflict resolution */
  iss: (...inputs: ClassValueProp[]) => string;

  /** Creates style functions with configurable styles */
  style: StyleProp;

  /** Utility for combining multiple style components */
  composeStyle: ComposeStyleProp;

  /** Configuration used to create this style (only if direct config was provided) */
  config?: InSpatialStyleConfig<V>;
}

/**
 * Core implementation of the style system
 * This is used internally by both the global exports and createStyle
 */
function createStyleCore<V extends StyleShapeProp>(
  options?: StyleConfigProp
): StyleSystemReturn<V> {
  const iss = (...inputs: ClassValueProp[]): string => {
    const className = issUtil(inputs);
    return (
      options?.hooks?.onComplete?.(className) ??
      mergeClasses(className.split(" "))
    );
  };

  function isPlatformStyleObject(obj: any): boolean {
    if (!obj || typeof obj !== "object") return false;
    const platformKeys = [
      "web",
      "ios",
      "android",
      "visionOS",
      "androidXR",
      "horizonOS",
    ];
    if (platformKeys.some((k) => k in obj)) return true;
    // Heuristic: treat object as class dict only if all values are boolean
    const vals = Object.values(obj);
    if (!vals.length) return false;
    return !vals.every((v) => typeof v === "boolean");
  }

  function mergeStyle(target: any, source: any): any {
    if (!source) return target;
    if (!target) target = {};
    for (const [k, v] of Object.entries(source)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        target[k] = mergeStyle(target[k] || {}, v);
      } else {
        target[k] = v;
      }
    }
    return target;
  }

  // -------------------------- Web Style injection -------------------------- //
  let __inVariantStyleEl: any = null;
  const __injectedStyleHashes = new Set<string>();

  function __ensureStyleEl(): any {
    try {
      if (typeof document === "undefined") return null;
      if (__inVariantStyleEl && __inVariantStyleEl.parentNode)
        return __inVariantStyleEl;
      const el = document.createElement("style");
      el.setAttribute("data-in-variant", "");
      document.head.appendChild(el);
      __inVariantStyleEl = el;
      return el;
    } catch {
      return null;
    }
  }

  function __toKebabCase(key: string): string {
    return key
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/_/g, "-")
      .toLowerCase();
  }

  function __hashString(input: string): string {
    let h = 5381;
    for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
    return (h >>> 0).toString(36);
  }

  // -------------------------- Theme Token Resolver -------------------------- //
  // Minimal resolver: "$token" => var(--token), "$token/NN" => color-mix with opacity
  // Works for color, backgroundColor, borderColor, outlineColor, fill, stroke, textDecorationColor, boxShadow
  const COLOR_FAMILIES: Record<string, string> = {
    backgroundColor: "bg",
    background: "bg",
    color: "text",
    borderColor: "border",
    outlineColor: "outline",
    fill: "fill",
    stroke: "stroke",
    textDecorationColor: "decoration",
    boxShadow: "shadow",
  };

  function __resolveThemeToken(cssProp: string, value: any): any {
    if (typeof value !== "string") return value;

    // $token or $token/NN
    const m = value.match(/^\$(?<token>[a-zA-Z0-9_-]+)(?:\/(?<pct>\d{1,3}))?$/);
    if (!m || !m.groups) return value;
    const token = m.groups.token;
    const pctStr = m.groups.pct;
    if (!pctStr) return `var(--${token})`;
    const pct = Math.max(0, Math.min(100, parseInt(pctStr, 10)));
    return `color-mix(in oklab, var(--${token}) ${pct}%, transparent)`;
  }

  function __serializeWebStyle(styleObj: Record<string, any>): string {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(styleObj || {})) {
      if (v === undefined || v === null || v === false) continue;
      const cssKey = __toKebabCase(k);
      const resolved = __resolveThemeToken(k, v);
      parts.push(`${cssKey}: ${String(resolved)}`);
    }
    return parts.join("; ");
  }

  function __ensureClassForWebStyle(
    styleObj: Record<string, any>,
    specificity: "normal" | "low" = "normal"
  ): string | null {
    if (!styleObj) return null;
    const cssBody = __serializeWebStyle(styleObj);
    if (!cssBody) return null;
    const hash = __hashString(cssBody + `|${specificity}`);
    const className = `in-${hash}`;
    if (__injectedStyleHashes.has(hash)) return className;
    const el = __ensureStyleEl();
    if (!el) return className; // SSR/non-DOM: return stable class name without injection
    try {
      const selector =
        specificity === "low" ? `:where(.${className})` : `.${className}`;
      el.appendChild(document.createTextNode(`${selector} { ${cssBody} }`));
      __injectedStyleHashes.add(hash);
    } catch {
      // ignore injection errors
    }
    return className;
  }

  // Serialize nested selector objects like {"& > tr": { backgroundColor: '...'}}
  function __serializeRules(
    styleObj: Record<string, any>,
    baseSelector: string
  ): string {
    if (!styleObj) return "";
    const decls: Record<string, any> = {};
    const nested: Array<[string, any]> = [];

    for (const [k, v] of Object.entries(styleObj)) {
      if (v === undefined || v === null || v === false) continue;
      if (v && typeof v === "object" && !Array.isArray(v)) {
        nested.push([k, v]);
      } else {
        decls[k] = __resolveThemeToken(k, v);
      }
    }

    let css = "";
    const declStr = __serializeWebStyle(decls);
    if (declStr) css += `${baseSelector} { ${declStr} }`;

    for (const [sel, obj] of nested) {
      if (sel.startsWith("@media")) {
        const inner = __serializeRules(obj as any, baseSelector);
        if (inner) css += `${sel} { ${inner} }`;
        continue;
      }
      const nestedSelector = sel.includes("&")
        ? sel.replace(/&/g, baseSelector)
        : `${baseSelector} ${sel}`;
      const inner = __serializeRules(obj as any, nestedSelector);
      if (inner) css += inner;
    }

    return css;
  }

  function __ensureComplexWebStyle(
    styleObj: Record<string, any>,
    specificity: "normal" | "low" = "normal"
  ): string | null {
    if (!styleObj) return null;
    const seed = JSON.stringify(styleObj) + `|${specificity}|complex`;
    const hash = __hashString(seed);
    const className = `in-${hash}`;
    if (__injectedStyleHashes.has(hash)) return className;
    const el = __ensureStyleEl();
    if (!el) return className; // SSR/non-DOM
    try {
      const selector =
        specificity === "low" ? `:where(.${className})` : `.${className}`;
      const css = __serializeRules(styleObj, selector);
      if (css) {
        el.appendChild(document.createTextNode(css));
        __injectedStyleHashes.add(hash);
      }
    } catch {
      // ignore
    }
    return className;
  }

  function computeProps(config: InSpatialStyleConfig<V>, props?: any) {
    const { settings, defaultSettings } = config;
    const classParts: any[] = [];
    let styleOut: any = {};
    // Detect user-provided class utilities to set family overrides
    const userCls = issUtil(props?.class, props?.className);
    const userTokens = userCls.split(/\s+/).filter(Boolean);
    const userFamily: Record<string, boolean> = {
      bg: false,
      text: false,
      border: false,
      outline: false,
      fill: false,
      stroke: false,
      decoration: false,
      shadow: false,
    };
    for (const t of userTokens) {
      // Extract the utility part after any variant prefixes (hover:, focus:, etc.)
      const utilityPart = t.split(":").pop() || "";
      const fam = utilityPart.split("-")?.[0] || "";
      if ((userFamily as any)[fam] !== undefined) {
        (userFamily as any)[fam] = true;
      }
    }

    // Base can be string/array/object; collect classes and style
    const base = config.base as any;
    const baseArr = Array.isArray(base) ? base : base ? [base] : [];
    for (const item of baseArr) {
      if (typeof item === "string") classParts.push(item);
      else if (Array.isArray(item)) classParts.push(item);
      else if (item && typeof item === "object")
        styleOut = mergeStyle(styleOut, item);
    }

    if (settings) {
      for (const styleKey of Object.keys(settings)) {
        const prop = props?.[styleKey];
        const def = defaultSettings?.[styleKey as keyof typeof defaultSettings];
        const value = falsyToString(prop ?? def);
        const map = (settings as any)[styleKey];
        const selected = map?.[value as any];
        const arr = Array.isArray(selected)
          ? selected
          : selected
          ? [selected]
          : [];
        for (const it of arr) {
          if (typeof it === "string") classParts.push(it);
          else if (Array.isArray(it)) classParts.push(...it);
          else if (it && typeof it === "object") {
            if (isPlatformStyleObject(it)) styleOut = mergeStyle(styleOut, it);
            else classParts.push(it);
          }
        }
      }
    }

    // Append external classes and compile web style to a generated class
    const webStyle = (styleOut && (styleOut as any).web) || null;
    if (webStyle) {
      // If there are nested selectors/objects, handle as complex style
      const hasNested = Object.values(webStyle).some(
        (v) => v && typeof v === "object" && !Array.isArray(v)
      );
      if (hasNested) {
        // For nested styles, we need to filter color properties recursively
        const colorKeyToFamily: Record<string, string> = {
          backgroundColor: "bg",
          background: "bg",
          color: "text",
          borderColor: "border",
          outlineColor: "outline",
          fill: "fill",
          stroke: "stroke",
          textDecorationColor: "decoration",
          boxShadow: "shadow",
        };

        const filterNestedColors = (obj: any): any => {
          const filtered: Record<string, any> = {};
          for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith("&:") && typeof value === "object") {
              // This is a pseudo-selector, check if user has variant utilities
              const variant = key.substring(2); // Remove &:
              const hasVariantOverride = userTokens.some((t) => {
                const [prefix, util] = t.split(":");
                if (prefix === variant && util) {
                  const utilFamily = util.split("-")[0];
                  return Object.values(colorKeyToFamily).includes(utilFamily);
                }
                return false;
              });

              if (hasVariantOverride) {
                // Skip this entire pseudo-selector if user has variant utilities
                continue;
              } else {
                // Recursively filter the nested object
                filtered[key] = filterNestedColors(value);
              }
            } else if (typeof value === "object" && !Array.isArray(value)) {
              // Recursively filter nested objects
              filtered[key] = filterNestedColors(value);
            } else {
              // For direct properties, check if it's a color property
              const fam = colorKeyToFamily[key];
              if (fam && userFamily[fam]) continue;
              filtered[key] = value;
            }
          }
          return filtered;
        };

        const filteredWebStyle = filterNestedColors(webStyle);
        if (Object.keys(filteredWebStyle).length) {
          const c = __ensureComplexWebStyle(filteredWebStyle, "normal");
          if (c) classParts.push(c);
        }
      } else {
        // Filter out color properties when user has provided utilities for that family
        const colorKeyToFamily: Record<string, string> = {
          backgroundColor: "bg",
          background: "bg",
          color: "text",
          borderColor: "border",
          outlineColor: "outline",
          fill: "fill",
          stroke: "stroke",
          textDecorationColor: "decoration",
          boxShadow: "shadow",
        };

        const filtered: Record<string, any> = {};
        for (const [k, v] of Object.entries(webStyle)) {
          const fam = colorKeyToFamily[k];
          // Skip this property if user has provided utilities for this family
          if (fam && userFamily[fam]) continue;
          filtered[k] = v;
        }

        if (Object.keys(filtered).length) {
          const c = __ensureClassForWebStyle(filtered, "normal");
          if (c) classParts.push(c);
        }
      }
    }

    // Convert CSS-variable utilities like bg-(--brand), text-(--primary), border-(--surface)/80
    // into generated CSS classes so they work across browsers and avoid relying on Tailwind parsing
    // Support util-(--var) and util-$token (with optional /NN)
    const varUtilRegex =
      /^(bg|text|border|outline|fill|stroke|decoration|shadow)-(?:\((--[a-zA-Z0-9_-]+)\)|\$(\w[\w-]*))(?:\/(\d{1,3}))?$/;
    const utilToCssProp: Record<string, string> = {
      bg: "backgroundColor",
      text: "color",
      border: "borderColor",
      outline: "outlineColor",
      fill: "fill",
      stroke: "stroke",
      decoration: "textDecorationColor",
      shadow: "boxShadow",
    };

    const expandedClassParts: string[] = [];
    const pushToken = (t: string, fromUser: boolean = false) => {
      if (!t) return;

      // Check for bracket selector syntax first [&_tr]:border-b
      const bracketSelectorMatch = t.match(/^\[([^\]]+)\]:(.+)$/);
      if (bracketSelectorMatch) {
        const [, selector, utilities] = bracketSelectorMatch;
        // Convert selector to web style format
        const selectorKey = selector.replace(/^&/, "");

        // For bracket selectors, we need to ensure the utilities are included
        // in the Tailwind build process. We do this by:
        // 1. Adding the utilities as regular classes (so Tailwind sees them)
        // 2. Creating a CSS rule that applies them to the selector

        // Add utilities to the output so Tailwind processes them
        const utilityList = utilities.split(/\s+/).filter(Boolean);
        expandedClassParts.push(...utilityList);

        // Create a unique parent class for this bracket selector
        const bracketClass = `in-bracket-${__hashString(selector + utilities)}`;
        expandedClassParts.push(bracketClass);

        // Generate CSS that applies the utilities to child elements
        // We'll create a rule like: .in-bracket-xyz > tr { /* utility styles */ }
        // But since we can't resolve Tailwind utilities at runtime,
        // we use a trick: add a data attribute that triggers the styles
        const _cssRule = `.${bracketClass}${selectorKey} { @apply ${utilities}; }`;

        // Since we can't use @apply at runtime, we'll mark this element
        // to inherit the utility classes from its parent
        const webStyle: Record<string, any> = {};

        // This is a placeholder that tells Tailwind to process these utilities
        // The actual application happens via the user's Tailwind-CLI at build time
        webStyle[`${selectorKey}`] = `/* bracket-selector: ${utilities} */`;

        // For now, as a fallback, we'll also emit a class that can be targeted
        const placeholderClass = __ensureClassForWebStyle(webStyle, "normal");
        if (placeholderClass) expandedClassParts.push(placeholderClass);

        return;
      }

      // Check for pseudo-class utilities (odd:, even:, etc.)
      const pseudoClassMatch = t.match(
        /^(odd|even|first|last|first-child|last-child):(.+)$/
      );
      if (pseudoClassMatch) {
        const [, pseudo, utilities] = pseudoClassMatch;
        const utilityList = utilities.split(/\s+/).filter(Boolean);

        // Parse utilities
        const styleObj: Record<string, any> = {};
        for (const util of utilityList) {
          if (util.startsWith("bg-")) {
            const color = util.substring(3);
            styleObj.backgroundColor = color.startsWith("(--")
              ? `var${color}`
              : `var(--color-${color})`;
          } else if (util.startsWith("text-")) {
            const color = util.substring(5);
            styleObj.color = color.startsWith("(--")
              ? `var${color}`
              : `var(--color-${color})`;
          }
        }

        // Create pseudo-class selector
        const webStyle = { [`&:${pseudo}`]: styleObj };
        const cls = __ensureClassForWebStyle(webStyle, "normal");
        if (cls) expandedClassParts.push(cls);
        return;
      }

      // Handle variant-prefixed variable utilities like hover:bg-(--brand)/80 and hover:bg-[var(--brand)]/80
      const variantVarUtilRegex =
        /^(hover|focus|active|disabled|visited|checked|focus-visible|focus-within):(bg|text|border|outline|fill|stroke|decoration)-\((--[a-zA-Z0-9_-]+)\)(?:\/(\d{1,3}))?$/;
      const variantBracketVarUtilRegex =
        /^(hover|focus|active|disabled|visited|checked|focus-visible|focus-within):(bg|text|border|outline|fill|stroke|decoration)-\[var\((--[a-zA-Z0-9_-]+)\)\](?:\/(\d{1,3}))?$/;
      const vm =
        t.match(variantVarUtilRegex) || t.match(variantBracketVarUtilRegex);
      if (vm) {
        const [, variant, util, cssVar, opacity] = vm as unknown as [
          string,
          string,
          keyof typeof utilToCssProp,
          string,
          string | undefined
        ];
        const cssProp = utilToCssProp[util] || "";
        if (cssProp) {
          let value = `var(${cssVar})`;
          const pct = opacity
            ? Math.max(0, Math.min(100, parseInt(opacity, 10)))
            : null;
          if (pct !== null && !Number.isNaN(pct)) {
            value = `color-mix(in oklab, var(${cssVar}) ${pct}%, transparent)`;
          }
          const webStyle = { [`&:${variant}`]: { [cssProp]: value } } as Record<
            string,
            any
          >;
          // Nested selector requires complex style injection
          const cls = __ensureComplexWebStyle(webStyle, "normal");
          if (cls) expandedClassParts.push(cls);
          return;
        }
      }

      // Support two syntaxes: util-(--var) and util-[var(--var)]
      const bracketVarUtilRegex =
        /^(bg|text|border|outline|fill|stroke|decoration|shadow)-\[var\((--[a-zA-Z0-9_-]+)\)\](?:\/(\d{1,3}))?$/;
      const m1 = t.match(varUtilRegex);
      const m2 = t.match(bracketVarUtilRegex);
      const m = m1 || m2;
      if (!m) {
        // Fallback: allow theme shadow tokens like shadow-hollow, shadow-base, etc.
        const shadowToken = t.match(/^shadow-([a-zA-Z0-9_-]+)$/);
        const variableShadowNames = new Set([
          "base",
          "effect",
          "subtle",
          "hollow",
          "input",
          "active",
          "line",
          "inn",
          "prime",
          "cool",
        ]);
        if (shadowToken && variableShadowNames.has(shadowToken[1])) {
          // Map to var(--shadow-<name>)
          const cls = __ensureClassForWebStyle(
            { boxShadow: `var(--shadow-${shadowToken[1]})` },
            "normal"
          );
          if (cls) expandedClassParts.push(cls);
          return;
        }
        expandedClassParts.push(t);
        return;
      }
      const [, util, cssVar, dollarToken, opacity] = m as unknown as [
        string,
        keyof typeof utilToCssProp,
        string | undefined,
        string | undefined,
        string | undefined
      ];
      const cssProp = utilToCssProp[util] || "";
      if (!cssProp) {
        expandedClassParts.push(t);
        return;
      }
      // For system-generated tokens, avoid overriding explicit user-provided family utilities
      if (!fromUser && userFamily[util]) return;
      // Build CSS value; only color families support opacity mix
      const colorFamilies = new Set([
        "bg",
        "text",
        "border",
        "outline",
        "fill",
        "stroke",
        "decoration",
      ]);
      const baseVar = cssVar ? `var(${cssVar})` : dollarToken ? `var(--${dollarToken})` : "";
      let value = baseVar;
      const pct = opacity
        ? Math.max(0, Math.min(100, parseInt(opacity, 10)))
        : null;
      if (pct !== null && !Number.isNaN(pct) && colorFamilies.has(util)) {
        value = `color-mix(in oklab, ${baseVar} ${pct}%, transparent)`;
      }
      // Always use normal specificity - user utilities override via filtering mechanism
      const cls = __ensureClassForWebStyle({ [cssProp]: value }, "normal");
      if (cls) expandedClassParts.push(cls);
    };

    // Flatten classParts into tokens, convert, and rebuild
    const flatTokens: string[] = [];
    for (const cp of classParts) {
      if (!cp) continue;
      if (typeof cp === "string")
        flatTokens.push(...cp.split(/\s+/).filter(Boolean));
      else if (Array.isArray(cp))
        flatTokens.push(...(cp as any).flat().filter(Boolean));
      else flatTokens.push(String(cp));
    }
    if (flatTokens.length) {
      for (const token of flatTokens) pushToken(token, false);
    }

    // Convert user-provided variable utilities and filter them out of raw classes
    const filteredUserTokens: string[] = [];
    for (const token of userTokens) {
      const beforeLen = expandedClassParts.length;
      pushToken(token, true);
      // If token was recognized and converted, skip keeping the raw token
      if (expandedClassParts.length === beforeLen) {
        filteredUserTokens.push(token);
      }
    }
    const filteredUserStr = filteredUserTokens.join(" ");

    // Use iss to finalize classes including processed user classes (user classes last)
    const className = iss(expandedClassParts, filteredUserStr);
    return {
      className,
      style: styleOut,
      composition: config.composition,
      defaultSettings,
      props,
      userCls: filteredUserStr,
    };
  }

  const style: StyleProp = (config) => (props) => {
    const result = computeProps(config as any, props);

    // Always register this style's context if it has a name
    if ((config as any).name) {
      const usedSettings: Record<string, any> = {};
      if ((config as any).settings) {
        for (const key of Object.keys((config as any).settings)) {
          usedSettings[key] = props?.[key] ?? (config as any).defaultSettings?.[key];
        }
      }
      // Register in both registries for compatibility
      styleContextRegistry.register((config as any).name, usedSettings);
      signalStyleContextRegistry.register((config as any).name, usedSettings);
    }

    // If no composition rules, return early
    if (!result.composition || !result.composition.length) {
      return result.className;
    }

    // Apply composition rules after all other classes
    const compositionClasses: string[] = [];
    let compositionStyle: any = {};

    for (const rule of result.composition as any[]) {
      const {
        class: cvClass,
        className: cvClassName,
        style: cvStyle,
        ...conds
      } = rule || {};

      const matches = Object.entries(conds).every(([key, value]) => {
        // Check for cross-references first (e.g., $tab-trigger.format)
        if (key.startsWith("$")) {
          const path = key.substring(1).split(".");
          const styleName = path[0];
          const propName = path[1];
          
          // Use reactive getContext to create dependencies for cross-style reactivity
          const signalContext = signalStyleContextRegistry.getContext(styleName);
          if (signalContext) {
            return signalContext.settings[propName] === value;
          }
          
          // Fallback to regular registry
          const context = styleContextRegistry.getContext(styleName);
          if (context) {
            return context.settings[propName] === value;
          }
          
          // Fallback: this might be in a composeStyle context
          return false;
        }
        
        // Regular composition check
        const pv = result.props?.[key] ?? result.defaultSettings?.[key as any];
        return Array.isArray(value) ? value.includes(pv) : pv === value;
      });

      if (matches) {
        if (cvClass) compositionClasses.push(cvClass);
        if (cvClassName) compositionClasses.push(cvClassName);
        if (cvStyle) compositionStyle = mergeStyle(compositionStyle, cvStyle);
      }
    }

    // Handle composition styles
    if (compositionStyle.web) {
      const webStyle = compositionStyle.web;
      const c = __ensureClassForWebStyle(webStyle, "normal");
      if (c) compositionClasses.push(c);
    }

    // Merge composition classes on top of everything else
    if (compositionClasses.length) {
      return iss(result.className, compositionClasses);
    }

    return result.className;
  };

  const composeStyle: ComposeStyleProp =
    (...components) =>
    (props) => {
      const { class: cls, className, ...styleProps } = props || {};

      // Enable context registry for composed styles
      const wasActive = styleContextRegistry.isActive();
      if (!wasActive) {
        styleContextRegistry.beginEvaluation();
      }

      try {
        // Step 1: Build style context by evaluating each component
        const styleContext: Record<string, any> = {};
      const componentData: Array<{
        classes: string;
        config: any;
        name: string;
        usedSettings: any;
      }> = [];

      components.forEach((component, index) => {
        // Get the raw classes
        const classes = component(styleProps as any);

        // Extract config and name if available (set by createStyle)
        const config = (component as any).__styleConfig;
        const name = (component as any).__styleName || `style${index}`;

        // Extract what settings were actually used
        const usedSettings: Record<string, any> = {};
        if (config?.settings) {
          for (const key of Object.keys(config.settings)) {
            usedSettings[key] =
              (styleProps as Record<string, any>)[key] ??
              config.defaultSettings?.[key];
          }
        }

        styleContext[name] = usedSettings;
        componentData.push({ classes, config, name, usedSettings });
      });

      // Step 2: Re-evaluate compositions with cross-references
      const crossCompositionClasses: string[] = [];

      componentData.forEach(({ config }) => {
        if (!config?.composition) return;

        for (const rule of config.composition) {
          const {
            class: cvClass,
            className: cvClassName,
            style: cvStyle,
            ...conds
          } = rule || {};

          const matches = Object.entries(conds).every(([key, value]) => {
            if (key.startsWith("$")) {
              // Cross-reference: $track.size
              const path = key.substring(1).split(".");
              const styleName = path[0];
              const propName = path[1];
              return styleContext[styleName]?.[propName] === value;
            }
            // Regular composition check
            const pv =
              (styleProps as Record<string, any>)[key] ??
              config?.defaultSettings?.[key];
            return Array.isArray(value) ? value.includes(pv) : pv === value;
          });

          if (matches) {
            if (cvClass) crossCompositionClasses.push(cvClass);
            if (cvClassName) crossCompositionClasses.push(cvClassName);
            if (cvStyle?.web) {
              // Process web styles with proper nested selector support
              const className = `in-${__hashString(JSON.stringify(cvStyle.web))}`;
              if (!__injectedStyleHashes.has(className)) {
                const el = __ensureStyleEl();
                if (el) {
                  const rules = __serializeRules(cvStyle.web, `.${className}`);
                  if (rules) {
                    el.appendChild(document.createTextNode(rules));
                    __injectedStyleHashes.add(className);
                  }
                }
              }
              crossCompositionClasses.push(className);
            }
          }
        }
      });

      // Step 3: Combine everything
      const allClasses = [
        ...componentData.map((d) => d.classes),
        ...crossCompositionClasses,
        cls,
        className,
      ];

      // Use iss to apply intelligent conflict resolution
      return iss(...allClasses);
    } finally {
      if (!wasActive) {
        styleContextRegistry.endEvaluation();
      }
    }
  };

  // Define the placeholder getStyle function
  const getStyle = ((_props?: any) => "") as (
    props?: StyleSchemaProp<V> & {
      class?: ClassValueProp;
      className?: ClassValueProp;
    }
  ) => string;

  // Return a minimal system with the properly typed methods
  return {
    getStyle,
    iss,
    style,
    composeStyle,
  };
}

/*##############################################(iss)##############################################*/
/**
 * # iss
 * #### A utility for intelligent class name composition and conflict resolution
 *
 * iss combines classes with intelligent conflict resolution, working like a smart
 * style manager that knows how to combine classes without conflicts.
 *
 * @since 0.1.1
 * @category InSpatial Style Sheet (ISS)
 * @module iss
 * @kind utility
 * @access public
 *
 * @example
 * ### Basic Usage
 * ```typescript
 * import { iss } from '@in/style/style';
 *
 * // Combining simple classes
 * const className = iss('bg-pop-500 text-white', 'hover:bg-pop-600');
 *
 * // With conditional classes
 * const buttonClass = iss(
 *   'px-4 py-2 rounded',
 *   isActive ? 'bg-pop-500' : 'bg-damp-200'
 * );
 * ```
 *
 * @example
 * ### Handling Class Conflicts
 * ```typescript
 * // iss automatically resolves Tailwind conflicts
 * const element = iss(
 *   'p-4',           // Base padding
 *   'p-6',           // This will override the previous padding
 *   'dark:p-8'       // Dark mode padding remains separate
 * );
 * // Result: 'p-6 dark:p-8'
 * ```
 *
 * @param {...ClassValueProp[]} inputs - Accepts any number of class values to be combined
 * @returns {string} A merged string of InSpatial Style Sheet classes with conflicts resolved
 */

// Create the base system for global exports
const baseSystem = createStyleCore();

// Export the global utilities
/** Utility for intelligent class name composition and conflict resolution */
export const iss = baseSystem.iss;

/** Creates style functions with configurable styles */
export const style = baseSystem.style;

/** Utility for combining multiple style components */
export const composeStyle = baseSystem.composeStyle;

/** 
 * Smart compose that only composes styles with cross-references
 * This is more efficient than regular composeStyle when you have many styles
 * but only some need cross-referencing
 */
export const composeStyleAuto: ComposeStyleProp = (...components) => {
  // Check if any component has cross-references
  const needsComposition = components.some((comp: any) => {
    const config = comp.__styleConfig;
    return config?.composition?.some((rule: any) => 
      Object.keys(rule).some(key => key.startsWith('$'))
    );
  });

  // If no cross-references, just combine classes without full composition
  if (!needsComposition) {
    return (props) => {
      const { class: cls, className, ...styleProps } = props || {};
      const classes = components.map(comp => comp(styleProps as any));
      return iss(...classes, cls, className);
    };
  }

  // Otherwise use full composition
  return composeStyle(...components);
};

/*##############################################(CREATE-STYLE)##############################################*/
/**
 * # createStyle
 * #### A factory function that creates a customizable style styling system
 *
 * The `createStyle` function is like a style system factory. Think of it as a custom
 * clothing designer that lets you create your own styling rules and combinations.
 *
 * @since 0.1.1
 * @category InSpatial Style Sheet (ISS)
 * @module iss
 * @kind function
 * @access public
 *
 * ### 💡 Core Concepts

 * - Custom style system creation
 * - Configurable style hooks
 * - Tailwind-compatible class merging
 *
 * ### 📚 Terminology
 * > **Style System**: A structured way to manage different style variations of a component
 * > **Style Hooks**: Functions that can modify the final output of class names
 * > **getStyle**: Method to apply style styles to components
 *
 * @example 
 * ### Basic Configuration
 * 
 * import { createStyle } from "@in/style/style";
 * import type { StyleProps } from "@in/style/style";
 * 
 * ```typescript
 * const ComponentStyle = createStyle({
 *   settings: {
 *     size: { sm: "text-sm px-2", lg: "text-lg px-4" },
 *     theme: { light: "bg-white text-black", dark: "bg-black text-white" }
 *   }
 * });
 * 
 * // type inference with getStyle
 * type ComponentStyleProps = StyleProps<typeof ComponentStyle.getStyle> & {
 *   // Add any additional props here that are not part of the style system (optional)
 * }
 *
 * // Apply styles with the style
 * const className = ComponentStyle.getStyle({ size: "sm", theme: "dark" });
 * ```
 * 
 * ### Custom System
 * ```typescript
 * import { createStyle } from '@in/style/style';
 *
 * // Create a custom style system with a class name transformer
 * const { style, iss } = createStyle({
 *   hooks: {
 *     onComplete: (className) => `my-prefix-${className}`
 *   }
 * });
 *
 * // Use the custom style system
 * const button = style({
 *   base: "rounded-md",
 *   settings: {
 *     size: {
 *       sm: "text-sm px-2",
 *       lg: "text-lg px-4"
 *     }
 *   }
 * });
 * ```
 *
 * @param {StyleConfigProp | InSpatialStyleConfig<V>} [configOrOptions] - 
 * Configuration options for the style system, or a direct style configuration
 * @returns {StyleSystemReturn<V>} Returns an object containing the core styling utilities 
 * and style functions with a consistent API shape
 */

/**
 * Extract cross-reference dependencies from a style config
 */
function extractCrossReferences(config: InSpatialStyleConfig<any>): Set<string> {
  const deps = new Set<string>();
  
  if (config.composition) {
    for (const rule of config.composition) {
      for (const key of Object.keys(rule)) {
        if (key.startsWith('$')) {
          // Extract style name from $style-name.prop
          const styleName = key.substring(1).split('.')[0];
          deps.add(styleName);
        }
      }
    }
  }
  
  return deps;
}

/**
 * Smart compose that automatically includes dependencies
 */
function smartComposeWithDependencies(
  primaryStyle: any,
  primaryConfig: InSpatialStyleConfig<any>,
  props: any
): string {
  const dependencies = extractCrossReferences(primaryConfig);
  
  // If no dependencies, just evaluate normally
  if (dependencies.size === 0) {
    return primaryStyle(props);
  }
  
  // Collect all styles needed for composition
  const stylesToCompose: any[] = [];
  const styleConfigs: any[] = [];
  
  // Add all dependencies first (so they register their context)
  for (const depName of dependencies) {
    const depEntry = globalStyleRegistry.get(depName);
    if (depEntry) {
      stylesToCompose.push(depEntry.system.style(depEntry.config));
      styleConfigs.push(depEntry.config);
    }
  }
  
  // Add the primary style last
  stylesToCompose.push(primaryStyle);
  styleConfigs.push(primaryConfig);
  
  // If we found dependencies, compose them all
  if (stylesToCompose.length > 1) {
    // Tag styles with their names for cross-reference
    stylesToCompose.forEach((style, index) => {
      const config = styleConfigs[index];
      if (config.name) {
        (style as any).__styleName = config.name;
        (style as any).__styleConfig = config;
      }
    });
    
    // Compose all styles together
    const composed = composeStyle(...stylesToCompose);
    return composed(props);
  }
  
  // Fallback to simple evaluation
  return primaryStyle(props);
}

/**
 * Unified implementation of createStyle that handles both usage patterns
 */
export function createStyle<V extends StyleShapeProp>(
  configOrOptions?: StyleConfigProp | InSpatialStyleConfig<V>
): StyleSystemReturn<V> {
  // Create the base system
  const system = createStyleCore<V>(
    configOrOptions && "hooks" in configOrOptions ? configOrOptions : undefined
  );

  // If direct config was provided (with settings or base), create specific style function
  if (
    configOrOptions &&
    ("settings" in configOrOptions || "base" in configOrOptions)
  ) {
    const config = configOrOptions as InSpatialStyleConfig<V>;
    const styleName = config.name;
    
    // Extract dependencies
    const dependencies = extractCrossReferences(config);
    
    // Create the base style function
    const styleFn = system.style(config);
    
    // Register in global registry if named
    if (styleName) {
      globalStyleRegistry.register(styleName, {
        name: styleName,
        config,
        system,
        dependencies
      });
      
      // Also track in signal registry for compatibility
      if (dependencies.size > 0) {
        for (const dep of dependencies) {
          signalStyleContextRegistry.trackDependency(styleName, dep);
        }
      }
    }

    // Tag the function with its config for cross-composition
    (styleFn as any).__styleConfig = config;
    (styleFn as any).__styleName = styleName;

    // Create an enhanced getStyle that handles auto-composition
    const getStyle = ((props?: any) => {
      // Use smart composition that automatically includes dependencies
      return smartComposeWithDependencies(styleFn, config, props);
    }) as (
      props?: StyleSchemaProp<V> & {
        class?: ClassValueProp;
        className?: ClassValueProp;
      }
    ) => string;

    (getStyle as any).__styleConfig = config;
    (getStyle as any).__styleName = styleName;

    // Return with strongly typed getStyle
    return {
      ...system,
      getStyle,
      config,
    };
  }

  // Otherwise return the base system (for factory usage)
  return system;
}

/**
 * Return type for createStyle when used with a configuration
 * Used for documentation purposes
 */
export type StyleReturnType<V extends StyleShapeProp> = StyleSystemReturn<V>;

/** 
 * Context registry for advanced cross-style composition scenarios
 * Most users won't need this as it's handled automatically
 */
export { styleContextRegistry } from "./context.ts";

export type {
  /** Type for InSpatial Style Sheet class values that can be used in the style system */
  ClassValueProp,

  /**
   * Utility type for extracting props from a style function or object
   * Works with direct style functions and objects with getStyle method
   *
   * @example
   * ```typescript
   * // With direct style function
   * const button = style({ ... });
   * type ButtonProps = StyleProps<typeof button>;
   *
   * // With createStyle result
   * const ButtonStyle = createStyle({ ... });
   * type ButtonProps = StyleProps<typeof ButtonStyle.getStyle>;
   * ```
   */
  StyleProps,

  /** Type for defining the shape of styles in a component */
  StyleShapeProp,

  /** Type for the schema of style props based on a style shape */
  StyleSchemaProp,

  /** Configuration options for the style system */
  StyleConfigProp,
};
