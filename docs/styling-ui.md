# Styling & UI

## 1. InSpatial Renderer

- **Extensible Architecture:** Decouples component logic from rendering environment.
- **`createRenderer(nodeOps, rendererID?)`:** Creates a custom renderer.
- **`DOMRenderer(InTrigger)` (`@inspatial/kit/dom-renderer`):** For interactive web applications.
  _ **Triggers & Event Handling:** `on:eventName` (e.g., `on:click`). Supports modifiers like `on-once:`, `on-passive:`, `on-capture:`, `on-prevent:`, `on-stop:`.
  _ **Browser Preset Directives:** `class:className={signal}` for conditional classes, `style:property={value}` for individual styling (CSS) properties.
  \_ **Handling Dynamic HTML Content:** For inserting dynamic HTML (e.g., from APIs), prefer parsing the HTML into a `DocumentFragment` and rendering it directly within the component. This is more robust and integrates better with InSpatial's retained mode rendering than using `innerHTML` directly, which can have security implications and reconciliation challenges.

- **`GPURenderer(InTrigger)` (`@inspatial/kit/gpu-renderer`):** For interactive 3D & XR applications. \* \*\*Soon...

## 2. Templating & Runtime

InSpatial ships with a JSX runtime by default, but you can also compose UI with our renderer primitives. Think of the runtime as one way to template your UI. The renderer primitives are a minimal, framework-agnostic alternative when you want explicit control or teaching-oriented examples.

#### JSX Runtime

- **Retained Mode:** JSX templates are evaluated once to build the initial UI.
- **Pragma Transform::** Provides maximum flexibility. Requires configuring `jsxFactory: 'R.c'` and `jsxFragment: 'R.f'` in build tools (Vite, Babel). Components receive `R` as an argument.
- **Automatic Runtime:** Easier setup, but less flexible. Configures `jsx: 'automatic'` and `jsxImportSource: 'InSpatial'`.
- **Hot Reload:** Use `InVite` extension for vite-rollup/rolldown and `InPack` for webpack/rspack client development.

#### Creating your own runtime?

###### Composing components with renderer primitives

So far you have been composing components using <Tag> widgets, but under the hood InSpatial also lets you compose UI with primitive render functions. The `Fn` control-flow returns a render function that receives a low-level renderer `R`. Using `R.c` (create element) and `R.text` (create text) keeps examples minimal. Below is an example of how to compose a component via renderer primitives

```typescript
import {
  Fn,
  useTable,
  type ColumnDef,
  getCoreRowModel,
} from "@inspatial/kit/control-flow";

export type PrimitiveTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
};

export function PrimitiveTable<TData>({
  columns,
  data,
}: PrimitiveTableProps<TData>) {
  return Fn({ name: "PrimitiveTable" }, () => {
    const { table } = useTable<TData>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (R: any) => {
      const headerGroups = table.getHeaderGroups();
      const rows = table.getRowModel().rows;

      return R.c(
        "div",
        { style: { width: "100%", padding: "8px" } },
        R.c(
          "div",
          { style: { marginBottom: "8px", fontSize: "12px", color: "#667" } },
          R.text(`PrimitiveTable • data: ${data.length} • rows: ${rows.length}`)
        ),
        R.c(
          "table",
          { style: { width: "100%", borderCollapse: "collapse" } },
          R.c(
            "thead",
            {},
            ...headerGroups.map((hg) =>
              R.c(
                "tr",
                { key: hg.id },
                ...hg.headers.map((h) =>
                  R.c(
                    "th",
                    {
                      key: h.id,
                      style: {
                        textAlign: "left",
                        borderBottom: "2px solid var(--muted)",
                        padding: "8px 12px",
                      },
                    },
                    h.isPlaceholder
                      ? null
                      : R.text(
                          String(
                            (h.column.columnDef as any).header ?? h.column.id
                          )
                        )
                  )
                )
              )
            )
          ),
          R.c(
            "tbody",
            {},
            ...rows.map((row, idx) =>
              R.c(
                "tr",
                { key: String((row.original as any)?.id ?? row.id ?? idx) },
                ...row.getVisibleCells().map((cell) =>
                  R.c(
                    "td",
                    {
                      key: cell.id,
                      style: {
                        padding: "8px 12px",
                        borderBottom: "1px solid var(--muted)",
                      },
                    },
                    (() => {
                      const cellDef = cell.column.columnDef as any;
                      if (typeof cellDef.cell === "function") {
                        const result = cellDef.cell(cell.getContext());
                        return R.text(String(result ?? cell.getValue()));
                      }
                      return R.text(String(cell.getValue()));
                    })()
                  )
                )
              )
            )
          )
        )
      );
    };
  });
}
```

##### SFC Templates

Single File Component - coming soon...

Notes:

- Use `!` prefixed utilities (e.g., `!bg-*`) to give class utilities authority over variant-generated background colors.
- Prefer overriding at the row level (`<TableRow className="..." />`). Removing the conditional override restores the default zebra striping.

#### Render targets - "Use Directives"

InSpatial allows you to switch between renderers with directives, because all InSpatial Kit components and widgets are built for different platforms e.g `button.dom.tsx`, `button.gpu.tsx` etc... You can easily switch the render targets by declaring the following directive at the beginning of your `window.tsx` or `scene.tsx` files.

##### For `window.tsx` Views

- **"use native":** universal defaults this is the default directive and is what is auto attached to every .tsx file if no directive is declared. This will auto use the appropraite renderer based on detected environment.
- **"use dom":**
- **"use gpu":**
- **"use ios:"**
- **"use visionos:"**
- **"use android:"**
- **"use androidxr:"**
- **"use horizonos:"**
- **"use ssr:"**

##### For `scene.tsx` Views

- **"use volumentric":** for 3d scenes
- **"use ar":** for augmented reality scenes
- **"use vr":** for virtual reality scenes
- **"use mr":** for mixed reality scenes

## 3. Widgets & Components

A Widget is a high-level primitive. It simple terms a widget contains multiple components. e.g an <InputField> has different variants of components i.e <TextField>, <NumberField> etc...

NOTE: Only high-level primitives (such as Input, Ornament, Presentation, etc.) support `variants`. Each variant/children can have multiple `formats`, which act as sub-variants.

### Control Flow

Control flows allow you to...

- **Structure & Control Flow Components:**
  _ `<Show when={signal}>`: Conditional rendering. Supports `true` and `else` props. For one-off static conditions, you can use inline typescript to return the desired branch directly just like in React(but will not have reactivity).
  _ `<List each={signalOfArray} track="key" indexed={true}>`: Efficiently renders lists with reconciliation by handling all list rendering scenarios. Automatically handles static arrays and signals, eliminates need for `derivedExtract`, provides direct item access in templates. Use `track` for stable keys when data changes completely. Exposes `getItem()`, `remove()`, `clear()` methods. View functions receive raw item data directly for clean, readable syntax.
  _ `<Async future={promise}>`: Manages asynchronous operations (pending, resolved, rejected states). `async` components automatically get `fallback` and `catch` props.
  _ **Error Handling in Asynchronous Components:** Implement robust error handling within `async` components. Utilize the `catch` prop of `<Async>` components or direct `fallback`/`catch` props on async components, and `try...catch` blocks for network requests to gracefully manage and display errors to the user.
  _ `<Dynamic is={componentOrTag}>`: Renders a component or HTML tag that can change dynamically.
  _ `<Fn ctx={value} catch={errorHandler}>`: Executes a function that returns a render function, useful for complex logic with error boundaries. \* **List Management:** Use `List` component's exposed methods (`getItem()`, `remove()`, `clear()`) for imperative list manipulation when needed.

- **`$ref`:** Special prop to get a reference to a DOM element or component instance (as a signal or function). **Critical for hot reload in dev mode:** always use `$ref` for component references, not `createComponent()` return values.
- **`expose()`:** Allows child components to expose properties/methods to their parent via `$ref`.
- **`capture()`:** Captures the current rendering context, useful for running functions (e.g., `expose()`) after `await` calls in async components.
- **Importing:** All built-in components can be imported directly from package `InSpatial`
- **`createComponent(template, props?, ...children)`:** Creates component instances
  **`renderer.render(container, component, props, ...children)`:** Renders a component into a container, with optional props and children.
  **`dispose(instance)`:** Cleans up component resources
  **`getCurrentSelf()`:** Gets current component instance
  **`snapshot()`:** Creates context snapshots for async operations
- **JSX Children in Control Flow Components:** When using components like `<Show>` and `<List>`, ensure their render function children return either a _single root element_ or a `Fragment` (`<>...</>`) if rendering multiple sibling elements. This prevents unexpected rendering issues.
- `**Fn`\*\* provides a render closure; inside it, you can read the table header groups and row model.
- **`R.c(tag, props, ...children)`** creates elements; `R.text(string)` creates text nodes.

### Structure

When you build anything, a house, a painting, or an app, you need **a frame**.

- In a house, it’s the walls and floors.
- In a painting, it’s the canvas.
- In Spatial, it’s the **Structure** widget.

Without structure, you have chaos. Elements float around without clear boundaries or rules. The Structure Widget gives **shape** and **intent** to everything that comes after.

**Structure** is the skeleton of your app → gives layout meaning.

---

#### `<View>`

`View` is a variant of the Structure Widget. Its generally the entry-point to building a component. It’s the surface where everything else in your component gets painted or placed.

- That’s why you only need **one `<View>`** at the root of your component, just like you only need **one canvas** for a single painting.
- Having multiple `<View>`s at the same level is like starting several canvases for one artwork: confusing, fragmented, and difficult to manage.

**Why It Fills the Whole Screen**

By default, `<View>` expands to the **maximum width and height of the viewport**.

- This ensures your “canvas” is **complete**, no cutoff edges.
- But since it covers the whole space, it doesn’t scroll automatically. Why? Because if your canvas is already infinite, you don’t need scroll until your content overflows.

So scroll is **opt-in**, not forced. That’s where the `View`’s scrollbar settings come in.

**Scrolling In Views**

The `<View>` component is not just a passive box. It’s your **stage**.

- Sometimes the stage needs to allow the audience (users) to move around → **scrollbars**.
- Sometimes the stage needs to shift moods, pace, or transitions → **motion and animation**.

Because `View` is the stage, it controls these high-level experiences. You don’t sprinkle scroll or motion randomly across elements; you anchor them at the structural level.

**Example Usage**

```typescript
<View>
  <Stack variant="yStack" className="space-y-2 p-2 bg-(--brand) w-full">
    {Array.from({ length: 30 }).map((_, i) => (
      <YStack key={i} className="p-3 rounded bg-(--surface) text-(--primary)">
        Item {i + 1}
      </YStack>
    ))}
  </Stack>
</View>
```

**View `ScrollBar`Themes & Properties**

```typescript
// Thin (default)
<View scrollbar scrollbarTheme="thin">...</View>

// Minimal (thumb appears on hover)
<View scrollbar scrollbarTheme="minimal">...</View>

// Rounded
<View scrollbar scrollbarTheme="rounded">...</View>

// Pill
<View scrollbar scrollbarTheme="pill">...</View>

// Gradient
<View scrollbar scrollbarTheme="gradient">...</View>
```

#### `<Table>`

##### Zebra Table

A zebra table is just a table where every other row has a different background color—like light, then slightly darker, then light again. This striping makes it easier for your eyes to follow a row across the page, especially in wide or crowded tables.

Tables are zebra-striped by default. Striping is applied in `TableStyle.body` using nested selectors (`& > tr:nth-child(odd|even)`) generated by the `@in/style` variant system, not Tailwind `odd:` utilities. Background colors use theme variables: `var(--background)` for odd rows and `var(--surface)` for even rows. No per-row logic is needed in views.

**Manual Overide of `Zebra` Table Row**

```typescript
import {
  TableList,
  TableCell,
  TableHeaderColumn,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@inspatial/kit/control-flow";

<TableWrapper>
  <TableHeader>
    <TableRow>
      <TableHeaderColumn>ID</TableHeaderColumn>
      <TableHeaderColumn>Name</TableHeaderColumn>
    </TableRow>
  </TableHeader>
  <TableList>
    {entries.get().map((entry: EntryProps, idx: number) => (
      <TableRow
        key={entry.id}
        className={idx % 2 === 0 ? "!bg-black-500" : "!bg-yellow-500"}
      >
        <TableCell>{entry.id}</TableCell>
        <TableCell>{entry.name}</TableCell>
      </TableRow>
    ))}
  </TableList>
</TableWrapper>;
```

### Presentation

#### Modal

```typescript
import { Modal } from "@inspatial/kit/presentation";
import { YStack } from "@inspatial/kit/structure";
import { Text } from "@inspatial/kit/typography";
import { Button } from "@inspatial/kit/ornament";

<Modal
  id="counter-modal"
  closeOnEsc
  closeOnScrim
  className="flex justify-center items-center h-screen w-screen m-auto"
>
  <YStack className="p-6 gap-3 w-[500px] h-[500px] bg-(--brand) rounded-3xl shadow-effect">
    <Text className="text-xl font-semibold">Title</Text>
    <Text>
      Use the buttons to adjust the counter and explore trigger props. This
      modal is controlled via on:presentation.
    </Text>
    <Button
      format="outline"
      on:presentation={{ id: "counter-modal", action: "close" }}
    >
      Close
    </Button>
  </YStack>
</Modal>;
```

#### Portals

Uses the Presentation Portals `Inlet/Outlet` to render components outside their original DOM hierarchy.

```typescript
import {
  PresentationInlet,
  PresentationOutlet,
  Modal,
} from "@inspatial/kit/presentation";

<Modal>
  {/* The Presentation Outlet displays content provided by the Inlet */}
  <PresentationOutlet fallback={() => <Text>Hello World</Text>} />
</Modal>;

{
  /* The Presentation Inlet sends its children to be rendered by the Outlet */
}
<PresentationInlet>
  <Text>Render on the modal</Text>
</PresentationInlet>;
```

**6. InSpatial Styling:**
InSpatial Style Sheet (ISS) or `@inspatial/style` is built on InSpatial's `@in/style`module a variant based styling engine largely inspired by Stiches.

Don’t use peek()/get() inside style objects. Pass the Signals directly so the renderer can subscribe.

Example

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

## 4. Style Composition: (Variant Authority)

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

You can style with both class utilities (`class`/`className`) and style props (`style.web`) and even mix them when a value is only accessible one way (e.g., a precise style declaration). However, for most components it’s more optimal to pick one approach per area to keep authority predictable and the mental model simple.

#### Rule of Thumb

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
className={ButtonStyle.getStyle({ format, size, ...rest, className })}

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

##### Using Factory Pattern

If you're using the factory pattern (creating your own style system):

```typescript
// Create a custom style system
const myStyleSystem = createStyle({
  hooks: {
    onComplete: (className) => `my-prefix-${className}`,
  },
});

// Use the system to create styles
const button = myStyleSystem.style({
  base: "rounded",
  settings: {
    size: {
      sm: "text-sm",
      lg: "text-lg",
    },
  },
});

// Apply the style
const className = button({ size: "sm" });
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
You can switch the variant authority to from `style` to `class/className` utilities by simiply prefixing your class value with `!` notation.

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

> **Note:** Cross-style composition only works when styles are composed together using the `composeStyle` function. Individual styles called separately don't have access to each other's context.

> **Terminology:** The `$` prefix in composition rules tells the system "look at another style's setting" rather than your own style's setting.

##### The Problem Without Cross-Style Composition

Here's what happens when you try to reference other styles without cross-composition:

```typescript
// ❌ This doesn't work - can't reference other style's settings
const handleStyle = createStyle({
  composition: [
    {
      trackSize: "sm", // This only looks at handle's own settings
      style: { web: { left: "1px" } }
    }
  ]
});
```

##### The Solution: Named Styles and Cross-References

First, give your styles names so they can reference each other:

```typescript
import { createStyle } from "@inspatial/kit/style";

// Track style with a name
const track = createStyle({
  name: "switch-track", // This name lets other styles reference it
  settings: {
    size: {
      sm: [{ web: { width: "36px", height: "20px" } }],
      lg: [{ web: { width: "90px", height: "48px" } }],
    }
  },
  defaultSettings: { size: "lg" }
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
            transform: "translateY(-50%) translateX(100%)"
          }
        }
      }
    },
    {
      "$switch-track.size": "lg", // When track is large  
      style: {
        web: {
          left: "2px",
          ".peer:checked ~ * &": {
            transform: "translateY(-50%) translateX(90%)"
          }
        }
      }
    }
  ]
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
        web: { borderRadius: "2px" } // Special case for small + squared
      }
    }
  ]
});
```

##### Using Cross-Style Composition in Components

The magic happens when you use `composeStyle` to bring everything together:

```typescript
import { composeStyle, iss } from "@inspatial/kit/style";

// ❌ Without composeStyle - styles don't know about each other
function SwitchBroken(props) {
  return (
    <label>
      <input type="checkbox" />
      <div className={iss(SwitchStyle.track.getStyle(props))}>
        <div className={iss(SwitchStyle.handle.getStyle(props))}>
          {/* Handle can't react to track's size */}
        </div>
      </div>
    </label>
  );
}

// ✅ With composeStyle - styles can cross-reference each other
function Switch(props) {
  // Create composed style that knows about all related styles
  const composedSwitchStyle = composeStyle(
    SwitchStyle.track.getStyle,
    SwitchStyle.handle.getStyle
  );

  return (
    <label>
      <input type="checkbox" />
      <div className={iss(composedSwitchStyle(props))}>
        {/* Now handle can react to track's size! */}
      </div>
    </label>
  );
}
```

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
        lg: [{ web: { width: "90px", height: "48px" } }]
      },
      radius: {
        rounded: [{ web: { borderRadius: "9999px" } }],
        squared: [{ web: { borderRadius: "4px" } }]
      }
    },
    defaultSettings: { size: "lg", radius: "rounded" }
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
              transform: "translateY(-50%) translateX(100%)"
            }
          }
        }
      },
      // React to both size AND radius
      {
        "$switch-track.size": "sm",
        "$switch-track.radius": "squared", 
        style: {
          web: { borderRadius: "2px" } // Override for this combination
        }
      }
    ]
  })
};

// components/Switch.tsx
export function Switch(props) {
  const { size, radius, checked, onChange } = props;
  
  // Compose styles so they can cross-reference
  const composedStyle = composeStyle(
    SwitchStyle.track.getStyle,
    SwitchStyle.handle.getStyle
  );

  return (
    <label className={iss(SwitchStyle.wrapper.getStyle(props))}>
      <input 
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={iss(composedStyle({ size, radius }))}>
        {/* Handle automatically adjusts based on track settings */}
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
  { "$parent.size": "lg", style: { web: { left: "3px" } } }
]
```

**Theme-aware styling:**
```typescript
composition: [
  { "$theme.mode": "dark", style: { web: { backgroundColor: "#333" } } },
  { "$theme.mode": "light", style: { web: { backgroundColor: "#fff" } } }
]
```

**Multi-condition rules:**
```typescript
composition: [
  {
    "$button.size": "lg",
    "$button.variant": "primary",
    style: { web: { padding: "16px 24px" } }
  }
]
```

##### Important Notes

- **Naming is required:** Styles must have a `name` property to be referenced by others
- **Use `composeStyle`:** Cross-references only work when styles are composed together
- **Order matters:** Composition rules are applied in order, later rules can override earlier ones
- **All conditions must match:** When using multiple cross-references, ALL conditions must be true

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
