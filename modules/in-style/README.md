<div align="center">
<a href="https://inspatial.io" target="_blank">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-light.svg">
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg" alt="InSpatial" width="300"/>
    </picture>
</a>

<br>
   <br>

<a href="https://inspatial.io" target="_blank">
<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-light.svg">
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg" height="75" alt="InSpatial">
    </picture>
</p>
</a>

_Reality is your canvas_

<h3 align="center">
    InSpatial is a universal development environment (UDE) <br> for building cross-platform and spatial (AR/MR/VR) applications
  </h3>

[![InSpatial Dev](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg)](https://www.inspatial.dev)
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

| InSpatial                                                                                                                     | Description                          | Link                                           |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| [![InSpatial Dev](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg)](https://www.inspatial.dev)       | Universal Libraries & Frameworks     | [inspatial.dev](https://www.inspatial.dev)     |
| [![InSpatial Cloud](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/cloud-badge.svg)](https://www.inspatial.cloud) | Backend APIs and SDKs                | [inspatial.cloud](https://www.inspatial.cloud) |
| [![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.io)        | Build and manage your InSpatial apps | [inspatial.app](https://www.inspatial.io)      |
| [![InSpatial Store](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg)](https://www.inspatial.store) | Deploy and discover InSpatial apps   | [inspatial.store](https://www.inspatial.store) |

</div>

---

## 🔍 InStyle (🟢 Stable)

A modern style engine for building cross-platform and spatial application.

### 👨‍💻 What Can I Do With InStyle?

- **Create Cohesive UIs**: Build applications with consistent design using style variables and design tokens
- **Switch Styles Dynamically**: Support light/dark mode with real-time style switching
- **Use Premium Fonts**: Access 70+ built-in premium fonts plus Google Fonts integration
- **Apply Color Systems**: Use InSpatial's comprehensive color system with light/dark mode support
- **Build Component styles**: Create flexible component styles with the powerful style system

## 🌟 Features

### 🎨 **Style System & Variants**

- 🧩 **Advanced Style Engine and Variant System**: Create complex, composable component styles with `createStyle`
- 🔄 **Smart Composition**: Automatic style merging with conflict resolution and cross-references
- 🎯 **Compound Styles**: Define complex style combinations with composition patterns
- 💨 **Tailwind Integration**: Seamless compatibility with Tailwind CSS classes
- 🔗 **ISS (InSpatial Style Sheet)**: CSS-in-JS with intelligent transpiler for universal styling.

### 🎨 **Color & Design System**

- 🌈 **Rich Color Palette**: 40+ predefined colors with light/dark mode support
- 📊 **CSS Variables**: Automatic generation of theme-aware CSS custom properties
- 🎨 **Terminal Colors**: Full ANSI color support for CLI applications
- 🔧 **RGB Manipulation**: Advanced color utilities with 8-bit and 24-bit support
- 🌓 **Theme Generation**: Dynamic theme creation from brand colors

### 📝 **Typography & Fonts**

- 📦 **70+ Premium Fonts**: Curated collection of high-quality typefaces
- 🌐 **Google Fonts Integration**: Type-safe access to entire Google Fonts library
- ⚡ **Smart Font Loading**: Optimized loading with fallback strategies and stub system
- 🔧 **Font Merging**: Combine multiple font sources with unified API
- 📱 **Cross-Platform**: Universal font support across web, mobile, and native

### 🛠️ **Developer Experience**

- 🔒 **Complete Type Safety**: Full TypeScript support with intelligent inference
- 🔌 **Framework Agnostic**: Works with all frameworks
- 🚀 **Performance Optimized**: Minimal runtime overhead with build-time optimizations
- 🧪 **Testing Support**: Comprehensive test utilities and mocking capabilities
- 📚 **Rich Documentation**: Extensive examples and API reference

<div align="center">
  <h4>🚀 Keep reading to learn how to use all these amazing features! 🚀</h4>
</div>

## 📦 Install InStyle:

Choose your preferred package manager:

```bash
deno install jsr:@inspatial/style
```

##

```bash
npx jsr add @inspatial/style
```

##

```bash
yarn dlx jsr add @inspatial/style
```

##

```bash
pnpm dlx jsr add @inspatial/style
```

##

```bash
bunx jsr add @inspatial/style
```

## 🛠️ Step-by-Step Usage Guide

Here are the essential usage patterns for working with InStyle:

### 1. **Primitive Font - InSpatial Built-in Fonts**

```typescript
import { PrimitiveFontProps } from "@inspatial/style";

// Access any of the 70+ premium fonts
const { inter, poppins, montserrat, lato, rubik, roboto } = PrimitiveFontProps;

// Use fonts in your application
const myFont = inter({
  src: "/path/to/inter.woff2",
  weight: "400",
  style: "normal",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
  variable: "--font-inter",
});

// Access font properties
console.log(myFont.className); // CSS class name
console.log(myFont.style); // Font style properties
```

> **Note about Primitive Fonts**: InSpatial Primitive Fonts are included by default and require no CLI installation. They're served via a highly optimized CDN and include a curated set of fewer than 100 fonts, designed for performance and minimal payload.

### 2. **Google Fonts Integration**

```typescript
import { Roboto, Open_Sans, Lato } from "@inspatial/style";

// Create a Google Font instance with options
const robotoFont = Roboto({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
  variable: "--font-roboto",
});

// Use the font in your styling
const styles = {
  fontFamily: robotoFont.style.fontFamily,
  className: robotoFont.className,
};
```

> **Note about Google Fonts**: InSpatial embraces the concept of `Ejectable Defaults` pre-configured primitives that you can selectively remove or override. However, applying this pattern to fonts, especially Google Fonts, presents unique challenges. To keep the bundle size lean, the module ships with lightweight stubs for all Google Fonts by default. If you want to use the actual fonts, you'll need to manually install them using our CLI.

#### ✨ How Google Font Stubs Work ✨

InStyle uses a smart stub system for Google Fonts:

```ascii
┏━━━━━━━━━━━━━━━━━━━━━━━ INITIAL PACKAGE ━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                              ┃
┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ┃
┃  ┃                    LIGHTWEIGHT STUBS                    ┃  ┃
┃  ┃                                                         ┃  ┃
┃  ┃  ┏━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━━━━━━━━━━┓      ┃  ┃
┃  ┃  ┃  Google Font ┃      ┃      stub.ts          ┃      ┃  ┃
┃  ┃  ┃  Interface   ┃━━━━━▶┃  ┏━━━━━━━━━━━━━━━┓   ┃      ┃  ┃
┃  ┃  ┗━━━━━━━━━━━━━━┛      ┃  ┃ export const ┃   ┃      ┃  ┃
┃  ┃                        ┃  ┃ Roboto = ... ┃   ┃      ┃  ┃
┃  ┃                        ┃  ┃ Open_Sans = .┃   ┃      ┃  ┃
┃  ┃        PROVIDES        ┃  ┃ Lato = ...   ┃   ┃      ┃  ┃
┃  ┃      CONSISTENT        ┃  ┃ ...          ┃   ┃      ┃  ┃
┃  ┃         API            ┃  ┗━━━━━━━━━━━━━━━┛   ┃      ┃  ┃
┃  ┃                        ┗━━━━━━━━━━━━━━━━━━━━━━━┛      ┃  ┃
┃  ┃                                                         ┃  ┃
┃  ┃  ⚠️ System fonts used as fallbacks                      ┃  ┃
┃  ┃  ⚠️ Warning messages shown when used                    ┃  ┃
┃  ┃  ⚠️ Small footprint (~15KB total)                       ┃  ┃
┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ┃
┃                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                               │
                               │
                               ▼
┏━━━━━━━━━━━━ AFTER RUNNING: deno task fonts:google:install ━━━━━━━━━━━┓
┃                                                                      ┃
┃  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    ┏━━━━━━━━━━━━━━━━━┓  ┃
┃  ┃         REAL IMPLEMENTATIONS           ┃    ┃                  ┃  ┃
┃  ┃                                        ┃    ┃    FONT FILES    ┃  ┃
┃  ┃  ┏━━━━━━━━━━━━━━┓     ┏━━━━━━━━━━━━━━┓ ┃    ┃  ┏━━━━━━━━━━━┓  ┃  ┃
┃  ┃  ┃  Google Font ┃     ┃   fonts.ts   ┃ ┃    ┃  ┃ roboto.woff┃  ┃  ┃
┃  ┃  ┃  Interface   ┃━━━━▶┃ ┏━━━━━━━━━━┓ ┃ ┃    ┃  ┗━━━━━━━━━━━┛  ┃  ┃
┃  ┃  ┗━━━━━━━━━━━━━━┛     ┃ ┃Roboto    ┃ ┃ ┃    ┃                  ┃  ┃
┃  ┃                       ┃ ┃Open_Sans ┃◀┫─┼────╋─▶┏━━━━━━━━━━━┓  ┃  ┃
┃  ┃                       ┃ ┃Lato      ┃◀┫─┼────╋─▶┃opensans.woff┃  ┃  ┃
┃  ┃                       ┃ ┃...       ┃ ┃ ┃    ┃  ┗━━━━━━━━━━━┛  ┃  ┃
┃  ┃  SAME API,            ┃ ┗━━━━━━━━━━┛ ┃ ┃    ┃                  ┃  ┃
┃  ┃  REAL FUNCTIONALITY   ┗━━━━━━━━━━━━━━┛ ┃    ┃  ┏━━━━━━━━━━━┓  ┃  ┃
┃  ┃                                        ┃    ┃  ┃ lato.woff  ┃  ┃  ┃
┃  ┃  ✅ Actual font loading                 ┃    ┃  ┗━━━━━━━━━━━┛  ┃  ┃
┃  ┃  ✅ CSS @font-face integration          ┃    ┃                  ┃  ┃
┃  ┃  ✅ Optimized font display              ┃    ┗━━━━━━━━━━━━━━━━━┛  ┃
┃  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                         ┃
┃                                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

- **Before Installation**: The package includes lightweight stubs that:

  - Provide the same API/interface as real font implementations
  - Return warnings when used (suggesting font installation)
  - Use system fonts as fallbacks
  - Add minimal bundle size (~15KB for all Google Fonts)

- **After Installation**: When you run the install command:
  - Stubs are completely replaced with real implementations
  - Font files are downloaded or referenced from Google's CDN
  - Proper CSS is generated for @font-face declarations
  - Full font functionality becomes available
  - Variable name consistency is maintained for seamless transition

This approach gives you the best of both worlds: lightweight distribution and full functionality when needed!

#### Install Google Fonts

```bash
deno task fonts:google:install
```

#### Install only popular fonts (recommended, much smaller)

```
deno task fonts:google:install -- --popular
```

#### Install specific fonts

```
deno task fonts:google:install -- --families=Roboto,Open+Sans,Lato
```

#### Uninstall Google Fonts

```bash
deno task fonts:google:uninstall
```

### 2. **style System for Component Styling**

```tsx
import { createStyle } from "@in/style";

/***********************(Create style)*************************/
export const ButtonStyle = createStyle({
  // Base styles applied to all buttons
  base: "inline-flex",

  // Core style settings
  settings: {
    format: {
      primary: "bg-(--primary)",
      secondary: "bg-(--secondary)",
      danger: "bg-red-50 text-red hover:bg-red hover:text-white",
    },
    size: {
      sm: "text-sm py-1 px-3",
      md: "text-base",
      lg: "text-lg py-3 px-6",
    },
    rounded: {
      none: "rounded-none",
      md: "rounded-md",
      full: "rounded-full",
    },
  },

  // Specify default style settings
  defaultSettings: {
    format: "primary",
    size: "md",
    rounded: "md",
  },

  // Optional: Compound styles for specific combinations
  composition: [
    {
      format: "primary",
      size: "lg",
    },
  ],

  // Optional
  hooks: {},
});

/***********************(style Extraction)*************************/
export const ButtonStyleClass = ButtonStyle.getStyle({
  format: "danger",
  size: "lg",
});

/***********************(Render)*************************/
<Button className={ButtonStyle.iss(`${ButtonStyleClass}`, className)} />;
```

### TypeScript Integration

```typescript
// Import the style utilities
import {
  createStyle,
  kit,
  type styleProps,
} from "@in/style";

import { ButtonStyle } from "./style";

/***********************(Type)*************************/
// Extract prop types from your style
type ButtonStyleType = styleProps<typeof ButtonStyle>;

// Use the extracted type in your components
interface MyButtonProps extends ButtonStyleType {
 // These are already part of a universal SharedProps you can import from @inspatial/type
  children?: unknown;
  asChild?: boolean;
  disabled?: boolean;
  debug?: boolean;
  ...rest
}

/***********************(Render)*************************/
function Button({ format, size, style, disabled, ...rest  }: MyButtonProps) {
  return (
    <component
       className={iss(ButtonStyle.getStyle({ format, size, style }))}
       disabled={disabled}
    >
      Click
    </component>
  );
}
```

### Rendering styles

There are two recommended approaches for applying style styles in components:

#### 1. Direct Application

Best for single component usage where style props aren't passed down:

```tsx
// Apply style directly in the component
<Button
  className={ButtonStyle.getStyle({
    format: "ghost",
    size: "lg",
    style: "flat",
  })}
/>
```

#### 2. Prop-Driven Approach (Founders-Choice)

Best for component systems where style properties flow from parent to children:

```tsx
// Component accepts style props from parent
function CustomButton({ format, size, style, className, ...props }) {
  return (
    <Button
      className={iss(
        `${ButtonStyle.getStyle({ format, size, style, className })}`
      )}
      {...props}
    />
  );
}
```

---

## 📄 License

InStyle is released under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Ready to shape the future of spatial computing?</strong>
  <br>
  <a href="https://www.inspatial.io">Start Building with InSpatial</a>
</div>
