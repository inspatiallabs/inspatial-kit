<div align="center">
    <a href="https://inspatial.io" target="_blank">
    <p align="center">
    <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-light.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg" alt="InSpatial" width="300">
    </picture>
</p>
   </a>

   <br>
   <br>

<p align="center">
  <a href="https://inspatial.io" target="_blank">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg">
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-light.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg" height="75" alt="InSpatial">
    </picture>
    </a>
</p>

_Reality is your canvas_

  <h3 align="center">
    InSpatial is a universal development environment (UDE) <br> for building cross-platform and spatial (AR/MR/VR) applications
  </h3>

[![InSpatial Kit](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg)](https://www.inspatial.dev)
[![InSpatial Cloud](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/cloud-badge.svg)](https://www.inspatial.cloud)
[![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.io)
[![InSpatial Store](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg)](https://www.inspatial.store)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Discord](https://img.shields.io/badge/discord-join_us-5a66f6.svg?style=flat-square)](https://discord.gg/inspatiallabs)
[![Twitter](https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat-square)](https://twitter.com/inspatiallabs)
[![LinkedIn](https://img.shields.io/badge/linkedin-connect_with_us-0a66c2.svg?style=flat-square)](https://www.linkedin.com/company/inspatiallabs)

</div>

##

<div align="center">

<table align="center">
  <thead>
    <tr>
      <th align="center">InSpatial</th>
      <th align="center">Description</th>
      <th align="center">Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://www.inspatial.dev">
          <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg" alt="InSpatial Kit">
        </a>
      </td>
      <td align="center">Universal Libraries & Frameworks</td>
      <td align="center"><a href="https://www.inspatial.dev">inspatial.dev</a></td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://www.inspatial.cloud">
          <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/cloud-badge.svg" alt="InSpatial Cloud">
        </a>
      </td>
      <td align="center">Backend APIs and SDKs</td>
      <td align="center"><a href="https://www.inspatial.cloud">inspatial.cloud</a></td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://www.inspatial.io">
          <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg" alt="InSpatial App">
        </a>
      </td>
      <td align="center">Build and manage your InSpatial apps</td>
      <td align="center"><a href="https://www.inspatial.io">inspatial.app</a></td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://www.inspatial.store">
          <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg" alt="InSpatial Store">
        </a>
      </td>
      <td align="center">Deploy and discover InSpatial apps</td>
      <td align="center"><a href="https://www.inspatial.store">inspatial.store</a></td>
    </tr>
  </tbody>
</table>

</p>
</div>

---

## 🔍 InRuntime (🟢 Stable)

A universal JSX runtime for building cross-platform and spatial applications. InRuntime provides a flexible foundation for JSX rendering with support for multiple renderers and type-safe component development.

### 🚀 Features

- **Universal JSX Runtime**
- **Type-Safe Components**: Complete TypeScript support with InSpatial's component types
- **Global Renderer Context**: Set once, use everywhere pattern for JSX compilation
- **Development Mode Support**: Enhanced error reporting and debugging in development
- **Cross-Platform**: Consistent JSX behavior across web, mobile, and native platforms


## 📦 Install InRuntime:

Choose your preferred package manager:

```bash
deno install jsr:@in/runtime
```

##

```bash
npx jsr add @in/runtime
```

##

```bash
yarn dlx jsr add @in/runtime
```

##

```bash
pnpm dlx jsr add @in/runtime
```

##

```bash
bunx jsr add @in/runtime
```


### 🛠️ Usage

#### Basic JSX Runtime Setup

```typescript
import { jsx, jsxs, Fragment, setGlobalRenderer } from "@in/runtime";

// Set up your renderer
const renderer = {
  c: (tag, props, ...children) => {
    // Your element creation logic
    return createElement(tag, props, ...children);
  },
  f: Fragment, // Fragment component
  isNode: (node) => typeof node === 'object' && node !== null
};

// Set global renderer for JSX compilation
setGlobalRenderer(renderer);

// Now JSX works automatically
function App() {
  return <div>Hello InSpatial!</div>;
}
```

#### TypeScript Integration

There are two ways to use InRuntime types:

##### Option 1: Explicit Type Imports (Recommended for Libraries)

```typescript
import type { JSX } from "@in/runtime/types";

interface MyComponentProps extends JSX.SharedProps {
  title: string;
  count: number;
}

function MyComponent({ title, count, className }: MyComponentProps) {
  return (
    <div className={className}>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  );
}
```

##### Option 2: Global Types (Recommended for Applications)

Create a global types file in your application:

```typescript
// Create: src/types/global.d.ts (or any .d.ts file in your project)
import type * as RuntimeTypes from "@in/runtime/types";

declare global {
  namespace InSpatial {
    interface ExtensionTriggers extends RuntimeTypes.InSpatial.ExtensionTriggers {}
  }

  type GeneratedTriggers = RuntimeTypes.GeneratedTriggers;

  namespace JSX {
    type Element = RuntimeTypes.JSX.Element;
    interface ElementClass extends RuntimeTypes.JSX.ElementClass {}
    type ElementChildrenAttribute = RuntimeTypes.JSX.ElementChildrenAttribute;
    type SharedProps = RuntimeTypes.JSX.SharedProps;
    interface IntrinsicElements extends RuntimeTypes.JSX.IntrinsicElements {}
    interface IntrinsicAttributes extends RuntimeTypes.JSX.IntrinsicAttributes {}
    
    // Add other types as needed...
    type UniversalStyleProps = RuntimeTypes.JSX.UniversalStyleProps;
    type ClassProps = RuntimeTypes.JSX.ClassProps;
    type TriggerPropKey = RuntimeTypes.JSX.TriggerPropKey;
  }
}
```

Now JSX types are available globally:

```typescript
interface MyComponentProps extends JSX.SharedProps {
  title: string;
  count: number;
}

function MyComponent({ title, count, className }: MyComponentProps) {
  return (
    <div className={className}>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  );
}
```

#### Development Mode

```typescript
import { jsxDEV } from "@in/runtime";

// Development mode provides enhanced error reporting
// Automatically enabled in non-production environments
```

### 🔧 API Reference

#### Core Functions

- `jsx(tag, props, key?)` - Create JSX element
- `jsxs(tag, props, key?)` - Create JSX element with static children
- `Fragment` - JSX Fragment component
- `setGlobalRenderer(renderer)` - Set global JSX renderer
- `getGlobalRenderer()` - Get current global renderer

#### Types

**Explicit Imports:**
- `import type { JSX } from "@in/runtime/types"` - All JSX types
- `import type { InSpatial } from "@in/runtime/types"` - InSpatial extension types

**Global Types (via custom global.d.ts file):**
- `JSX.Element` - JSX element type
- `JSX.SharedProps` - Common component props
- `JSX.IntrinsicElements` - HTML element props
- `JSX.UniversalStyleProps` - Cross-platform style props
- `InSpatial.ExtensionTriggers` - Extension trigger interface

---