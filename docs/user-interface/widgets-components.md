# Widgets & Components

So far you have been composing components using renderer primitives. This section intoduces you to Widgets & Components. Unlike Renderer primimitives you compose components using <Tags>.

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
