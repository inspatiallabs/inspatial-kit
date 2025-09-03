
**Important** InSpatial Kit is its own independent self-contained framework powered by its own dev modules, concept, opinions and renderers and as such IT IS IS DIFFERENT FROM REACT, SOLIDJS, PREACT or any other framework.

InSpatial Kit is based on InSpatial's own signal reactive primitives `@in/teract`. InSpatial sematically shares sytax with the likes of React, SolidJS and Preact.

All core utilities, actions and APIs are encapsulated into simpler functions and file routes essentially removing the need for any form of project initialization or configurations. InSpatial Kit removes the need to install or use any of InSpatial's stand-alone dev and cloud modules as they come bundled with it by default.

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

## InSpatial Documentation Reference


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

### 5. Conditional Classes

```javascript
// ❌ React way - DON'T DO THIS
<button className={isActive ? 'btn active' : 'btn'}/>

 // ✅ The InSpatial way - DO THIS
<Button className="btn" class:active={isActive}>
```

### 6. Complex Reactive Expressions

```javascript
// ❌ React way - DON'T DO THIS
const message = `Count is: ${count}`;

// ✅ The InSpatial Way - DO THIS (State)
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
