# Styling

InSpatial Style Sheet (ISS) or `@inspatial/style` is built on InSpatial's `@in/style`module a variant based styling engine largely inspired by Stiches.



## Reactive Style
So far you have been working with static, prop-driven styling. Nothing that required your style to be aware of a change i.e interactivity. Which is will be the case many of the time. However there are times where you want your component style to update when something triggers and respond in Realtime. 

- In retrospect, cross-style composition says change a style when another style changes, (Style-to-Style)

- Whereas reactive-style says change a style when a state changes (State-to-Style)

Example

```jsx
// Create your styles as usual
const ButtonStyle = createStyle({
  settings: {
    format: {
      active: "bg-blue text-white",
      inactive: "bg-gray text-black"
    }
  }
});

// For reactive styles, wrap getStyle in a computed signal
const isActive = createSignal(false);

// Option 1: Pass signal directly (getStyle auto-resolves it)
const className = $(() => 
  ButtonStyle.getStyle({
    format: isActive  // Signal is automatically resolved
  })
);

// Option 2: Compute the value inline
const className = $(() => 
  ButtonStyle.getStyle({
    format: isActive.get() ? "active" : "inactive"
  })
);

// In your component
<Button className={className}>Click Me</Button>
```

```typescript
// Function
const my = {
  textColor: $(() => {...}),
}

// Render
<Component
 style={{
    web: {
      // ❌  DON'T DO THIS
      color: my.textColor.get(), // this works too but auto-coercion already appends .get()

      // ✅ DO THIS
      color: my.textColor,
    },
  }}
/>
```

You can style using two props `style` and `className` which is an alias for `class` (they both work just the same).

NOTE:

1. both `style` and (`className` or `class`) are reactive at the core. This means you don't have to parse computed/$ to...

2. View strings are non-reactive. A plain backtick string evaluates once, so it can’t auto‑update. Use the object/array forms (or a Signal) for reactivity.

```typescript
// ❌  DON'T DO THIS
<Component
  className={`p-4 rounded-lg mb-4 transition-all duration-300 ${
    signal.isPulseActive ? "animate-pulse" : ""
  } ${
    signal.isHighCount
      ? "scale-110 bg-gradient-to-r from-purple-500 to-pink-500"
      : ""
  }`}
/>

// ✅ DO THIS
<Component
className={{
    "p-4": true,
    "rounded-lg": true,
    "mb-4": true,
    "transition-all": true,
    "duration-300": true,
    "animate-pulse": signal.isPulseActive,
    "scale-110 bg-gradient-to-r from-purple-500 to-pink-500":
      testSignals.isHighCount,
  }}
/>
```

#### Lazy Styling (Anti-Pattern/Escape Hatch)

Lazy styling allows you to pass multiple style prop in a single component
Styling can also be done by calling multiple direct style props e.g

```typescript
// ❌  DON'T DO THIS
<Component
  style:color="black"
  style:background-color="yellow"
  style:font-size="20px"
  style:z-index="2147483646"
/>
```

While this approach is available, it should mainly be used as an "escape hatch" for special cases. Using multiple direct style props assumes you are only targeting the web, lacks types-safety and can lead to anti-patterns such as parsing the same style prop multiple times within a single component. Prefer the standard reactive style and className patterns for most use cases. If you choose to use this pattern only use it for one style prop e.g

```typescript
// ✅ DO THIS
<Componen style:z-index="2147483646" />
```

- **Styling Dynamic Elements:** For dynamically styled elements, leverage InSpatial's browser preset capabilities for conditional classes (`class:active={signal}`) and inline styles (`style:property={value}`) to ensure styles update correctly with state changes. \* \*\*Soon...

## Style Creation: (Variant Authority)

`@in/style/variant` enables object/web style injection, compiling all style keys into unique CSS classes (e.g., .in-abc123) that are injected once into a `<style data-in-variant>` tag. With the `createStyle()` API, you can write both CSS and Tailwind-like styles directly in TypeScript, not in `.css` files. InSpatial Kit Widgets & Components use these utilities, but they are not traditional CSS or Tailwind—they are compiled and applied at runtime based on your platform and render target. If TailwindCSS is installed, InSpatial will use its utilities; otherwise, it falls back to standard CSS. The styles you write look like Tailwind or CSS, but are managed by the InSpatial Style Sheet (ISS) system, which handles platform-specific transpilation for you.

```typescript
import { createStyle } from "@in/style/variant";

export const IconStyle = createStyle({
  base: [
    "inline-block items-center",
    { web: { display: "inline-block", alignItems: "center" } },
  ],
  settings: {
    format: {
      regular: ["", {}],
      fill: ["fill-current", { web: { fill: "currentColor" } }],
    },

    size: {
      xs: ["w-[16px] h-[16px]", { web: { width: "16px", height: "16px" } }],
      sm: ["w-[24px] h-[24px]", { web: { width: "24px", height: "24px" } }],
      md: ["w-[32px] h-[32px]", { web: { width: "32px", height: "32px" } }],
      lg: ["w-[40px] h-[40px]", { web: { width: "40px", height: "40px" } }],
      xl: ["w-[48px] h-[48px]", { web: { width: "48px", height: "48px" } }],
    },

    disabled: {
      true: [
        "opacity-disabled opacity-50 pointer-events-none cursor-not-allowed",
        {
          web: {
            opacity: 0.5,
            pointerEvents: "none",
            cursor: "not-allowed",
            color: "var(--muted)",
          },
        },
      ],
      false: [{}],
    },
  },
  defaultSettings: {
    format: "regular",
    size: "md",
    disabled: false,
  },
});
```

The example above demonstrates how InSpatial Kit and Widgets support both CSS and Tailwind utility styles for maximum flexibility and platform agnosticism at a low level. However, when building higher-level InSpatial applications, it's recommended to consistently use either CSS or Tailwind utilities, rather than mixing both, to keep your styles clear and maintainable. Use Tailwind utilities if installed, otherwise use CSS utilities.

### `Class` utilities vs `Style` Properties

You can style with both class utilities (`class`/`className`) and style props (`style`) and even mix them when a value is only accessible one way (e.g., a precise style declaration). However, for most components it’s more optimal to pick one approach per area to keep authority predictable and the mental model simple.

The `style` prop will ALWAYS work and is considered the standard, but many cases are more ergonomic when handled with `classes`. It’s not really about choosing _Style vs. Classes_... the right mental model is one that embraces using both in harmony wherever the case calls for it.

#### Rule of Thumb

If you are unsure and want to reduce cognitive load. By taking a singular approach here is the general rule of thumb;

- Use class utilities if tools like Tailwind or css-variables are your prefered means of stylingg;
- Use `style` prop when you need exact CSS, nested selectors, or portability without relying on third-parties like TailwindCSS.
  `peer-focus-visible:outline-(--brand)`, `bg-(--background)`.
- When you need sibling relationships, complex pseudos, or precise CSS, write them in `style` as nested keys: `.peer:checked ~ &`, `&:hover`, `&:focus-visible`. etc...

##### Class Utilities X (Tailwind Selectors): Gotcha

Because of how InSpatial Serve builds styles, dynamic JIT classes and complex attribute selectors embedded directly inside style functions are not reliably included in the final style bundle. InServe runs Tailwind CLI over `src/config/app.css` (which imports `kit.css`) and only includes classes it can statically detect from content globs. Runtime‑injected style from the variant system is not visible to Tailwind at build time.

— In short: if you need keyframes/animations or any bracket‑based arbitrary variants or attribute selectors (anything inside `[...]`) to be present at runtime, create explicit utility classes in your `app.css` or use a premade utility from `kit.css` under `@layer utilities`, then reference those simple class tokens from your `createStyle()` configs.

**✅ Do this**

```css
/* app.css */
@layer utilities {
  /* Precompiled utility classes with attribute context */
  [data-in-presentation-snap-points="false"][data-state="open"].drawer-slide-from-right {
    animation: inmotion-drawer-slide-from-right 0.5s cubic-bezier(
        0.32,
        0.72,
        0,
        1
      ) forwards;
  }

  /* Optional initial positions for non-snap drawers */
  [data-in-presentation-snap-points="false"].drawer-position-right {
    transform: translateX(100%);
  }
}
```

```ts
// style.ts
export const DrawerStyle = createStyle({
  base: [
    // ...
  ],
  settings: {
    direction: {
      right: [
        "fixed top-0 right-0 h-full min-w-[320px]",
        "drawer-position-right",
        "drawer-slide-from-right",
        {
          web: {
            /* platform styles */
          },
        },
      ],
      // left/top/bottom likewise
    },
  },
});
```

**❌ Don't do this**

```ts
// style.ts – runtime/JIT tokens Tailwind can’t see at build time
createStyle({
  base: [
    // ❌ Complex attribute + JIT animation tokens
    "[data-in-presentation-snap-points=false][data-state=open]:animate-[inmotion-drawer-slide-from-right_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
    // ❌ Dynamic animation variable tokens
    "animate-[var(--drawer-animation)_0.5s_cubic-bezier(0.32,0.72,0,1)_forwards]",
    // ❌ Any bracket-based arbitrary variants in class strings (e.g., w-[calc(100%-16px)])
    //    Put these as precompiled utilities in your app.css if they must be guaranteed in the bundle
  ],
});
```

**Why: If you re using Class Utilities/Tailwind**

- Class Utilities/Tailwind includes only classes they can statically detect from the configured content files.
- Variant‑injected CSS and dynamic JIT strings are generated at runtime, after Tailwind build.
- Arbitrary variants and attribute selectors in bracket syntax (e.g., `[data-state=open]:...`, `w-[calc(...)]`) won’t be reliably picked up when composed inside runtime style classes/ strings.
- Predeclaring utilities in your `app.css` guarantees these styles ship in `dist/kit.css` bundle, and your style tokens remain simple, portable, and platform‑agnostic.

**🚨 Key Things to Know**

Style composition can be tricky when working with deeply nested and complex style settings. Here's what you need to watch out for:

##### Using the `getStyle` Method

<details>
<summary>💡 <strong>Terminology:</strong> Style API</summary>

The style system provides the `getStyle` method for applying style styles. This method takes your style props and returns the generated class names.

</details>

##### Example Usage

```typescript
import { createStyle, type StyleProps } from "@in/style/variant";

// Create a button style
const ButtonStyle = createStyle({
  base: "inline-flex items-center justify-center rounded transition-colors",
  settings: {
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    },
    format: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    },
  },
  defaultSettings: {
    size: "md",
    format: "primary",
  },
});

// Extract the props type
export type ButtonStyleType = StyleProps<typeof ButtonStyle>;

// Use the style
const primaryButton = ButtonStyle.getStyle({
  size: "lg",
});

// With className prop
const customButton = ButtonStyle.getStyle({
  format: "secondary",
  className: "font-bold",
});
```

##### Missing Properties in `createStyle` Settings

<details>
<summary>💡 <strong>Terminology:</strong> Empty Style Properties</summary>

When creating styles using `createStyle`, each property in the settings object must have at least one value defined, even if it's an empty string. Otherwise, TypeScript will raise type errors when using the style methods.

</details>

**❌ Dont do this**

```typescript
// This will cause a type error
export const HeaderWidgetStyle = createStyle({
  base: "inline-flex cursor-auto",
  settings: {
    format: {
      // Empty object with no properties
    },
    // other styles
  },
  defaultSettings: {
    format: "full",
    // other defaults
  },
});

// Later usage will generate error:
// Property 'getStyle' does not exist on type 'StyleSystemReturn'
const styleClass = HeaderWidgetStyle.getStyle({
  format: "full",
  ...settings,
});
```

**✅ Do this**

```typescript
import { createStyle, type StyleProps } from "@in/style/variant";

export const HeaderWidgetStyle = createStyle({
  base: "inline-flex cursor-auto",
  settings: {
    style: {
      // Must have properties defined
      full: "absolute top-[80px] left-0 z-10 md:hidden overflow-hidden",
      segmented: "", // Even empty strings are acceptable
    },
    // other styles
  },
  defaultSettings: {
    style: "full",
    format: "base",
    size: "base",
    radius: "base",
    theme: "flat",
    axis: "x",
    disabled: false,
  },
});

// Usage
const styleClass = HeaderWidgetStyle.getStyle({
  style: "full",
  ...settings,
});
```

**Extraction Patterns**

```typescript
// ✅ (Founders Choice)
className={ButtonStyle.getStyle({ format, size, className, ...rest })}

// or

// ✅ (Works Too)
className={iss(
  ButtonStyle.getStyle({ format, size, ...rest }),
  className
)}
```

**NOTE**: You can extract style for components i.e children of Widgets/High-level Primitives in one of two ways

```typescript
import { iss } from "@inspatial/kit/style"
// ✅ (Simpler Requires Importing ISS from the `@in/style` or  `@inspatial/kit/style` module)
className={iss(className)} {...rest}


import { ButtonStyle } from "./style.ts"
// ✅ (This just gets its from your app config e.g style.ts)
className={ButtonStyle.getStyle({ className })} {...rest}
```

##### Best Practices

1. **Always define at least one property** for each style category
2. **Use empty strings** (`""`) when no classes are needed
3. **Export typed props** using `StyleProps<typeof yourStyle.getStyle>`
4. **Include all possible options** in your `defaultSettings`

> [!NOTE]
> Adding more styles later is easy, just ensure you update both the `settings` and `defaultSettings` objects.

**More Things to Know About the Style System**

##### 1. Core API (Create Style)

```typescript
// Consistent API shape regardless of how it's called:
const system = createStyle(); // Returns {getStyle, iss, style, composeStyle}
const buttonStyle = createStyle({ ...config }); // Returns {getStyle, iss, style, composeStyle, config}
```

##### 2. Type Extraction

```typescript
// Consistent type extraction from any style pattern:
type ButtonStyleType = StyleProps<typeof ButtonStyle>;
```

##### Using Style Presets

Style presets are named, reusable class strings produced by your styles.

You pick a combination of props once (format/variant/size, etc.), call `*.getStyle(...)`, and export the result as a constant. Consumers then use a single constant instead of repeating the same prop object everywhere.

**Advantages**
- Consistent: the same preset name always yields the same look
- Reusable: import and apply anywhere
- Tree‑shakeable: direct file imports only pull what you use
- Low‑cognitive load: tiny call sites, fewer variant props at usage points

Tip: create a preset when a combo appears in 2+ places; give it a clear, intention‑revealing name.

```typescript
// Direct file import (better tree-shaking)
import { ButtonStyle } from "@in/widget/ornament/button/style.ts";

// Base preset (good default)
export const ButtonBaseStyle = ButtonStyle.getStyle({
  format: "base",
  variant: "base",
  size: "base",
});

// Outlined small preset
export const ButtonOutlineSmStyle = ButtonStyle.getStyle({
  format: "outline",
  variant: "base",
  size: "sm",
});

// Background large preset
export const ButtonBackgroundLgStyle = ButtonStyle.getStyle({
  format: "background",
  variant: "base",
  size: "lg",
});

// Usage
// <Button className={ButtonBaseStyle}>Primary</Button>
// <Button className={ButtonOutlineSmStyle}>Outline</Button>
// <Button className={ButtonBackgroundLgStyle}>Muted</Button>
```

**FAQ - Variant Authority**
When both `style` and `class`/`className` are used to compose the same style properties, the `style` prop takes precedence otherwise known as `Variant Authority` and will override the corresponding styles set in `class`/`className`. For example:

```typescript
<Slot
  className="bg-purple text-white" // This looses to style   ❌
  style={{
    // ✅ This takes Authority
    web: {
      backgroundColor: "green",
      color: "white",
    },
  }}
/>
```

**Switching Variant Authority**
You can switch the variant authority from `style` to `class/className` utilities by simiply prefixing your class value with `!` notation.

```typescript
<Slot
className={{
  "!bg-purple",  // ✅ This takes authority.
  "!text-white",  // ✅ This takes authority.
  "hidden" // ❌ Style takes back authority.
}}

style={{
  web: {
    backgroundColor: "green", //  ❌ This looses.
    color: "white" // ❌ This looses.
    visibility: "visible" // ✅ This wins because `hidden` is not prefixed with `!`.
  },
}}
/>
```

**Known Issues with Colors in `Class/className`**
When using colors inside class utilities, you may need to prefix those values with "!" (e.g., "!bg-purple"). Without it your color changes might not be applied as expected. This is mainly an issue with InSpatial Style Sheet (ISS) Variant Authority ranking system. However doing this means you are also switching the variant authority as seen above.

**NOTE** When composing styles in `createStyle()`, always use variables (e.g., CSS custom properties) instead of hardcoded style values. Direct values will not work.`createStyle()` is a Variable system by design, and intended for to craft intentional design systems.

```typescript
// ❌ Don't do this
export const MyStyle = createStyle({
  base: ["bg-purple-500, text-white-500"], // will not work
});

// ✅ Do This
export const MyStyle = createStyle({
  base: ["bg-(--brand) text-(--primary)"],
});
```

If you wish to use regular design values in `createStyle()`? you will have to treat those values like variables.

```typescript
// ❌ Don't do this
export const MyStyle = createStyle({
  base: ["bg-purple-500, text-white-500"], // will not work
});

// ✅ Do This
export const MyStyle = createStyle({
  base: ["bg-(--color-purple-500) text-(--color-white-500)"],
});
```

##### Composition API

**How composition styling works (and why you’ll love it)**

- If you’ve ever thought: “I want my Drawer to slide from the right, but I also want only the left corners rounded” — and found that your base settings kept winning — this is where the Composition API comes in.
- Or: “I set `direction` and `size`, but I also want `radius` to react to `direction` without rewriting the base styles.” Composition does exactly that.

###### What it is

- **Composition** lets you add “conditional style add‑ons” that run after everything else.
- It’s evaluated based on your current style props (e.g., `direction`, `size`) and then applied last, so it reliably wins without needing `!important`.

###### The precedence model

- Base < Settings < User classes < **Composition (last)**
- This ensures your intent-driven overrides (like “round the entering edge”) always take effect.

###### What you can do with it

- **Condition on any setting**: Apply styles only when `direction="right"` or `size="full"`, etc.
- **Mix classes and CSS**: Provide utilities (like `rounded-l-xl`) and/or exact CSS (like `borderTopLeftRadius: "20px"`).
- **Layer smaller rules**: Add multiple composition entries; all matching rules apply.
- **Avoid `!important`**: Because composition runs last, you keep styles clean.

###### Drawer example: directional radius

- Goal: Round corners based on where the drawer enters.
- With composition, you define rules like:
  - **Right**: round the left corners (entering edge opposite gets radius)
  - **Left**: round the right corners
  - **Top**: round the bottom corners
  - **Bottom**: round the top corners
- These rules activate automatically when `direction` changes — no base rewrites.

```typescript
  createStyle({
    base: [ { web: { pointerEvents: "auto" } }],
    settings: {
      direction: {
        right: [
          {
            web: {
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              minWidth: "40%",
            },
          },
        ],
        left: [

          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%",
              minWidth: "40%",
            },
          },
        ],
        top: [
          {
            web: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              minWidth: "100%",
            },
          },
        ],
        bottom: [
          {
            web: {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              minHeight: "40%",
            },
          },
        ],
      },
    },
    defaultSettings: {
      direction: "right",
    },
    //##########################(START COMPOSITION)###############################
    //*****************(Apply specific radius based on direction)*****************
    //############################################################################
    composition: [
      // Right drawer - round left corners
      {
        direction: "right",
        style: {
          web: {
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
          },
        },
      },
      // Left drawer - round right corners
      {
        direction: "left",
        style: {
          web: {
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          },
        },
      },
      // Top drawer - round bottom corners
      {
        direction: "top",
        style: {
          web: {
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          },
        },
      },
      // Bottom drawer - round top corners
      {
        direction: "bottom",
        style: {
          web: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
          },
        },
      },
    ],
     //############################################################################
     //******************************(End Composition)*****************************
     //############################################################################
  }),
```

###### Patterns you’ll use

- “You want size to take precedence over direction” → add size-centric composition rules that finalize width/height.
- “You want theme radius to react to direction” → gate radius by `direction` using composition so base stays generic.
- “You want variations without bloat” → keep base minimal, express differences via composition rules.

###### Tips

- Keep base/styles simple; move “contextual” or "conditional" tweaks into composition.
- Use CSS in `style.web` for precision; use classes for quick utility layering.
- If two composition rules match, both apply; keep them complementary.
- You rarely need `!important`—composition already runs last.
- If a class uses bracket/attribute syntax or dynamic pieces Tailwind can’t see, define a utility under `@layer utilities` in your CSS and reference the simple token from `createStyle()`.
- If a color variable appears white, ensure the theme variables (e.g., `--brand`, `--background`) are defined to concrete HSL/OKLCH values in your theme scope, not self-referencing.

- **IMPORTANT:** The Composition API only works with the `style` property; using `class` or `className` utilities inside composition rules will not have any effect.

```typescript
composition: [
  // ❌ Don't do this
  {
    direction: "right",
    class: ["bg-green-500"],
  },

  // ✅ Do This
  {
    direction: "right",
    style: {
      web: {
        backgroundColor: "green",
      },
    },
  },
];
```

###### Quick mental model

- Define what’s always true in base/settings.
- Define what’s true “when X happens” in composition.
- Composition is your “finishing pass” — clean, conditional, and reliable.

##### Cross-Style Composition (Advanced)

#### When one style needs to react to settings from other styles

Cross-style composition is like having a conversation between different parts of your component. Think of it as your handle asking the track "Hey, what size are you?" and then adjusting itself accordingly.

Imagine you're building a switch component where the handle needs to position itself differently based on the track's size. Without cross-style composition, each style lives in its own bubble - they can't talk to each other. But with cross-style composition, your styles become aware of each other's settings and can react accordingly.

This is especially powerful for complex UI components where child elements need to adapt based on parent or sibling configurations, like handles adjusting to track sizes, or icons changing based on button variants.

> **Note:** ✨ Cross-style composition now works **automatically** when styles have `name` properties! The system detects cross-references and handles composition transparently. You can still use `composeStyle` manually for advanced use cases.

> **Terminology:** The `$` prefix in composition rules tells the system "look at another style's setting" rather than your own style's setting.

##### The Problem Without Cross-Style Composition

Here's what happens when you try to reference other styles without cross-composition:

```typescript
// ❌ This doesn't work - can't reference other style's settings
const handleStyle = createStyle({
  composition: [
    {
      trackSize: "sm", // This only looks at handle's own settings
      style: { web: { left: "1px" } },
    },
  ],
});
```

##### The Solution: Named Styles and Automatic Cross-References

✨ **Just give your styles names** - the system handles the rest automatically:

```typescript
import { createStyle } from "@inspatial/kit/style";

// Track style with a name
const track = createStyle({
  name: "switch-track", // This name lets other styles reference it
  settings: {
    size: {
      sm: [{ web: { width: "36px", height: "20px" } }],
      lg: [{ web: { width: "90px", height: "48px" } }],
    },
  },
  defaultSettings: { size: "lg" },
});

// Handle style that reacts to track's settings
const handle = createStyle({
  name: "switch-handle",
  base: [{ web: { position: "absolute", left: "2px" } }],
  composition: [
    // Use $ prefix to reference OTHER styles
    {
      "$switch-track.size": "sm", // When track is small
      style: {
        web: {
          width: "16px",
          height: "16px",
          ".peer:checked ~ * &": {
            transform: "translateY(-50%) translateX(100%)",
          },
        },
      },
    },
    {
      "$switch-track.size": "lg", // When track is large
      style: {
        web: {
          left: "2px",
          ".peer:checked ~ * &": {
            transform: "translateY(-50%) translateX(90%)",
          },
        },
      },
    },
  ],
});
```

##### Multiple Cross-References

You can even reference multiple styles in a single composition rule:

```typescript
const handle = createStyle({
  name: "switch-handle",
  composition: [
    {
      // Multiple conditions - ALL must match
      "$switch-track.size": "sm",
      "$switch-track.radius": "squared",
      style: {
        web: { borderRadius: "2px" }, // Special case for small + squared
      },
    },
  ],
});
```

##### Using Cross-Style Composition in Components

✨ **Automatic Cross-Reference** - InSpatial's style system automatically handles cross-style composition when styles have `name` properties and use `$style-name.prop` references:

```typescript
import { iss } from "@inspatial/kit/style";

// ✅ Automatic composition - just works!
function Switch(props) {
  return (
    <label>
      <input type="checkbox" />
      <div className={iss(SwitchStyle.track.getStyle(props))}>
        <div className={iss(SwitchStyle.handle.getStyle(props))}>
          {/* Handle automatically reacts to track's size! */}
          {/* No manual composition needed */}
        </div>
      </div>
    </label>
  );
}
```

<details>
<summary><strong>How Automatic Cross-Style Composition Works</strong></summary>

InSpatial's style system uses a **Context API** and **Global Registry** to automatically handle cross-style dependencies:

**1. Style Registration**
When you create a style with a `name`, it's automatically registered:

```typescript
const SwitchHandle = createStyle({
  name: "switch-handle", // ← Automatically registered
  composition: [
    {
      "$switch-track.size": "lg", // ← Dependency detected
      style: {
        /* ... */
      },
    },
  ],
});
```

**2. Dependency Detection**
The system scans composition rules for `$style-name.prop` patterns and tracks dependencies.

**3. Automatic Composition**
When `SwitchHandle.getStyle()` is called:

- System detects cross-references to `switch-track`
- Automatically finds and includes the `SwitchTrack` style
- Composes them together transparently
- Returns the fully composed className

**4. Context Sharing**
Styles share their settings through a reactive context registry, enabling real-time cross-references.

**Manual Override (Optional)**
If you need explicit control, you can still use `composeStyle`:

```typescript
// Manual composition for advanced use cases
const composedStyle = composeStyle(
  SwitchStyle.track.getStyle,
  SwitchStyle.handle.getStyle
);
```

**Performance**

- Zero overhead when no cross-references exist
- Lazy composition only when needed
- Cached results for repeated calls
- Reactive updates when dependencies change

</details>

##### Real-World Example: Complete Switch Component

Here's how cross-style composition works in a real switch component:

```typescript
// styles/switch.ts
export const SwitchStyle = {
  track: createStyle({
    name: "switch-track",
    base: [{ web: { position: "relative", cursor: "pointer" } }],
    settings: {
      size: {
        sm: [{ web: { width: "36px", height: "20px" } }],
        lg: [{ web: { width: "90px", height: "48px" } }],
      },
      radius: {
        rounded: [{ web: { borderRadius: "9999px" } }],
        squared: [{ web: { borderRadius: "4px" } }],
      },
    },
    defaultSettings: { size: "lg", radius: "rounded" },
  }),

  handle: createStyle({
    name: "switch-handle",
    base: [{ web: { position: "absolute", left: "2px", top: "50%" } }],
    composition: [
      // React to track size
      {
        "$switch-track.size": "sm",
        style: {
          web: {
            width: "16px",
            height: "16px",
            ".peer:checked ~ * &": {
              transform: "translateY(-50%) translateX(100%)",
            },
          },
        },
      },
      // React to both size AND radius
      {
        "$switch-track.size": "sm",
        "$switch-track.radius": "squared",
        style: {
          web: { borderRadius: "2px" }, // Override for this combination
        },
      },
    ],
  }),
};

// components/Switch.tsx
export function Switch(props) {
  const { size, radius, checked, onChange } = props;

  return (
    <label className={iss(SwitchStyle.wrapper.getStyle(props))}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={iss(SwitchStyle.track.getStyle({ size, radius }))}>
        <div className={iss(SwitchStyle.handle.getStyle({ size, radius }))}>
          {/* Handle automatically adjusts based on track settings! */}
          {/* Cross-style composition happens automatically */}
        </div>
      </div>
    </label>
  );
}
```

##### Common Patterns

**Size-based positioning:**

```typescript
composition: [
  { "$parent.size": "sm", style: { web: { left: "1px" } } },
  { "$parent.size": "lg", style: { web: { left: "3px" } } },
];
```

**Theme-aware styling:**

```typescript
composition: [
  { "$theme.mode": "dark", style: { web: { backgroundColor: "#333" } } },
  { "$theme.mode": "light", style: { web: { backgroundColor: "#fff" } } },
];
```

**Multi-condition rules:**

```typescript
composition: [
  {
    "$button.size": "lg",
    "$button.variant": "primary",
    style: { web: { padding: "16px 24px" } },
  },
];
```

##### Important Notes

- **Naming is required:** Styles must have a `name` property to be referenced by others
- **✨ Automatic composition:** Cross-references work automatically - no manual `composeStyle` needed!
- **Manual override available:** Use `composeStyle` for advanced control when needed
- **Order matters:** Composition rules are applied in order, later rules can override earlier ones
- **Zero overhead:** No performance cost when styles don't have cross-references

- **All conditions must match:** When using multiple cross-references, ALL conditions must be true

> **Migration:** Existing `composeStyle` usage continues to work - you can gradually remove manual composition as you add `name` properties to your styles.

##### Pseudo Selectors and Variable Utilities (in @variant)

This section explains how to compose pseudo selectors (hover, focus-visible, peer-checked, data attributes) and variable-aware class utilities inside `createStyle()` while keeping everything portable and predictable across platforms.

Key ideas:

- Write simple utility tokens in `base` and `settings` when Tailwind can statically see them.
- Use `style.web` nested selectors for pseudo-classes, peer relations, or data attributes the same way you would write CSS, but in JS objects.
- Use variable utilities like `bg-(--brand)`, `text-(--primary)`, `border-(--surface)` so your tokens bind to theme variables.
- For tokens Tailwind can't safely detect or for vendor-specific shorthands (e.g., ring), either define a utility in CSS or use `style.web` to set the exact CSS property.

Example: simple checkbox indicator (utilities + one nested selector)

```typescript
import { createStyle, type StyleProps } from "@in/style/variant";

export const CheckboxStyle = {
  indicator: createStyle({
    base: [
      "inline-flex items-center justify-center",
      "bg-(--background)",
      // Focus outline via utilities
      "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-(--brand)",
      {
        web: {
          // When the hidden input peer is checked, paint the indicator
          ".peer:checked ~ &": {
            backgroundColor: "var(--brand)",
            color: "white",
            // Optional: brand ring without Tailwind
            boxShadow: "0 0 0 2px var(--background), 0 0 0 4px var(--brand)",
          },
        },
      },
    ],
  }),
};

export type CheckboxIndicatorStyleProps = StyleProps<
  typeof CheckboxStyle.indicator.getStyle
>;
```
