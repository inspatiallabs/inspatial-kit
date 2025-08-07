# State Management Guide

## Quick Start: Use Explicit Pattern (Default)

For 90% of use cases, use the **explicit pattern** - it's simpler and more organized:

```typescript
const state = createState({
  initialState: { count: 0, name: "user" },
  trigger: {
    increment: { key: 'count', action: (c) => c + 1 },
    setName: { key: 'name', action: (_, name) => name }
  },
  storage: { key: 'my-state', backend: 'local' }
});

// Use it
state.trigger.increment();
state.count.get(); // 1
```

## When to Use Each Pattern

### ✅ Explicit Pattern (Recommended)

**Use for**: Self-contained components, features, or apps

**Benefits**:
- Everything in one place
- Organized and maintainable  
- Built-in storage and triggers
- Automatic cleanup

**Examples**:
```typescript
// User settings
const userState = createState({
  initialState: { theme: 'dark', language: 'en' },
  trigger: {
    setTheme: { key: 'theme', action: (_, theme) => theme },
    setLanguage: { key: 'language', action: (_, lang) => lang }
  },
  storage: { key: 'user-settings' }
});

// Todo app
const todoState = createState({
  initialState: { todos: [], filter: 'all' },
  trigger: {
    addTodo: { 
      key: 'todos', 
      action: (todos, text) => [...todos, { id: Date.now(), text, done: false }]
    },
    toggleTodo: {
      key: 'todos',
      action: (todos, id) => todos.map(t => 
        t.id === id ? { ...t, done: !t.done } : t
      )
    }
  },
  storage: { key: 'todos', exclude: ['filter'] }
});
```

### 🔧 Separation Pattern (Advanced)

**Use for**: Cross-state logic, plugins, or complex integrations

**Examples**:
```typescript
// Plugin system
function createPlugin(existingState) {
  return createTrigger(existingState.data, pluginLogic);
}

// Cross-state synchronization
const syncTrigger = createTrigger(stateA.value, (value) => {
  stateB.syncedValue.set(value);
  stateC.lastUpdate.set(Date.now());
  return value;
});

// Add storage to existing state
const cleanup = createStorage(existingState, {
  key: 'backup',
  backend: 'session'
});
```

## Decision Tree

```
Do you need to work with existing states you don't control?
├── Yes → Use Separation Pattern (createTrigger/createStorage)
└── No → Use Explicit Pattern (createState with config)

Is this a plugin or library?
├── Yes → Use Separation Pattern  
└── No → Use Explicit Pattern

Do you need complex cross-state logic?
├── Yes → Use Separation Pattern
└── No → Use Explicit Pattern
```

## Migration

**From Separation to Explicit**:
```typescript
// Before
const state = createState({ count: 0 });
const increment = createTrigger(state.count, (c) => c + 1);
createStorage(state, { key: 'count' });

// After  
const state = createState({
  initialState: { count: 0 },
  trigger: {
    increment: { key: 'count', action: (c) => c + 1 }
  },
  storage: { key: 'count' }
});
```

## Summary

- **Default**: Use explicit pattern for cleaner, organized code
- **Advanced**: Use separation pattern only when you need cross-state logic or plugins
- **Both patterns have identical power** - choose based on your use case, not limitations
