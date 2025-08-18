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
  /** Base classes applied to all instances */
  base?: ClassValueProp;

  /** Style settings mapping style names to their possible values */
  settings?: V;

  /** Compound styles for complex combinations */
  composition?: Array<
    StyleSchemaProp<V> & {
      class?: ClassValueProp;
      className?: ClassValueProp;
    }
  >;

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

  function __serializeWebStyle(styleObj: Record<string, any>): string {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(styleObj || {})) {
      if (v === undefined || v === null || v === false) continue;
      const cssKey = __toKebabCase(k);
      parts.push(`${cssKey}: ${String(v)}`);
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
    };
    for (const t of userTokens) {
      const fam = t.split(":").pop()?.split("-")?.[0] || "";
      if ((userFamily as any)[fam] !== undefined)
        (userFamily as any)[fam] = true;
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

    // Composition
    if (config.composition && config.composition.length) {
      for (const rule of config.composition as any[]) {
        const {
          class: cvClass,
          className: cvClassName,
          style: cvStyle,
          ...conds
        } = rule || {};
        const matches = Object.entries(conds).every(([key, value]) => {
          const pv = props?.[key] ?? defaultSettings?.[key as any];
          return Array.isArray(value) ? value.includes(pv) : pv === value;
        });
        if (matches) {
          if (cvClass) classParts.push(cvClass);
          if (cvClassName) classParts.push(cvClassName);
          if (cvStyle) styleOut = mergeStyle(styleOut, cvStyle);
        }
      }
    }

    // Append external classes and compile web style to a generated class
    const webStyle = (styleOut && (styleOut as any).web) || null;
    if (webStyle) {
      // Split color-related properties to low specificity so user utilities/styles win
      const colorKeys = new Set([
        "backgroundColor",
        "background",
        "color",
        "borderColor",
        "outlineColor",
        "fill",
        "stroke",
        "textDecorationColor",
      ]);
      const lowSpec: Record<string, any> = {};
      const normalSpec: Record<string, any> = {};
      for (const [k, v] of Object.entries(webStyle)) {
        if (colorKeys.has(k)) lowSpec[k] = v;
        else normalSpec[k] = v;
      }
      if (Object.keys(normalSpec).length) {
        const c1 = __ensureClassForWebStyle(normalSpec, "normal");
        if (c1) classParts.push(c1);
      }
      if (Object.keys(lowSpec).length) {
        // Filter out color families when user has provided class utilities for them
        const mapKeyToFamily: Record<string, string> = {
          backgroundColor: "bg",
          background: "bg",
          color: "text",
          borderColor: "border",
          outlineColor: "outline",
          fill: "fill",
          stroke: "stroke",
          textDecorationColor: "decoration",
        };
        const filtered: Record<string, any> = {};
        for (const [k, v] of Object.entries(lowSpec)) {
          const fam = mapKeyToFamily[k] || "";
          if (fam && userFamily[fam]) continue;
          filtered[k] = v;
        }
        if (Object.keys(filtered).length) {
          const c2 = __ensureClassForWebStyle(filtered, "low");
          if (c2) classParts.push(c2);
        }
      }
    }

    // Convert CSS-variable utilities like bg-(--brand), text-(--primary), border-(--surface)/80
    // into generated CSS classes so they work across browsers and avoid relying on Tailwind parsing
    const varUtilRegex =
      /^(bg|text|border|outline|fill|stroke|decoration)-\((--[a-zA-Z0-9_-]+)\)(?:\/(\d{1,3}))?$/;
    const utilToCssProp: Record<string, string> = {
      bg: "backgroundColor",
      text: "color",
      border: "borderColor",
      outline: "outlineColor",
      fill: "fill",
      stroke: "stroke",
      decoration: "textDecorationColor",
    };

    const expandedClassParts: string[] = [];
    const pushToken = (t: string) => {
      if (!t) return;
      const m = t.match(varUtilRegex);
      if (!m) {
        expandedClassParts.push(t);
        return;
      }
      const [, util, cssVar, opacity] = m;
      const cssProp = utilToCssProp[util] || "";
      if (!cssProp) {
        expandedClassParts.push(t);
        return;
      }
      // Skip variant variable token generation if user provided same family classes
      if (userFamily[util]) return;
      // Build CSS value using color-mix for opacity if provided
      let value = `var(${cssVar})`;
      const pct = opacity
        ? Math.max(0, Math.min(100, parseInt(opacity, 10)))
        : null;
      if (pct !== null && !Number.isNaN(pct)) {
        value = `color-mix(in oklab, var(${cssVar}) ${pct}%, transparent)`;
      }
      const cls = __ensureClassForWebStyle({ [cssProp]: value }, "low");
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
      for (const token of flatTokens) pushToken(token);
    }

    // Use iss to finalize classes including props.class / props.className (user classes last)
    const className = iss(expandedClassParts, props?.class, props?.className);
    return { className, style: styleOut };
  }

  const style: StyleProp = (config) => (props) => {
    const { className } = computeProps(config as any, props);
    return className;
  };

  const composeStyle: ComposeStyleProp =
    (...components) =>
    (props) => {
      const { class: cls, className, ...styleProps } = props || {};

      // Get the raw classes from each component
      const componentResults = components.map((component) =>
        component(styleProps as any)
      );

      // Combine with other provided classes
      const allClasses = [...componentResults, cls, className];

      // Use iss to apply intelligent conflict resolution
      return iss(...allClasses);
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
 * @category InSpatial Theme
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

/*##############################################(CREATE-STYLE)##############################################*/
/**
 * # createStyle
 * #### A factory function that creates a customizable style styling system
 *
 * The `createStyle` function is like a style system factory. Think of it as a custom
 * clothing designer that lets you create your own styling rules and combinations.
 *
 * @since 0.1.1
 * @category InSpatial Theme
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
    const styleFn = system.style(configOrOptions as InSpatialStyleConfig<V>);

    // Return with strongly typed getStyle
    return {
      ...system,
      getStyle: styleFn as (
        props?: StyleSchemaProp<V> & {
          class?: ClassValueProp;
          className?: ClassValueProp;
        }
      ) => string,
      config: configOrOptions as InSpatialStyleConfig<V>,
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
