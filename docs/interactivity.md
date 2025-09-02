# Interactivity

## Signal (@inspatial/kit/signal) - (@in/teract/signal)

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

=============================================
Understanding computed() and/or $()
=============================================
NOTE: $() is an alias for computed() 
🔍 What Computed/$ Actually Does

- Reads existing state values
- Transforms them into new values
- Memoizes the result (only recalculates when dependencies change)
- Updates automatically when dependencies change
It's basically a smart getter that:
- Only runs when its inputs change
- Caches the result between changes
- Automatically tracks what state it depends on


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

## State (@inspatial/kit/state) - (@in/teract/state)

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

## How To Interact With Sate

### 1. Basic Component with State

```javascript
// ✅ The InSpatial Way
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
// ✅ The InSpatial Way
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
// ✅ The InSpatial Way
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
// ✅ The InSpatial Way
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

```jsx
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

```jsx
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

```jsx
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
 // ✅ The InSpatial Way
<Button className="btn" class:active={isActive}>
```

#### Conditionally Rendering Computed/Reactive Values

##### `Show`

```jsx
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

```javascript
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

  <Choose
  cases={[
  {
    { when: $(() => variant.value === "emailfield"), children: EmailField },
    { when: $(() => variant.value === "searchfield"), children: SearchField },
  },
  ]}
  otherwise: TextField,
/>

    // or (without tags)

Choose({
cases: [
    { when: $(() => variant.value === "emailfield"), children: EmailField },
    { when: $(() => variant.value === "searchfield"), children: SearchField },
],
otherwise: TextField,
});

  )
}
```

#### Difference Between Show & Choose

- Show and Choose are both use to react to conditional values
- Use `<Show>` where you want to display a binary value e.g [this or that]
- Use `<Choose>` or `Choose` where multi-branch logic is desired, [this, this, this and more of those]

### 6. Complex Reactive Expressions

```javascript
// ❌ DON'T DO THIS
const message = `Count is: ${count}`;

// ✅ The InSpatial Way
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
<View on-passive:scroll={() => console.log('passive scroll')}>Scrollable</View>
<Link to="#" on-prevent:click={() => console.log('prevented')}>Link</Link>
```

### 10. View Literals for URLs

```javascript
// View literals with reactive interpolation (State)
import { createState } from "@inspatial/kit/state";

const s = createState({ templateId: 123 });
const templateUrl = t`https://inspatial.store/template?id=${s.templateId}`;
```

## Trigger (@inspatial/kit/trigger) - (@in/teract/trigger)

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

#### NOTE On Interactivity

NOTE: Signals are the most low-level reactive primitives you should only ever use `createSignal()` API from `@in/teract/signal` directly only when building frameworks. Otherwise application development MUST use `createState()` api from `@inspatial/kit/state` which builds upon signals.
