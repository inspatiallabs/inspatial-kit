# Style Composition: Common Gotchas

## 🚨 Key Things to Know

Style composition can be tricky when working with deeply nested and complex style settings. Here's what you need to watch out for:

## API Methods

### Using the `getStyle` Method

<details>
<summary>💡 <strong>Terminology:</strong> Style API</summary>

The style system provides the `getStyle` method for applying style styles. This method takes your style props and returns the generated class names.

</details>

#### Example Usage

```typescript
import { createStyle, type StyleProps } from "@in/style/style";

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

## Type Errors

### Missing Properties in `createStyle` Settings

<details>
<summary>💡 <strong>Terminology:</strong> Empty Style Properties</summary>

When creating styles using `createStyle`, each property in the settings object must have at least one value defined, even if it's an empty string. Otherwise, TypeScript will raise type errors when using the style methods.

</details>

#### ❌ Problem Example

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

#### ✅ Correct Implementation

```typescript
import { createStyle, type StyleProps } from "@in/style/style";

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

## Best Practices

1. **Always define at least one property** for each style category
2. **Use empty strings** (`""`) when no classes are needed
3. **Export typed props** using `StyleProps<typeof yourStyle.getStyle>`
4. **Include all possible options** in your `defaultSettings`

> [!NOTE]
> Adding more styles later is easy, just ensure you update both the `settings` and `defaultSettings` objects.

# More Things to Know About the Style System

### 1. Core API (Create Style)

```typescript
// Consistent API shape regardless of how it's called:
const system = createStyle(); // Returns {getStyle, iss, style, composeStyle}
const buttonStyle = createStyle({ ...config }); // Returns {getStyle, iss, style, composeStyle, config}
```

### 2. Type Extraction

```typescript
// Consistent type extraction from any style pattern:
type ButtonStyleType = StyleProps<typeof ButtonStyle>;
```

## Using Factory Functions

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
