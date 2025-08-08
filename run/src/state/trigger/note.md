## NOTE
- Triggers are grouped into `Props` and `Actions` which are are two different things. Think of Trigger props are like elemental attributes and directives that control components e.g a `<component prop...>` while actions allow you to perform functions e.g `onDoorOpen -> EnterHouse`. We did not call this createAction() but instead createTrigger() because in the real world every action requires an event that triggered it in the first place. 

## Trigger (Actions)
...


### Trigger (Props)

- All trigger behavior is centralized in `trigger-props.ts` (and its bridge registry).
- Triggers are decoupled and disabled by default. The trigger prop registry helps create and mix different platform trigger props e.g you can unify the click event from web/dom and android, ios etc... give it a simple name e.g `tap` then all of those platforms will respond to the tap. 
- Unknown directive-like props are ignored unless an extension resolves them.
- Use `triggerPropExtension` (or custom extensions) to enable triggers.

#### 1. No Built-in Trigger (Prop) Support in Renderers

- **DOM Renderer**: No built-in event handling
- **HTML Renderer**: No built-in event handling  
- **XR Renderers**: No built-in event handling
- **Native Renderers**: No built-in event handling

#### 2. Extension-Based Trigger (Prop) System

All trigger functionality must be explicitly enabled via the renderer extensions:

```typescript
createRenderer({
  mode: "auto",
  extensions: [triggerPropExtension]
})
```

#### 3. Trigger Prop Unified Mental Model 

1. **Consistency**: All renderers behave identically - no triggers without extensions
2. **Clarity**: Single source of truth for trigger behavior (trigger/trigger-props.ts)
3. **Extensibility**: Easy to add platform-specific triggers
4. **Testability**: Can test renderers without any trigger system

#### How Triggers Props Work Now

1. **JSX Compilation**: `<button on:click={handler} />` compiles to props object
2. **Renderer Processing**: Renderer calls `setProps(node, props)`
3. **Extension Routing**: `onDirective` callback routes `on:` prefixes to trigger system
4. **Trigger Handler**: `withTriggerProps.onTriggerProp` returns appropriate handler
5. **Event Binding**: Handler binds event to DOM/platform API

#### Adding New Trigger Props

To add custom triggers, use the `registerTriggerHandler` API:

```typescript
registerTriggerHandler('swipe', createSwipeHandler(), {
  platforms: ['dom', 'native:ios', 'native:android'],
  fallback: 'click'
});
```

#### Trigger Prop Platform-Specific Considerations

Different platforms can have different trigger implementations:

- **DOM**: Uses `addEventListener`
- **XR**: Can use spatial input APIs
- **Native**: Can use platform-specific gesture recognizers

The trigger bridge system handles these differences transparently.
