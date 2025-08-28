# InSpatial Kit

InSpatial Kit is based on InSpatial's own signal reactive primitives `@in/teract`. InSpatial sematically shares sytax with the likes of React, SolidJS and Preact.

InSpatial Kit is the Framework Runtime for InSpatial universal renderer `@in/renderer` which targets all platforms with support for multiple templating e.g JSX.

**Important** InSpatial Kit is its own independent self-contained framework powered by its own dev modules, concept, opinions and renderers and as such IT IS IS DIFFERENT FROM REACT, SOLIDJS, PREACT or any other framework.

InSpatial Kit is the highest layer of abstraction for both InSpatial dev and cloud UDE modules. All core utilities, actions and APIs are encapsulated into simpler functions and file routes essentially removing the need for any form of project initialization or configurations. InSpatial Kit removes the need to install or use any of InSpatial's stand-alone dev and cloud modules as they come bundled with it by default.

### NOTE

- **THIS IS NOT A REACT PROJECT**: Do not import, write or use React apis and hooks.

- All InSpatial Dev Modules start with `@in` directive

- Build success doesn't mean no runtime issues. Check carefully if you have made any existing variables disappear during an edit, or the new variables has not been declared.

- If you want to check build errors in deno use the deno core command `deno task build` when using `InServe` renderer extension. Use `deno check` or `deno lint` too for comprehensive checks. For pnpm use `pnpm build`, do not use `pnpm dev`, as `pnpm dev` spawns a blocking dev server that never automatically exits.

## AI contribution rules (apply to every task)

1. Preserve existing code style, indentation, variable names, resource naming, and line endings; never re-format unrelated code.
2. Make the smallest possible change set that fully addresses the task; do not touch out-of-scope files.
3. Fix root causes rather than masking symptoms; avoid defensive checks unless requested.
4. Do not change public APIs or existing functionality unless required by the task.
5. Do not easily remove/change parts you don't understand. Ask users if you really want them changed.

**Important Notes for this Project:**

- **Retained Mode Rendering:** InSpatial directly manages the DOM based on state, unlike virtual DOM libraries.
- **Browser Preset:** The project specifically uses `@in/dom` an InSpatial DOM/Web renderer module which is a sibling to `@in/native` for native (iOS, Android, and VisionOS) rendering as well as `@in/gpu` for 3D & XR rendering.
- **Reactivity:** Use InSpatial primary Signal apis `signal`, `computed`/`$`, `watch`, for interactity and state management.
- **Kit:** Use InSpatial Kit control-flow primitives like `List`, and `Show`
- **InSpatial Cloud:** All datasource and backend functionality must ONLY use `@inspatial/cloud` and `@inspatial/cloud-client.
- **No 3rd Party Dependecies or NPM Packages**: MUST not install third-party packages or NPM packages. All packages must be installed from JSR and only InSpatial Dev Modules which start with `@in` or `@inspatial` directives.
- **InSpatial Serve:** All new projects MUST use InSpatial Serve and its `InServe` extension to bundle, mininify, serve, style/css transform, and hot-reload. Basically replaces the need for tools like Vite, RSPack or WebPack. Do not ever install or use those tools to Kit an InSpatial App.

---

# InSpatial Kit Concepts & Guide

## Styling & UI

### 1. InSpatial Renderer

- **Extensible Architecture:** Decouples component logic from rendering environment.
- **`createRenderer(nodeOps, rendererID?)`:** Creates a custom renderer.
- **`DOMRenderer(InTrigger)` (`@inspatial/kit/dom-renderer`):** For interactive web applications.
  _ **Triggers & Event Handling:** `on:eventName` (e.g., `on:click`). Supports modifiers like `on-once:`, `on-passive:`, `on-capture:`, `on-prevent:`, `on-stop:`.
  _ **Browser Preset Directives:** `class:className={signal}` for conditional classes, `style:property={value}` for individual styling (CSS) properties.
  \_ **Handling Dynamic HTML Content:** For inserting dynamic HTML (e.g., from APIs), prefer parsing the HTML into a `DocumentFragment` and rendering it directly within the component. This is more robust and integrates better with InSpatial's retained mode rendering than using `innerHTML` directly, which can have security implications and reconciliation challenges.

- **`GPURenderer(InTrigger)` (`@inspatial/kit/gpu-renderer`):** For interactive 3D & XR applications. \* \*\*Soon...

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

### 2. InSpatial Runtime

Built on top the universal runtime

#### JSX Runtime

- **Retained Mode:** JSX templates are evaluated once to build the initial UI.
- **Pragma Transform::** Provides maximum flexibility. Requires configuring `jsxFactory: 'R.c'` and `jsxFragment: 'R.f'` in build tools (Vite, Babel). Components receive `R` as an argument.
- **Automatic Runtime:** Easier setup, but less flexible. Configures `jsx: 'automatic'` and `jsxImportSource: 'InSpatial'`.
- **Hot Reload:** Use `InVite` extension for vite-rollup/rolldown and `InPack` for webpack/rspack client development.

#### Creating your own runtime?

### 3. Widgets & Components

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

A Structure is for...

#### <`view`> / `<ScrollView>`

By default, InSpatial apps display content at the maximum width and height of the viewport, so scrolling and scrollbars are not enabled automatically. The `ScrollView` structure component provides scrolling functionality when needed. It offers properties to show or hide the scrollbar, select different scrollbar variants, and supports animating its children with various `InMotion` effects and animations.

**Example Usage**

```typescript
<ScrollView>
  <Stack variant="yStack" className="space-y-2 p-2 bg-(--brand) w-full">
    {Array.from({ length: 30 }).map((_, i) => (
      <YStack key={i} className="p-3 rounded bg-(--surface) text-(--primary)">
        Item {i + 1}
      </YStack>
    ))}
  </Stack>
</ScrollView>
```

**ScrollView `Bar`Themes & Properties**

```typescript
// Thin (default)
<ScrollView scrollbar scrollbarTheme="thin">...</ScrollView>

// Minimal (thumb appears on hover)
<ScrollView scrollbar scrollbarTheme="minimal">...</ScrollView>

// Rounded
<ScrollView scrollbar scrollbarTheme="rounded">...</ScrollView>

// Pill
<ScrollView scrollbar scrollbarTheme="pill">...</ScrollView>

// Gradient
<ScrollView scrollbar scrollbarTheme="gradient">...</ScrollView>
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
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@inspatial/kit/control-flow";

<TableWrapper>
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Name</TableHead>
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

#### Templating

InSpatial ships with a JSX runtime by default, but you can also compose UI with our renderer primitives. Think of the runtime as one way to template your UI. The renderer primitives are a minimal, framework-agnostic alternative when you want explicit control or teaching-oriented examples.

##### JSX templates

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

#### Lazy Styling (Alternative)

Lazy styling allows you to pass multiple style prop in a single component
Styling can also be done by calling multiple direct style props e.g

```typescript
// ❌  DON'T DO THIS: Anti-Pattern but works
<Component
  style:color="black"
  style:background-color="yellow"
  style:font-size="20px"
  style:z-index="2147483646"
/>
```

While this approach is available, it should mainly be used as an "escape hatch" for special cases. Using multiple direct style props assumes you are only targeting the web, lacks types-safety and can lead to anti-patterns such as parsing the same prop multiple times within a single component. Prefer the standard reactive style and className patterns for most use cases. If you choose to use this pattern only use it for one style prop e.g

```typescript
// ✅ DO THIS
<Componen style:z-index="2147483646" />
```

- **Styling Dynamic Elements:** For dynamically styled elements, leverage InSpatial's browser preset capabilities for conditional classes (`class:active={signal}`) and inline styles (`style:property={value}`) to ensure styles update correctly with state changes. \* \*\*Soon...

#### Style Composition: (Variant Authority)

NOTE: `@in/style/variant` enables object/web style injection, compiling all style keys into unique CSS classes (e.g., .in-abc123) that are injected once into a `<style data-in-variant>` tag. With the `createStyle()` API, you can write both CSS and Tailwind-like styles directly in TypeScript, not in `.css` files. InSpatial Kit Widgets & Components use these utilities, but they are not traditional CSS or Tailwind—they are compiled and applied at runtime based on your platform and render target. If TailwindCSS is installed, InSpatial will use its utilities; otherwise, it falls back to standard CSS. The styles you write look like Tailwind or CSS, but are managed by the InSpatial Style Sheet (ISS) system, which handles platform-specific transpilation for you.

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

## Interactivity

### 4. Signals (@in/teract/signal)

InSpatial Kit is fundamentally reactive signal based system. The core signal primitives InSpatial State is that `@in/teract` is an signal based interactivity and state management system. It is subdivided into two types of reactive systems. There is Signal Core and Signal Lite each inspired by SolidJS and Preact respectively.

- **Definition:** Reactive containers (`createSignal()`) that notify observers on value changes.
- **Computed Signals:** Derive values from other signals (`computed()`, or `$(...)` alias) and update automatically.
- **Effects:** Functions (`watch()` or `createEffect()`) that re-run when their signal dependencies change.
- **Access:** Use `.value` for read/write. `peek()` reads without creating dependencies.
- **Signal Batching:** Updates are automatically batched - effects only run once per tick.
- **Important:** In JSX, dynamic expressions depending on signals _must_ be wrapped in `$(...)` to be reactive (e.g., `$(() => \`Count: ${count.value}\`)`). Simple signal references like `{count}` are automatically handled.
- **One-off combined condition:** You don't need to wrap static combined conditions in `$(...)` if they're only used one-off, and don't change in the future. Like when a condition doesn't include any signal dependencies.

**Signal Operations:**
Use the extensive signal operation methods (`.and()`, `.eq()`, `.gt()`, etc.) for cleaner conditional logic instead of complex computed signals.

- **Utility Functions:** `read()`, `write()`, `readAll()`, `poke()`, `touch()` for safe signal manipulation
- **Logical Operations:** `.and()`, `.or()`, `.andNot()`, `.orNot()`, `.inverse()`, `.inverseAnd()`, etc.
- **Comparisons:** `.eq()`, `.neq()`, `.gt()`, `.lt()`
- **Conditional:** `.nullishThen()`, `.hasValue()`
- **Advanced:** `merge()`, `derive()`, `extract()`, `tpl\`...\``, `not()`, `onCondition()`

**Best Practices:**

- Create renderer instances **once** at the application entry point.
- Use computed signals (`$()`) for derived data and reactive expressions in JSX.
- Dispose of effects when no longer needed (`dispose()` from `watch()`, or `onDispose()`).
- Use `peek()` to avoid creating unnecessary dependencies.
- Updates are automatically batched.
- Use `untrack()` for non-reactive operations.
- Use `watch()` for effects without returning cleanup functions.
- `createEffect()` handles cleanup automatically and passes additional arguments to the effect.
- Always use `$ref` for component references in development with Hot Reaload.
- **State Management:** For complex applications, consider managing state outside of your components and passing it down as props. This promotes better separation of concerns.
- **Manual Triggering:** When mutating arrays or objects directly, use `.trigger()` to notify InSpatial of the change.
- **Focus Management:** Use the `$ref` prop with a `setTimeout` to reliably manage focus on elements, especially after asynchronous operations.
- **View Literals:** Use `tpl\`...\`` for reactive template strings or the simple template literal \`...\` for string interpolation in URLs.
- **Reactivity Pitfalls:** Remember to wrap expressions in `$(...)` within JSX when they need to be reactive. Be mindful of when to use `peek()` or `untrack()` to control signal dependencies and avoid unnecessary re-renders.
- **Auto Coercion:**
  `.get()` is auto-coerced e.g if you have a value `signal.count` it would auto append or use `.get()` hence making it the same as `signal.count.get()`.
  While `.get()` is the default appended value you can opt out because `.get()` assumes your function is reactive by default and that may not always be the case, if this is not the case and you want to avoid tracking or create dependencies in imperative `.set()` calls, then use `.peek()`. Also don't be a stranger and utilize all the other available interactive signal operators at your disposal for their appropriate use case.

NOTE: hasValue returns plain boolean. Returns true when the value of the signal is not nullish.

#### First principles: keep it simple, make it reactive

- **If I make everything reactive or computed, do I need to worry about performance?**

  - **Answer**: No.
  - **Why?**: InSpatial Kit is built for interactivity, so using reactive patterns by default is generally safe and won’t cause noticeable slowdowns.

- **What “reactive” really means**

  - Values remember who cares about them. When a value changes, only the things that depend on it update.
  - If nothing changes, nothing runs. Idle cost is basically zero.

- **Signals and `$`**

  - Signals are just values you can watch. `$` makes a value that follows other values.
  - Don’t wrap hard-coded constants in `$`. Use `$` for anything that’s derived from changing state.

- **State**

  - Each field in your state is its own signal. Update one field without waking the whole app.
  - Batch multiple updates together when you can.

- **UI flow**

  - `Show`: with a plain boolean, it’s just an if/else. With a signal, it updates when that signal changes.
  - `Choose`: checks cases in order and updates when their conditions change.
  - `List`: give items a key when lists get big or reorder often.

- **Good defaults**

  - Make things reactive by default.
  - Hoist reused computeds and handlers out of tight loops.
  - Use keys for large lists; group multiple updates.

- **When to think twice**

  - Huge lists that constantly reorder → use keys, paginate, or virtualize.
  - Creating thousands of new computeds per frame → reuse instead of recreating. In other words - avoid unintended tracking and avoid creating lots of new watchers in tight loops.

- **Bottom line**
  - Reactive-by-default is safe. Work scales with what actually changes, not with app size.

### 5. InSpatial State (@inspatial/kit/state)

InSpatial State is built-in state management system for InSpatial Kit. InSpatial State provides a higher-level abstraction built on top of InSpatial's reactive signal module `@in/teract/signal`.

You can use InSpatial State in two ways:

- Explicit pattern: everything in one place via `createState.in()`
- Separation pattern: compose `createState`, `createAction`, `createStorage`

Key capabilities: batch, reset, snapshot, subscribe, derived values, and a unified trigger API.

#### Explicit pattern (recommended)

```ts
const counterState = createState.in({
  initialState: { count: 0, name: "user" },
  action: {
    increment: { key: "count", fn: (c, n = 1) => c + n },
    setName: { key: "name", fn: (_, name: string) => name },
  },
  storage: { key: "counterState", backend: "local" },
});

counterState.action.increment();
counterState.count.get();
```

#### Separation pattern (advanced)

```ts
const gameState = createState({ x: 0, y: 0, hp: 100, score: 0 });

// Direct Signal Action
const addScore = createAction(gameState.score, (s, n = 1) => s + n);

// Tuple Actions
const damage = createAction([gameState, "hp"], (hp, amt = 10) =>
  Math.max(0, hp - amt)
);

// Batch Actions
const move = createAction(gameState, {
  moveX: { key: "x", fn: (x, dx: number) => x + dx },
  moveY: { key: "y", fn: (y, dy: number) => y + dy },
});

// Optional persistence
createStorage(gameState, {
  key: "gameState",
  backend: "local",
  include: ["hp", "score"],
});
```

#### Feature snippets

- Signals on every key
  ```ts
  const s = createState({ a: 1, b: 2 });
  s.a.set(3);
  s.b.get();
  ```
- Batch/reset/snapshot/subscribe
  ```ts
  s.batch((v) => {
    v.a.set(10);
    v.b.set(20);
  });
  s.reset();
  s.snapshot();
  const off = s.subscribe((snap) => console.log(snap));
  off();
  ```
- Derived values
  ```ts
  const score2x = $(() => gameState.score.get() * 2);
  ```
- Action Trigger options
  ```ts
  const inc = createAction(s.a, (v) => v + 1, { throttle: 50, once: false });
  ```

#### Choosing InSpatial State Pattern

Is this a module or extension?
├── Yes → Use Separation Pattern  
└── No → Use Explicit Pattern

Is this an app or website?
├── No → Use Separation Pattern
└── Yes → Use Explicit Pattern

Is this a game or xr?
├── Yes → Use Separation Pattern
└── No → Use Explicit Pattern

Both patterns have the same power... pick the ergonomics that fit the job.

### 6. InSpatial Triggers (Props Registry)

InSpatial Triggers are grouped into `Props` and `Actions`.

- **Trigger Props**: declarative, platform-bridged event/directive attributes like `on:tap`, `style:*`, `class:*` resolved by the renderer via an extension-backed registry.
- **Action Triggers**: imperative state mutations via `createAction()` (covered in State section).

**NOTE**

- Trigger Props are disabled by default. Install the `InTrigger` extension to enable resolution of `on:*`, `style:*`, and `class:*`.
- Use `createTrigger()` to register new or override existing trigger props in the registry.
- Import surface for trigger props is provided by `@inspatial/kit/state`:
  ```ts
  import { InTrigger, createTrigger } from "@inspatial/kit/trigger";
  ```

#### Trigger (Actions)

Action triggers are part of State (see InSpatial State). Use `createAction()` for direct, tuple, or batch state updates.

#### Trigger (Props)

Trigger Props solves a who slew of problems:

- Triggers are decoupled and disabled by default. The trigger prop registry helps create and mix different platform trigger props e.g you can unify the click event from web/dom and android, ios etc... give it a simple name e.g `tap` then all of those platforms will respond to the tap.
- Use `InTrigger` (or custom extensions) to enable triggers props.
- Use `createTrigger` to register a new trigger prop e.g `on:dooropen`
- Triggers are view driven not actions i.e you call the trigger prop you want at the component level, this removes the need for historic footguns like effects.

While you can create your own custom trigger using `createTrigger()` InSpatial provides a standard list of Universal Trigger Props out of the box. They include:

##### A. LifeCycle Triggers

**on:frameChange**
Use `on:frameChange` to trigger an action every frame per second. This is especially useful for graphics application e.g XR and Games.

One requestAnimationFrame (RAF) for the whole app, not per node.

- Each subscriber gets a per-frame callback with:
- time: high-resolution timestamp
- delta: ms since last frame
- elapsed: ms since the loop started
- frame: monotonically increasing frame index
- Auto-cleans disconnected nodes and stops the loop when the registry is empty.

```ts
const ui = createState({ fps: 0 });

// Use Frame Change
<View on:frameChange={({ delta, frame }: { delta: number; frame: number }) => {
    if (frame % 10 === 0) {
      const d = delta || 16;
      const next = Math.max(1, Math.round(1000 / d));
      ui.fps.value = next;
    }
  }}
/>

// Display
   <FPS />
```

**on:beforeMount**
Use `on:beforeMount` to trigger actions you want before an app starts or renders.

```typescript
<View
  on:beforeMount={() => {
    // safe for state setup, timers, subscriptions
    // avoid reading DOM layout here; node may not be connected yet
  }}
/>
```

**on:mount**
Use `on:mount` to trigger actions you want when/after an app starts or renders.

```typescript
<View
  on:mount={() => {
    // node is now connected; do DOM reads/writes here if needed
  }}
/>
```

**on:route**
Use `on:route` to trigger an action on navigation.

```ts
<Link to="https://inspatial.app" on:route={() => alert("routing")}>
  App
</Link>
```

##### B. Input Triggers

**on:tap**
...

**on:longpress**
...

**on:change**
...

**on:focus**
...

**on:submit**
...

**on:hover**
**on:hoverstart**
**on:hoverend**
...

**on:rightclick**
...

##### C. Area Triggers

##### D. Gesture Triggers

##### E. Physics Triggers

##### F. Key Triggers

**on:escape**
Allows you to close a presentation when the `ESC` Key is pressed

##### G. Extension/Custom Triggers

Some extensions add their own trigger props, which become available when you install those extensions (just like `InTrigger`). These extension triggers are registered through the trigger system and only work if the corresponding extension is included. Examples of such extensions are:

###### `InRoute` Extension Trigger

**on:route**
...

###### `InPresentation` Extension Trigger

**on:presentation**
...

###### `InCloud` Extension Trigger

**on:cloudStatus**
..

**on:cloudReconnected**
..

#### Trigger Prop Extension

Enable trigger props by installing `InTrigger` in your renderer. This extension:

- Registers standard DOM events (click, input, keydown, etc.)
- Registers universal props (`tap`, `longpress`, `change`, `submit`, `focus`)
- Wires `style:*` and `class:*` for reactive styling

```typescript
import { createRenderer } from "@inspatial/kit/renderer";
import { InTrigger } from "@inspatial/kit/trigger";
import { InCloud } from "@inspatial/kit/cloud";
import { InTrigger } from "@inspatial/kit/presentation";

createRenderer({
  mode: "auto",
  extensions: [InTrigger, InCloud, InPresentation],
});
```

#### How Triggers Props Work Now

1. **JSX Compilation**: `<button on:click={handler} />` compiles to props object
2. **Renderer Processing**: Renderer calls `setProps(node, props)`
3. **Extension Routing**: `onDirective` callback routes `on:` prefixes to trigger system
4. **Trigger Handler**: `withTriggerProps.onTriggerProp` returns appropriate handler
5. **Event Binding**: Handler binds event to DOM/platform API

#### Creating New Trigger Props

Register custom trigger props via the registry. Handlers receive the `node` and the prop `value` (function or signal):

```typescript
import { createTrigger } from "@inspatial/kit/state";

// Example: basic hover state callback
createTrigger("hover", (node, cb?: (e: Event) => void) => {
  if (!cb) return;
  const enter = (e: Event) => cb({ ...(e as any), type: "hoverenter" });
  const leave = (e: Event) => cb({ ...(e as any), type: "hoverleave" });
  node.addEventListener("mouseenter", enter);
  node.addEventListener("mouseleave", leave);
});

// Example: swipe with pointer events
createTrigger(
  "swipe",
  (node, cb?: (e: { type: string; dx: number }) => void) => {
    if (!cb) return;
    let startX = 0;
    const down = (e: PointerEvent) => (startX = e.clientX);
    const up = (e: PointerEvent) =>
      cb({ type: "swipe", dx: e.clientX - startX });
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointerup", up);
  }
);
```

#### Trigger Prop Platform-Specific Considerations

Different platforms can have different trigger implementations:

- **DOM**: Uses `addEventListener`
- **XR**: Can use spatial input APIs
- **Native**: Can use platform-specific gesture recognizers
  etc...

The trigger bridge system handles these differences transparently. `InTrigger` auto-registers a universal bridge so `on:tap` maps to `click` on the web, and `longpress` is synthesized from pointer events.

## Extension

### Extending InSpatial Renderer/App

InSpatial Kit exposes a lightweight extension API. An extension is a plain object created with `createExtension({ meta, capabilities, lifecycle, ... })` and consumed by renderers via `extensions: [/* your extensions */]`.

- **Directive layer (renderer-agnostic)**: Provide `capabilities.rendererProps.onDirective(prefix, key, prop?)` to resolve namespaced props (e.g., `datax:title`, `svg:xlink:href`). Also provide `namespaces`, `tagNamespaceMap`, and `tagAliases` if needed.
- **Lifecycle**: Use `lifecycle.setup(renderer)` for one-time registration (e.g., registering trigger props). Validation hooks are optional (`validate`).
- **Events**: All event listeners must flow through the trigger prop system. Register new events with `createTrigger()` and ensure `InTrigger` is present.

### Demo: a tiny directive extension

Add a `datax:*` directive that maps to `data-*` attributes across platforms.

```ts
// extensions/datax.ts
import { createExtension } from "@inspatial/kit/extension";

export function InDataX() {
  return createExtension({
    meta: {
      key: "InDataX",
      name: "datax",
      description: "Adds datax:* → data-* attribute resolution",
      verified: true,
      type: "Universal",
      version: "0.1.0",
    },
    capabilities: {
      rendererProps: {
        onDirective(prefix, key) {
          if (prefix !== "datax") return undefined;
          const attr = `data-${key}`;
          return (node, value) => {
            if (value == null || value === false)
              (node as any).removeAttribute?.(attr);
            else (node as any).setAttribute?.(attr, String(value));
          };
        },
      },
    },
    scope: {}, // ...
    permissions: {}, // ...
    lifecycle: {
      setup() {}, //...
    },
  });
}
```

Usage:

```ts
import { createRenderer } from "@inspatial/kit/renderer";
import { InTrigger } from "@inspatial/kit/trigger/InTrigger"; // enables on:* props
import { InDataX } from "./extensions/datax";

createRenderer({
  mode: "auto",
  extensions: [InTrigger(), InDataX()],
}).then((InSpatial) => {
  InSpatial.render(document.getElementById("app"), () => (
    <button datax:variant="primary" on:tap={() => console.log("tap")}>
      OK
    </button>
  ));
});
```

Notes:

- The demo shows a directive resolver (no raw listeners). For custom events, register via the trigger bridge and keep `InTrigger()` installed so `on:*` props resolve.

### Extending InSpatial Cloud

```ts
import { CloudExtension } from "@inspatial/cloud";

export const userAgentExtension = new CloudExtension("userAgent", {
  label: "User Agent",
  description: "This extension provides user-agent parsing",
  config: {
    userAgentDebug: {
      type: "boolean",
      description: "Enable user agent printing to console",
      default: true,
    },
    userAgentEnabled: {
      type: "boolean",
      description: "Enable user agent parsing",
      default: true,
    },
  },
  requestLifecycle: {
    setup: [
      {
        name: "parseUserAgent",
        handler(inRequest, config) {
          if (!config.userAgentEnabled) return;

          const agent = parseUserAgent(inRequest.headers.get("user-agent"));
          inRequest.context.register("userAgent", agent);

          if (config.userAgentDebug) {
            const userAgent = inRequest.context.get("userAgent");
            console.log({ userAgent });
          }
        },
      },
    ],
  },
  install() {},
}) as CloudExtension;
```

### 7. InSpatial Motion

InSpatial Motion is built on InSpatial's `@in/motion`. \* \*\*Soon...

#### NOTE On Interactivity

NOTE: Signals are the most low-level reactive primitives you should only ever use `createSignal()` API from `@in/teract/signal` directly only when building frameworks. Otherwise application development MUST use `createState()` api from `@inspatial/kit/state` which builds upon signals.

## Routing & Navigation

### 8. InSpatial Route

InSpatial Route is a universal filesystem router built on InSPatial's `@in/route` module.

### Programmatic routing - `createRoute()` API

- Define routes with `createRoute({ routes })`.
- Map views with `.views({...})` or `.viewsByPath({...})`, and set `.default(fallback)`.
- Render with `<Dynamic is={route.selected} />`. Read `route.current`, navigate via `route.to(path)`, `route.redirect(path)`, `route.back()`; check `route.canGoBack`.
- Minimal example:

  ```ts
  export const route = createRoute({
    mode: "auto",
    defaultView: ErrorWindow,
    routes: [
      { name: "home", to: "/", view: HomeWindow },
      { name: "projects", to: "/projects", view: ProjectsWindow },
    ],
  });

  export function AppRoutes() {
    const Selected = route.selected;
    return () => <Dynamic is={Selected} />;
  }
  ```

  NOTE: Pass your `AppRoutes` as the entry point un your renderer

  ```ts
  createRenderer({...}).then((InSpatial: any) => {
      InSpatial.render(document.getElementById("app"), AppRoutes); // Import you Approutes
  });
  ```

### Navigation

#### A. With Link Component:

- Use `<Link to="/path">` for SPA navigation; it uses InSpatial's universal `InTrigger` props (`on:tap`) under the hood and appends `?ref=inspatial` for external http(s) links.
- Example:

  ```tsx
  <Link to="/projects">Projects</Link>
  ```

#### B. With Trigger Props

```ts
import { route } from "@inspatial/kit/route";

const route = createRoute()

//NOTE: route.to() handles both named and path/URL navigation so ("/home") or ("home") will both work
<MyComponent on:tap={() => route.to("/home")}>Home</MyComponent>
```

NOTE: `route.to()` is an alias of `route.navigate()` however .to is preffered since its reads fluently and aligns with `<Link to...>`

### File Based Routing - `InRoute()` Extension

\* \*\*Soon...

## Testing

### 9. InSpatial Test

InSpatial Test is built on InSpatial's `@in/test`. \* \*\*Soon...

## Server & Backend

### 10. InSpatial Cloud

InSpatial Cloud is built on `@inspatial/cloud` and exposes `@inspatial/cloud` APIs for comprehensive backend and data management across all platforms. `@inspatial/cloud-client` is what you should always use on the cient app. `@inSpatial/cloud` is only for server.

### Adding a New Cloud Collection/Table

```ts
import {
  ChildEntryType as ChildCollection,
  EntryType as Collection,
} from "@inspatial/cloud";

export const customerAccount = new Collection("customerAccount", {
  label: "Customer Account",
  idMode: "ulid",
  titleField: "customerName",
  fields: [
    {
      key: "customerName",
      type: "DataField",
      label: "Customer Name",
      required: true,
    },
    {
      key: "customerId",
      type: "DataField",
      label: "Customer ID",
      required: true,
    },
  ],
  children: [
    new ChildCollection("users", {
      description: "Users associated with this account",
      label: "Users",
      fields: [
        {
          key: "user",
          label: "User",
          type: "ConnectionField",
          entryType: "user",
        },
        {
          key: "isOwner",
          label: "Is Owner",
          type: "BooleanField",
        },
      ],
    }),
  ],
});
```

With InSpatial Cloud, everything is an exension. You can create in one of two apis `new CloudExtension` and `createInCloud` which is the highest level abstraction.

### Using - `new CloudExtension()`

```ts
import { CloudExtension } from "@inspatial/cloud";
import { product } from "./collection/product.ts";
import { customerAccount } from "./collection/customer-account.ts";

const crmExtension = new CloudExtension("crm", {
  label: "CRM",
  description: "Customer Relationship Management",
  version: "1.0.0",
  entryTypes: [customerAccount, product],
  roles: [
    {
      roleName: "customer",
      description: "A customer",
      label: "Customer",
    },
    {
      roleName: "manager",
      description: "A manager",
      label: "Manager",
    },
  ],
});

export default crmExtension;
```

### Using - `createInCloud()`

```ts
import { createInCloud } from "@inspatial/cloud";
import { product } from "./collection/product.ts";
import { customerAccount } from "./collection/customer-account.ts";

createInCloud({
  name: "CRM",
  description: "Customer Relationship Management",
  version: "1.0.0",
  entryTypes: [customerAccount, product],
  roles: [
    {
      roleName: "customer",
      description: "A customer",
      label: "Customer",
    },
    {
      roleName: "manager",
      description: "A manager",
      label: "Manager",
    },
  ],
});
```

---

## InSpatial Documentation Reference

**Core Signal APIs:**

- `createSignal(value)`, `computed(fn)`, `$(fn)` - Creating signals
- `watch(effect)`, `createEffect(effect, ...args)` - Effects with lifecycle
- `read(value)`, `write(signal, value)`, `peek(value)`, `poke(signal, value)` - Utilities
- Signal methods: `.and()`, `.or()`, `.eq()`, `.gt()`, `.inverse()`, `.nullishThen()`, `.hasValue()`
- Advanced: `merge()`, `derive()`, `extract()`, `tpl\`...\``, `not()`, `onCondition()`

Note: hasValue returns plain boolean. Returns true when the value of the signal is not nullish.

**Component (Kit) APIs:**

- `createComponent()`, `web.render(container, component, props, ...children)`, `dispose()` - Component lifecycle
- `expose()`, `capture()`, `snapshot()`, `getCurrentSelf()` - Context management
- `onDispose()` - Cleanup registration

**Built-in Components:**

- `<Show when={} true={} else={}>` - Conditional rendering
- `<List each={} track="" indexed={}>` - List rendering with reconciliation (Direct item access, auto-handles arrays/signals)
- `<Async future={} fallback={} catch={}>` - Promise handling
- `<Dynamic is={}>` - Dynamic component/tag rendering
- `<Fn ctx={} catch={}>` - Function execution with error boundaries

**Renderer Setup:**

- `DOMRenderer(InTrigger)` from `@in/dom`
- `InTrigger` from `@inspatial/kit/trigger` to ship the default/core web props i.e `class:` and `style:`
- Trigger system & Event handling: `on:event`, `on-once:event`, `on-passive:event`, `on-capture:event`

**JSX Configuration**

## Globally defined JSX Runtime for Deno

JSX runtime is essential when using InSpatial together with runtimes like [Deno](https://github.com/denoland/deno/issues/29584), compilers like [SWC](https://github.com/swc-project/swc/issues/10553) or generators like [MDX](https://mdxjs.com/), since they lack the ability to correctly transform JSX via parameters.

### 10. Building for Dev & Production

You can build your app for dev and production using different tools like (InSpatial `Serve` extension, Vite, Rollup with Babel, Rspack or Webpack). InSpatial provides different plugins and extensions for different tools.

- InServe (Default)
- InVite
- InPack

#### InServe (Founders Choice)

When using `InServe()` extension there's no need to use or configure a build tool like Vite or RSPack. To use `InServe()`, create your render.ts file and add it as an extension.

```typescript
// render.ts
import { createRenderer } from "@inspatial/kit/renderer";
import { InServe } from "@in/serve";

createRenderer({
  extensions: [InServe()],
});
```

Then add your deno.json

```json
//deno.json
{
  "tasks": {
    "serve": "deno run --allow-net --allow-read --allow-write --allow-env --allow-run src/config/render.ts"
  }
}
```

#### InVite

Use `InVite` plugin for Vite. Create a `vite.config.ts` file and add the following conifguration

##### Pragma Config (Default)

```typescript
import { defineConfig } from "vite";
import { InVite } from "@in/vite";

export default defineConfig({
  server: {
    port: 6310,
  },
  esbuild: {
    jsxFactory: "R.c",
    jsxFragment: "R.f",
  },
  plugins: [InVite()],
  build: {
    target: "esnext",
  },
});
```

##### Automatic Config

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@inspatial/kit", // This tells Vite/esbuild where to find the runtime
  },
});
```

#### Babel (`.babelrc.json`)

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "@inspatial/kit"
      }
    ]
  ]
}
```

#### InPack

Use the `InPack` plugin for Webpack and/or RSPack/RSBuild

```javascript
import { defineConfig } from "@rsbuild/core";
import InPack from "@in/pack";

export default defineConfig({
  plugins: [InPack()],
  // ... jsx config
});
```

### Initialization

Once your build tool is configured, you need to initialize the runtime with a renderer in your application's entry point. There are two ways you can configure the renderer.

#### Automatic Render (Preferred)

```typescript
import "./kit.css";
import { createRenderer } from "@inspatial/kit/renderer";
import { App } from "../my/app/root.tsx";

// Create InSpatial renderer with Trigger Props
createRenderer({
  mode: "auto",
  debug: "verbose",
  extensions: [InTrigger],
}).then((InSpatial: any) => {
  InSpatial.render(document.getElementById("app"), App);
});
```

Now, any `.jsx` or `.tsx` file will be automatically transformed to use the initialized runtime, so you don't need any special imports to write JSX.

**Hot Reload:**

---

## ⚠️ CRITICAL: THIS IS NOT REACT!

**DO NOT write React code in this project.** InSpatial has fundamentally different patterns:

### Key Differences from React:

| React                                                       | InSpatial                                                        |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `useState(0)`                                               | `createState({count: 0 })`                                       |
| `createEffect(() => {}, [deps])`                            | `watch(() => {})` or `createEffect(() => {})`                    |
| `{count}`                                                   | `{count}` (same for signals)                                     |
| `{`Count: ${count}`}`                                       | `{$(() => \`Count: ${count.value}\`)}`or`{t\`Count: ${count}\`}` |
| `className={isActive ? 'active' : ''}`                      | `class:active={isActive}`                                        |
| `onClick={() => {}}`                                        | `on:click={() => {}}`                                            |
| Components are functions                                    | Components return functions `(props) => JSX`                     |
| Virtual DOM re-renders                                      | Retained mode, direct DOM updates                                |
| Conditional: `{condition && <div/>}`                        | `<Show when={signal}>{() => <div/>}</Show>`                      |
| Reactive Lists: `{items.map(item => <div key={item.id}/>)}` | `<List each={items} track="id">{(item) => <div/>}</List>`        |

---

## How to use InSpatial (Kit X State)

### 1. Basic Component with State

```javascript
// ❌ React way - DON'T DO THIS
const Counter = () => {
  const [count, setCount] = useState(0);
  return <div onClick={() => setCount(count + 1)}>Count: {count}</div>;
};

// ✅ The InSpatial way - DO THIS (State)
import { createState } from "@inspatial/kit/state";

const Counter = () => {
  const counter = createState({ count: 0 });
  return () => (
    <XStack on:tap={() => counter.count.set(counter.count.peek() + 1)}>
      Count: {counter.count}
    </XStack>
  );
};
```

### 2. Conditional Rendering

```javascript
// ❌ React way - DON'T DO THIS
const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div>
      {isVisible && <div>Visible content</div>}
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
    </div>
  );
};

// ✅ The InSpatial way - DO THIS (State)
import { createState } from "@inspatial/kit/state";

const App = () => {
  const ui = createState({ isVisible: true });
  return (
    <XStack>
      <Show when={ui.isVisible}>{() => <div>Visible content</div>}</Show>
      <Button on:click={() => ui.isVisible.set(!ui.isVisible.peek())}>
        Toggle
      </Button>
    </XStack>
  );
};
```

### 3. List Rendering

```javascript
// ❌ React way - DON'T DO THIS
const TodoList = () => {
  const [todos, setTodos] = useState([{ id: 1, text: "Learn React" }]);
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
};

// ✅ The InSpatial way - DO THIS (State)
import { createState } from "@inspatial/kit/state";

const TodoList = () => {
  const state = createState({ todos: [{ id: 1, text: "Learn InSpatial" }] });
  return (
    <YStack>
      <List each={state.todos} track="id">
        {(todo) => <Text>{todo.text}</Text>}
      </List>
    </YStack>
  );
};
```

### 4. Effects and Cleanup

```javascript
// ❌ React way - DON'T DO THIS
useEffect(() => {
  const handler = () => console.log("resize");
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);

// ✅ The InSpatial way - DO THIS
createEffect(() => {
  createTrigger("swipe", createResizeHandler(), {
    platforms: ["dom", "native:ios", "native:android"],
    fallback: "resize",
  });
});
```

#### You Might Not Need Effect

Most “do something when the view appears/changes” use‑cases don’t need `createEffect`. Prefer lifecycle trigger props and reactive control‑flow.

- **Probability**: You're most likely to gravitate towards lifecycle trigger props (on:beforeMount/on:mount) alongside a Control Flow component i.e <Show> or <Choose> ~85% of your use cases, and most likely less than ~15% `createEffect` (subscriptions, timers, explicit side‑effects).

- What to reach for first

  - Use `on:beforeMount` or `on:mount` on a host element to run lifecycle work.
  - Use `$(() => ...)` + `Show` to reactively render based on signals/computed state.
  - Keep all listeners inside the InSpatial trigger system.

- When to use which lifecycle

  - `on:beforeMount`: synchronous during setup. Great when the initial render should already reflect a state flip.
  - `on:mount`: next tick after first paint. Use when you want post‑paint work.
  - Nuance: whether the first paint includes a `beforeMount` change depends on renderer timing; it runs during directive setup (synchronously), not deferred.

- When you actually want `createEffect`

  - Subscriptions to signals (e.g., logging, analytics, cross‑state reactions)
  - Timers/intervals tied to state, with cleanup via `onDispose`
  - Deriving non‑UI side effects from signals

- Anti‑pattern to avoid

  - Using `createEffect` as a surrogate for lifecycle: it runs immediately on setup and on subsequent signal changes, but it isn’t lifecycle‑bound and may run before mount. Prefer trigger props for mount timing.

- Recipes
  - Show content after lifecycle without effects

```tsx
import { createState, $ } from "@inspatial/kit/state";
import { Stack } from "@inspatial/kit/structure";
import { Show } from "@inspatial/kit/control-flow";

const ui = createState({ render: false });

<View on:beforeMount={() => ui.render.set(true)}>
  <Show when={$(() => ui.render.get())}>
    {() => <Text>This is most likely what you should be doing</Text>}
  </Show>
</View>;
```

- Reactive branching without effects

```tsx
import { Show } from "@inspatial/kit/control-flow";
import { $ } from "@inspatial/kit/state";
import { useTheme } from "@inspatial/kit/theme";

<Show
  when={$(() => useTheme.mode.get() === "dark")}
  otherwise={() => <LightUI />}
>
  {() => <DarkUI />}
</Show>;
```

- Side‑effect from data (this is where `createEffect` shines)

```tsx
import { createEffect } from "@inspatial/kit/state";

createEffect(() => {
  const mode = useTheme.mode.get();
  console.log("theme:", mode);
  // Return optional cleanup with onDispose inside, if needed
});
```

Bottom line: lifecycle → trigger props; reactivity → `$`/`Show`; subscriptions/side‑effects → `createEffect`.

### 5. Conditional Classes

```javascript
// ❌ React way - DON'T DO THIS
<button className={isActive ? 'btn active' : 'btn'}/>

 // ✅ The InSpatial way - DO THIS
<Button className="btn" class:active={isActive}>
```

#### Conditionally Rendering Computed/Reactive Values

##### `Show`

```typescript
// ❌  DON'T DO THIS: It wont react
<Button on:tap={() => useTheme.action.setToggle()}>
  {$(() =>
    String(useTheme.mode) === "dark" ? <LightModeIcon /> : <DarkModeIcon />
  )}
</Button>

// ✅ DO THIS
<Button
    on:tap={() => useTheme.action.setToggle()}
  >
    <Show
      when={$(() => String(useTheme.mode) === "dark")}
      otherwise={<DarkModeIcon />}
    >
      <LightModeIcon />
    </Show>
  </Button>
```

##### `Choose` - The InSpatial Switch Statement

```typescript
// ❌  DON'T DO THIS: It wont react
export function InputField() {
  return (
    <>
      {(() => {
        switch (variant) {
          case "emailfield":
            return <EmailField />;
          case "searchfield":
            return <SearchField />;
          default:
            return <TextField />;
        }
      })()}
    </>
  );
}

// ✅ DO THIS
import { Choose } from "@inspatial/kit/control-flow"
export function InputField({ variant }) {
  return (
    <>
    Choose({
    cases: [
      { when: $(() => variant.value === "emailfield"), children: EmailField },
      { when: $(() => variant.value === "searchfield"), children: SearchField },
    ],
    otherwise: TextField,
  });
   </>
  )
}
```

#### Difference Between Show & Choose

- Show and Choose are both use to react to conditional values
- Use `<Show>` where you want to display a binary value e.g [this or that]
- Use `Choose` where multi-branch logic is desired, [this, this, this and more of those]

### 6. Complex Reactive Expressions

```javascript
// ❌ React way - DON'T DO THIS
const message = `Count is: ${count}`;

// ✅ The InSpatial way - DO THIS (State)
import { createState, $ } from "@inspatial/kit/state";

const s = createState({ count: 0 });
const message = $(() => `Count is: ${s.count.get()}`);
// or inline:
<XStack>{$(() => `Count is: ${s.count.get()}`)}</XStack>;
```

### 7. Async Components

```javascript
// ✅ The InSpatial async component pattern
const PostCard = async ({ id }: PostID) => {
  const response = await fetch(`/api/story/${postId}`);
  const story = await response.json();

  return (
    <YStack className="story">
      <Text>{story.title}</Text>
      <Text>By {story.author}</Text>
    </YStack>
  );
};

// Usage with error handling
<PostCard
  id={123}
  fallback={() => <XStack>Loading...</XStack>}
  catch={({ error }) => <XStack>Error: {error.message}</XStack>}
/>;
```

### 8. State Signal Operations (Advanced)

```typescript
import { createState, $ } from "@inspatial/kit/state";

// State-backed signal comparisons and derived values
const s = createState({ count: 5, status: "loading" });
const isPositive = s.count.gt(0); // count > 0
const isZero = s.count.eq(0); // count === 0
const isEven = $(() => s.count.get() % 2 === 0);

// Derived values remain the same using $()
const label = $(() => `Status: ${s.status.get()}`);
```

### 9. Event Handling with Modifiers

```javascript
// Different event modifiers
<Button on:tap={() => console.log('normal')}>Click</Button>
<Button on-once:click={() => console.log('only once')}>Click Once</Button>
<ScrollView on-passive:scroll={() => console.log('passive scroll')}>Scrollable</ScrollView>
<Link to="#" on-prevent:click={() => console.log('prevented')}>Link</Link>
```

### 10. View Literals for URLs

```javascript
// View literals with reactive interpolation (State)
import { createState } from "@inspatial/kit/state";

const s = createState({ templateId: 123 });
const templateUrl = t`https://inspatial.store/template?id=${s.templateId}`;
```

## Common InSpatial Patterns

1. **Component Structure**: `const MyComponent = (props) => <JSX/>`
2. **State**: `const state = createState({ initialState })`
3. **Computed Values**: `const computed = $(() => state.value * 2)`
4. **Effects**: `watch(() => { /* reactive code */ })`
5. **Cleanup**: `createEffect(() => { /* setup */; return () => { /* cleanup */ } })`
6. **Conditional Classes**: `class:active={isActive}`
7. **Lists**: `<List each={entries}>{(entry) => <Entry data={entry}/>}</List>`
8. **Conditions**: `<Show when={isVisible}>{() => <>Visible content</>}</Show>`
9. **Async**: Components can be `async` functions with `fallback` and `catch` props
10. **Signal Operations**: Use `.eq()`, `.gt()`, `.and()`, etc. for comparisons
11. **Render**: `InSpatial.render(container, component, props, ...children)`
12. **Env**: Short for Environment `@inspatial/kit/env` built on `@in/vader/env` should be use to condition platform, runtime and render targets as well as environment variables.

### Naming Pattern

```
@(window)/
├── State Variables (useX)
│   ├── useCounter
│   ├── useTheme
│   └── useAuth
│
├── State Types (XProps)
│   ├── CounterProps
│   ├── ThemeProps
│   └── AuthProps
│
├── Action Triggers (handleX)
│   ├── handleCounter
│   └── handleAuth
│
│
└── Action Declarations (setX)
    ├── setIncrement
    ├── setToggle
    └── setReset
```

**Benefits**

- **Zero cognitive load** - developers know exactly what to expect
- **Searchable** - easy to find all states (search `use`), triggers (search `handle`), actions (search `set`)
- **Consistent** - same pattern across entire codebase
- **Maintainable** - refactoring becomes predictable

## Footguns, Anti-Patterns & Conflicts

### Anti-Patterns

These are practices that work, but they bend or break the expected mental model of the framework. They don’t necessarily cause harm, and in some cases they can serve as “escape hatches.” The problem is that they disrupt the natural flow and conventions of the system, making things harder to reason about in the long run. In other words, they’re like habits that can easily turn into vices. Having a beer once in a while is fine, but turning it into a daily routine quickly becomes a problem.

### Footguns

These are not just bad habits they’re dangerous. A footgun is something that will blow your leg off if you try to use it. They are inherently unsafe, unpredictable, and should never be considered, even as escape hatches. In other words: don’t do it, EVER!.

### Conflicts

Conflicts happen when two otherwise valid approaches or features clash with one another inside the framework. They may both be correct in isolation, but together they break assumptions, introduce ambiguity, or cause unexpected behavior. Understanding and resolving these conflicts is part of learning the “grammar” of the system.

Because InSpatial is a Universal Development Environment (UDE), many patterns that developers are used to in traditional frameworks naturally turn into conflicts here.

Most of these conflicts stem from three core concepts historically baked into frameworks:

- Styling
- Triggers
- Motion

InSpatial intentionally detaches these systems from the renderer. Why? Because Universal Apps are omni-platform by design. We can’t (and shouldn’t) assume which environment a user is in—web, mobile, XR, or beyond.

By decoupling styling, triggers, and motion from the rendering layer, InSpatial avoids environment-specific assumptions and eliminates the hidden clashes that arise when a single platform’s conventions are forced into a universal context.

**The result:** a conflict-free system that enables truly universal applications.
