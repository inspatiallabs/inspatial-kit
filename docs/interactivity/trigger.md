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

Extensions can add their own trigger props through the `capabilities.triggers` API. These triggers become available when you include the extension in your renderer configuration. Each extension trigger is fully typed and documented.

###### `InRoute` Extension Trigger

**on:route**
Fires when navigation occurs in your application. This trigger is provided by the InRoute extension.

```tsx
<View 
  on:route={(e: { 
    path: string; 
    params?: Record<string, string>; 
    query?: Record<string, string>; 
    name?: string 
  }) => {
    console.log("Navigated to:", e.path);
  }}
/>
```

> **Note:** The route trigger uses a global document listener to capture all navigation events in your app.

###### `InPresentation` Extension Trigger

**on:presentation**
Controls modals, drawers, and other presentation components. Provided by the InPresentation extension.

```tsx
<Button 
  on:presentation={{ 
    id: "my-modal", 
    action: "toggle" 
  }}
>
  Open Modal
</Button>
```

###### `InCloud` Extension Triggers

The InCloud extension provides three triggers for cloud connectivity:

**on:cloudStatus**
Monitors the real-time connection status with the cloud backend.

```tsx
<View 
  on:cloudStatus={(e: { 
    type: "cloudStatus"; 
    status: "connecting" | "open" | "closed" | "error" | "reconnected" 
  }) => {
    updateConnectionIndicator(e.status);
  }}
/>
```

**on:cloudReconnected**
Fires specifically when the cloud connection is re-established after a disconnect.

```tsx
<View 
  on:cloudReconnected={() => {
    // Refresh data after reconnection
    fetchLatestData();
  }}
/>
```

**on:cloudNotify**
Receives notifications from the cloud backend.

```tsx
<View 
  on:cloudNotify={(e: { 
    type: string; 
    title?: string; 
    message: string 
  }) => {
    showToast(e.message);
  }}
/>
```

> **Terminology:** Extension triggers use the `capabilities.triggers` API which provides automatic type safety, build-time discovery, and proper registration through the extension system.

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

You can create custom trigger props using `createTrigger()`. This function registers a new trigger handler that can be used with `on:` props throughout your application.

```typescript
import { createTrigger } from "@inspatial/kit/trigger";

// Example: basic hover state callback
createTrigger("hover", (node, cb?: (e: Event) => void) => {
  if (!cb) return;
  const enter = (e: Event) => cb({ type: "hoverenter" });
  const leave = (e: Event) => cb({ type: "hoverleave" });
  node.addEventListener("mouseenter", enter);
  node.addEventListener("mouseleave", leave);
});

// Example: swipe with pointer events
createTrigger("swipe", (node, cb?: (e: { type: string; dx: number }) => void) => {
  if (!cb) return;
  let startX = 0;
  const down = (e: PointerEvent) => (startX = e.clientX);
  const up = (e: PointerEvent) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) { // Minimum swipe distance
      cb({ type: "swipe", direction: dx > 0 ? "right" : "left", distance: Math.abs(dx) });
    }
  };
  node.addEventListener("pointerdown", down);
  node.addEventListener("pointerup", up);
  
  // Return cleanup function (optional)
  return () => {
    node.removeEventListener("pointerdown", down);
    node.removeEventListener("pointerup", up);
  };
});
```

Once registered, you can use your custom triggers anywhere in your app:

```tsx
<View 
  on:hover={(e) => console.log("Hover state:", e.type)}
  on:swipe={(e) => console.log("Swiped:", e.direction)}
>
  Interactive content
</View>
```

> **Note:** Trigger handlers receive the DOM `node` and the prop `value` (function or signal). They can optionally return a cleanup function that will be called when the trigger is removed.

#### Creating New Trigger Props as an Extension or Module Developer

When building extensions or modules, there are two approaches for organizing and distributing your triggers:

##### Method 1: Using `createTrigger()` in Lifecycle Setup

Use this approach when you want full control over trigger registration or need to register triggers as part of a larger initialization process. You manually call `createTrigger()` for each trigger during the extension's setup phase.

```typescript
import { createTrigger } from "@inspatial/kit/trigger";
import { createExtension } from "@inspatial/kit/extension";

export function MyExtension() {
  return createExtension({
    meta: { 
      key: "MyExtension",
      name: "My Custom Extension",
      description: "Adds custom interaction triggers"
    },
    lifecycle: {
      setup() {
        // Register triggers during extension initialization
        createTrigger("longHover", (node, cb?: (e: Event) => void) => {
          if (!cb) return;
          let timeoutId: number;
          const enter = (e: Event) => {
            timeoutId = setTimeout(() => cb({ type: "longHover", event: e }), 1000);
          };
          const leave = () => clearTimeout(timeoutId);
          node.addEventListener("mouseenter", enter);
          node.addEventListener("mouseleave", leave);
          
          return () => {
            node.removeEventListener("mouseenter", enter);
            node.removeEventListener("mouseleave", leave);
            clearTimeout(timeoutId);
          };
        });
      }
    }
  });
}
```

> **When to use:** When you need full control over registration timing or want to register triggers alongside other initialization logic.

##### Method 2: Using `capabilities.triggers`

Use this approach when you want to avoid manually writing `createTrigger()` calls. The extension system automatically registers your triggers based on the `capabilities.triggers` declaration.

**Optional:** Create a `types.d.ts` file if you want TypeScript completion for your triggers in the Runtime Template i.e JSX `on:` props.

```typescript
import { createExtension } from "@inspatial/kit/extension";

export function SwipeExtension() {
  return createExtension({
    meta: {
      key: "SwipeExtension",
      name: "Swipe Gestures",
      description: "Adds swipe gesture support"
    },
    capabilities: {
      triggers: {
        swipe: {
          handler: (node, cb) => {
            if (!cb) return;
            let startX = 0;
            const down = (e: PointerEvent) => (startX = e.clientX);
            const up = (e: PointerEvent) => {
              const dx = e.clientX - startX;
              if (Math.abs(dx) > 50) {
                cb({ 
                  type: "swipe", 
                  direction: dx > 0 ? "right" : "left", 
                  distance: Math.abs(dx) 
                });
              }
            };
            node.addEventListener("pointerdown", down);
            node.addEventListener("pointerup", up);
            
            return () => {
              node.removeEventListener("pointerdown", down);
              node.removeEventListener("pointerup", up);
            };
          },
          type: {} as { type: "swipe"; direction: "left" | "right"; distance: number },
          description: "Detects horizontal swipe gestures"
        },
        pinch: {
          handler: (node, cb) => {
            // Pinch gesture implementation
            if (!cb) return;
            // ... implementation details
          },
          type: {} as { type: "pinch"; scale: number; center: { x: number; y: number } },
          description: "Detects pinch/zoom gestures"
        }
      }
    }
  });
}
```

**Step 2: Create Type Declarations (Optional)**

If you want TypeScript completion for your triggers, create a `types.d.ts` file in your extension:

```typescript
// src/types.d.ts
declare global {
  namespace InSpatial {
    interface ExtensionTriggers {
      swipe: { type: "swipe"; direction: "left" | "right"; distance: number };
      pinch: { type: "pinch"; scale: number; center: { x: number; y: number } };
    }
  }
}

export {};
```

**Step 3: Import Types in Your Extension Entry Point (If Created)**

If you created the `types.d.ts` file, import it in your extension's entry point:

```typescript
// src/index.ts
export { SwipeExtension } from "./extension.ts";

// Import type declarations to ensure they're available
import "./types.ts";
```

> **When to use:** When you prefer declarative trigger definitions and want to avoid manual `createTrigger()` calls.

##### Key Differences for Extension Developers

| Aspect | `createTrigger()` in Lifecycle | `capabilities.triggers` |
|--------|--------------------------------|------------------------|
| **Registration** | Manual `createTrigger()` calls | Automatic by extension system |
| **TypeScript Completion** | Optional `types.d.ts` file | Optional `types.d.ts` file |
| **Code Style** | Imperative (function calls) | Declarative (object definition) |
| **Discoverability** | Not listed in capabilities | Listed in extension capabilities |
| **Build Integration** | Not scanned | Can be scanned by build tools |
| **Use Case** | Complex initialization logic | Simple trigger definitions |
| **Type Declaration** | **Optional:** For TypeScript completion | **Optional:** For TypeScript completion |

> **Note:** The InTrigger extension uses `lifecycle.setup()` because it registers many standard DOM triggers at once as part of a larger initialization process. Extensions like InCloud and InRoute use `capabilities.triggers` for cleaner, declarative trigger definitions.

#### Trigger Prop Platform-Specific Considerations

Different platforms can have different trigger implementations:

- **DOM**: Uses `addEventListener`
- **XR**: Can use spatial input APIs
- **Native**: Can use platform-specific gesture recognizers
  etc...

The trigger bridge system handles these differences transparently. `InTrigger` auto-registers a universal bridge so `on:tap` maps to `click` on the web, and `longpress` is synthesized from pointer events.
