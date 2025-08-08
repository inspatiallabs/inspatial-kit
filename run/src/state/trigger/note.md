## Overview

The trigger (prop) system in InSpatial is decoupled from individual renderers. All trigger functionality is are provided exclusively through the extension system.

## NOTE

- All trigger behavior is centralized in `trigger-props.ts` (and its bridge registry).
- Unknown directive-like props are ignored unless an extension resolves them.
- Use `triggerPropExtension` (or custom extensions) to enable triggers.

### 1. No Built-in Trigger Support in Renderers

- **DOM Renderer**: No built-in event handling
- **HTML Renderer**: No built-in event handling  
- **XR Renderers**: No built-in event handling
- **Native Renderers**: No built-in event handling

### 2. Extension-Based Trigger System

All trigger functionality must be explicitly enabled via the renderer extensions:

```typescript
createRenderer({
  mode: "auto",
  extensions: [triggerPropExtension]
})
```

### 3. Unified Mental Model

1. **Consistency**: All renderers behave identically - no triggers without extensions
2. **Clarity**: Single source of truth for trigger behavior (trigger/trigger-props.ts)
3. **Extensibility**: Easy to add platform-specific triggers
4. **Testability**: Can test renderers without any trigger system

## How Triggers Work Now

1. **JSX Compilation**: `<button on:click={handler} />` compiles to props object
2. **Renderer Processing**: Renderer calls `setProps(node, props)`
3. **Extension Routing**: `onDirective` callback routes `on:` prefixes to trigger system
4. **Trigger Handler**: `withTriggerProps.onTriggerProp` returns appropriate handler
5. **Event Binding**: Handler binds event to DOM/platform API

## Adding New Triggers

To add custom triggers, use the `registerTriggerHandler` API:

```typescript
registerTriggerHandler('swipe', createSwipeHandler(), {
  platforms: ['dom', 'native:ios', 'native:android'],
  fallback: 'click'
});
```

## Platform-Specific Considerations

Different platforms can have different trigger implementations:

- **DOM**: Uses `addEventListener`
- **XR**: Can use spatial input APIs
- **Native**: Can use platform-specific gesture recognizers

The trigger bridge system handles these differences transparently.
