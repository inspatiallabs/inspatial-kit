# Interactivity

## Signal (@inspatial/kit/signal) - (@in/teract/signal)

InSpatial Kit is fundamentally reactive signal based system. The core signal primitives InSpatial State is that `@in/teract` is an signal based interactivity and state management system. It is subdivided into two types of reactive systems. There is Signal Core and Signal Lite each inspired by SolidJS and Preact respectively.

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
createSideEffect(() => {
  createTrigger("swipe", createResizeHandler(), {
    platforms: ["dom", "native:ios", "native:android"],
    fallback: "resize",
  });
});
```

#### You Might Not Need Side Effects

Most “do something when the view appears/changes” use‑cases don’t need `createSideEffect`. Prefer lifecycle trigger props and reactive control‑flow.

- **Probability**: You're most likely to gravitate towards lifecycle trigger props (on:beforeMount/on:mount) alongside a Control Flow component i.e <Show> or <Choose> ~85% of your use cases, and most likely less than ~15% `createSideEffect` (subscriptions, timers, explicit side‑effects).

- What to reach for first

  - Use `on:beforeMount` or `on:mount` on a host element to run lifecycle work.
  - Use `$(() => ...)` + `Show` to reactively render based on signals/computed state.
  - Keep all listeners inside the InSpatial trigger system.

- When to use which lifecycle

  - `on:beforeMount`: synchronous during setup. Great when the initial render should already reflect a state flip.
  - `on:mount`: next tick after first paint. Use when you want post‑paint work.
  - Nuance: whether the first paint includes a `beforeMount` change depends on renderer timing; it runs during directive setup (synchronously), not deferred.

- When you actually want `createSideEffect`

  - Subscriptions to signals (e.g., logging, analytics, cross‑state reactions)
  - Timers/intervals tied to state, with cleanup via `onDispose`
  - Deriving non‑UI side effects from signals

- Anti‑pattern to avoid

  - Using `createSideEffect` as a surrogate for lifecycle: it runs immediately on setup and on subsequent signal changes, but it isn’t lifecycle‑bound and may run before mount. Prefer trigger props for mount timing.

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

- Side‑effect from data (this is where `createSideEffect` shines)

```jsx
import { createSideEffect } from "@inspatial/kit/state";

createSideEffect(() => {
  const mode = useTheme.mode.get();
  console.log("theme:", mode);
  // Return optional cleanup with onDispose inside, if needed
});
```

Bottom line: lifecycle → trigger props; reactivity → `$`/`Show`; subscriptions/side‑effects → `createSideEffect`.

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

## Signal vs State

States are abstractions of signals. Here's how they differ:

| Feature              | Signal-Lite                                                  | Signal/State Core                   |
| -------------------- | ------------------------------------------------------------ | ----------------------------------- |
| **Size**             | Minimal (small bundle)                                       | Full-featured (larger)              |
| **API**              | Simpler, focused                                             | Comprehensive                       |
| **Performance**      | Good for basic needs                                         | Optimized for complex scenarios     |
| **Callbacks**        | createSideEffectLite & onDisposeLite \* onConditionLite triggers | Full integrated trigger system      |
| **State Management** | Local                                                        | Local X Global X Server (Universal) |
| **Developer Tools**  | Minimal                                                      | Advanced debugging tools            |
| **StateQL**          | Not supported                                                | Full support                        |
| **Batched Updates**  | Automatic and Asynced                                        | Automatic and Asynced               |

**When to choose Signal**: For simple state management needs or projects when you need minimal bundle size, automatic dependency tracking and efficient updates. It is the recommeded starting point for interactivity compared to its siblings.

**When to choose State**: For most InSpatial applications, production apps, or when you need advanced features like triggers, optimized updates, or deep integration.
