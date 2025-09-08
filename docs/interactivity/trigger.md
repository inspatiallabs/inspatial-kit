# Trigger

## (@inspatial/kit/trigger) - (@in/teract/trigger)

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

###### Lifecycle Trigger Modifiers

`on-once:`,
`on-passive:`,
`on-capture:`,
`on-prevent:`,
`on-stop:`

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

**on:gamepad**
This lets you react to a connected gamepad’s state as it changes (polled ~every 100ms). It emits only when the state differs from the previous snapshot.

> **Note:** Currently reads the first connected gamepad (`navigator.getGamepads()[0]`). If the Gamepad API is unavailable, this trigger is a no-op.

```jsx
// Read button/axis state
<View
  on:gamepad={(gp: {
    connected: boolean;
    buttonA: boolean; buttonB: boolean; buttonX: boolean; buttonY: boolean;
    joystick: [number, number]; // left stick: [x,y]
    joystickRight: [number, number]; // right stick: [x,y]
    RB: boolean; LB: boolean; RT: boolean; LT: boolean;
    start: boolean; select: boolean;
    up: boolean; down: boolean; left: boolean; right: boolean;
  }) => {
    if (!gp.connected) return;
    if (gp.buttonA) action.jump();
    const [lx, ly] = gp.joystick;
    const dead = 0.15;
    const dx = Math.abs(lx) < dead ? 0 : lx;
    const dy = Math.abs(ly) < dead ? 0 : ly;
    move(dx, dy);
  }}
/>
```

> **Performance:** The poll runs once for all subscribers and only invokes handlers on change. When there are no listeners, polling stops automatically.

**on:gamepadconnect**
Fires when the browser reports a gamepad was connected.

```tsx
<View
  on:gamepadconnect={(e: { type: "gamepadconnect"; index?: number; id?: string }) => {
    console.log("Gamepad connected", e.index, e.id);
  }}
/>
```

**on:gamepaddisconnect**
Fires when a gamepad disconnects.

```tsx
<View
  on:gamepaddisconnect={(e: { type: "gamepaddisconnect"; index?: number; id?: string }) => {
    console.log("Gamepad disconnected", e.index, e.id);
  }}
/>
```

> **Terminology:** The “Gamepad API” is a standard browser API that exposes connected controllers’ buttons and axes. Support varies by platform; on unsupported platforms these triggers do nothing.

##### C. Area Triggers

##### D. Gesture Triggers

##### E. Physics Triggers

##### F. Key Triggers

**on:key**
This is the unified keyboard trigger. It emits for both key down and key up with a simple `phase` you can check.

> **Note:** Payload shape is `{ type: 'keytap', phase: 'down' | 'up', key, code, repeat, event }`.

```jsx
<View
  on:key={(e) => {
    if (e.key === 'Enter' && e.phase === 'down') submit();
    if (e.key === 'Escape' && e.phase === 'down') close();
  }}
/>
```

**on:key:down** / **on:key:up**
Phase-specific sugars for the same event. They carry the same payload.

```jsx
<View
  on:key:down={(e) => {
    if (e.key === 'ArrowLeft') nudgeLeft();
  }}
  on:key:up={(e) => {
    if (e.key === ' ') stopJump();
  }}
/>
```

###### Key Trigger Helpers
InSpatial Kit also provides direct key triggers, allowing you to handle keyboard events more easily and with less code.

**on:escape**
Convenience sugar for a very common case. Internally built on the same keyboard triggers as `on:key` and fires on key down of the Escape key.

```jsx
<View on:escape={() => close()} />

// Equivalent with key
<View on:key={(e) => e.key === 'Escape' && e.phase === 'down' && close()} />
```

NOTE: Direct key triggers (like on:enter or on:space) will be available soon, making it as easy as using on:escape for every sing Key available. 

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
