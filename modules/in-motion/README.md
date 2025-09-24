<div align="center">
    <a href="https://inspatiallabs.com" target="_blank">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-light.svg">
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg" alt="InSpatial" width="300"/>
    </picture>
    </a>

<br>
   <br>

<a href="https://inspatiallabs.com" target="_blank">
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
[![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.app)
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
| [![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.app)       | Build and manage your InSpatial apps | [inspatial.app](https://www.inspatial.app)     |
| [![InSpatial Store](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg)](https://www.inspatial.store) | Deploy and discover InSpatial apps   | [inspatial.store](https://www.inspatial.store) |

</div>

---

## 🔍 InMotion (🟡 Preview)

InMotion is a universal animation and physics module that brings everything to life with silky-smooth performance across all platforms and environments.

### 👨‍💻 What Can I Do With InMotion?

- **Animate Anything**: Smoothly animate DOM elements, objects, SVG, canvas, and even plain JavaScript values
- **Timeline Orchestration**: Create complex, synchronized animation sequences with precise timing control
- **Physics-Based Motion**: Build realistic 2D/3D interactions with spring & bullet physics
- **Interactive Experiences**: Create draggable elements with smooth physics and smart constraints
- **Cross-Platform Compatibility**: Works seamlessly in browsers, Deno/InZero, Node.js, Bun etc...

## 🌟 Features

- 🌍 Framework agnostic & Universal runtime support (Browser, Deno/InZero, Node.js, Bun etc...)
- 🔍 Advanced easing functions with custom cubic-bezier curves
- 🎮 Interactive draggable system with physics and constraints
- ✅ **Prop-driven**: You control behavior with prop-attributes.
- 📝 Declarative keyframe animations with percentage and duration syntax
- 🎯 Precise timeline control with labels and nested sequences
- ⚡ High-performance rendering with optimized update cycles
- 🔄 Additive animation composition for complex motion
- 🔍 Scroll-triggered animations with divport detection
- 🎨 SVG morphing and path animations
- 🛡️ Type-safe APIs with comprehensive TypeScript support
- 🔄 Promise-based animation control with async/await
- 🧪 Clean testing architecture for server-side validation
- 📝 Comprehensive callback system for animation lifecycle
- 🧩 Modular architecture with tree-shakable exports
- 📸 2D/3D spring and bullet physics with customizable propeties
- 📈 Animation sequencing with stagger and offset support
- 📦 Scoped animation contexts with automatic cleanup

## 🔮 Coming Soon

- 🌐 `<InMotion>` Component via InSpatial Kit
- 📊 Visual timeline client extension
- ⚡ Performance profiling and debugging tools

## 📦 Install InMotion:

Choose your preferred package manager:

```bash
deno install jsr:@in/motion
```

##

```bash
npx jsr add @in/motion
```

##

```bash
yarn dlx jsr add @in/motion
```

##

```bash
pnpm dlx jsr add @in/motion
```

##

```bash
bunx jsr add @in/motion
```

##

```bash
vlt install jsr:@in/motion
```

## 🎮 Usage

### Quick Usage

```html
<div data-inmotion="fade-u duration-500 once">{content}</div>
```

---

### InMotion With an InSpatial Renderer & JSX Runtime

```typescript
import { InMotion } from "@inspatial/kit/motion";
```

#### Basic Usage

1. Create a `render.ts` and add the `InMotion` extension to your renderer.

```jsx
//render.ts
import { InMotion } from "@inspatial/kit/motion";
import { createRenderer } from "@inspatial/kit/renderer";

createRenderer({
  extensions: [InMotion()],
});
```

2. Add `data-inmotion` prop to the component you want to animate.

### InMotion with Interactive Triggers via (Interact)

InMotion dispatches Trigger events you can listen to directly.

- Trigger events: `inmotion:start`, `inmotion:end`, `inmotion:progress`
- Detail payload:
  - `id?: string`, `ratio: number`, `time: number`, `duration: number`, `direction: "forward" | "reverse"`

InSpatial trigger props (recommended):

```jsx
import { View } from "@inspatial/kit/widget";

<View
  data-inmotion="fade-u"
  on:motionstart={(e) => console.log("start", e.detail)}
  on:motionend={(e) => console.log("end", e.detail)}
  on:motionprogress={(e) => console.log("progress", e.detail)}
/>;
```

---

### Core Prop Syntax

Combine tokens inside `data-inmotion` to describe the effect:

- Animations: `fade`, `zoomin`, `zoomout`, `flip`
- Directions: `u`, `d`, `l`, `r`, combos like `ul`, `dr`
- Timing and control: `duration-{ms}`, `delay-{ms}`, `easing-[css-fn]`, `threshold-{%}`, `once`, `forwards`, `loop`/`loop-{mirror|jump}`
- Effects: `blur`/`blur-{rem}`, `text-shimmer`, `text-fluid`
- Split: `split-word`, `split-letter`, `split-item`, plus `split-delay-{ms}` and stagger mode
- Counters: `count-[{number-like-text}]`
- Custom timeline: `line-[{timeline}]`

> **Note:** When `line-[…]` is present it fully controls keyframes and ignores standard animation tokens.

### Supported Animations

#### Fade

```html
<div data-inmotion="fade-u" />
<!-- Upwards fade-in -->
<div data-inmotion="fade-dr" />
<!-- Diagonal down-right -->
```

Optional numeric tuning after the token controls distance (percent):

```html
<div data-inmotion="fade-40" />
<!-- 40% movement -->
<div data-inmotion="fade-30-60" />
<!-- X:30% Y:60% -->
```

#### Zoom In / Zoom Out

```html
<div data-inmotion="zoomin" />
<!-- Zoom into place -->
<div data-inmotion="zoomout-r" />
<!-- Zoom out from right offset -->
```

Tuning values: one value = intensity, or provide movement plus intensity:

```html
<div data-inmotion="zoomin-30" />
<!-- intensity 30% -->
<div data-inmotion="zoomout-40-60" />
<!-- move 40%, intensity 60% -->
<div data-inmotion="zoomin-30-50-80" />
<!-- X:30% Y:50% intensity:80% -->
```

#### Flip (3D)

```html
<div data-inmotion="flip-u" />
<!-- Flip over X-axis (up) -->
<div data-inmotion="flip-l" />
<!-- Flip over Y-axis (left) -->
```

Tuning values: angle and perspective (rem):

```html
<div data-inmotion="flip-120" />
<!-- 120° angle, default perspective -->
<div data-inmotion="flip-90-60" />
<!-- 90° angle, 60rem perspective -->
```

### Split Animations

Split text or children and animate each part with a stagger:

```html
<p data-inmotion="split-word fade-u split-delay-100">Split by words</p>
<p data-inmotion="split-letter zoomin split-delay-75-center">Letters</p>
<ul data-inmotion="split-item flip-r split-delay-50-edges">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

- Types: `split-word`, `split-letter`, `split-item`
- Delay: `split-delay-{ms}`
- Stagger strategies: `index` (default), `linear`, `center`, `edges`, `random` (e.g. `split-delay-100-center`)

> **Note:** You can nest animation tokens inside split implicitly. Under the hood, split creates a dedicated animation config for each target.

### Counters and Text Effects

#### Count

Animates numbers from 0 to the target while preserving formatting:

```html
<p data-inmotion="count-[1,234]">Revenue: 1,234</p>
<p data-inmotion="count-[4.9]">Rating: 4.9/5</p>
```

#### Text Effects

```html
<p data-inmotion="text-shimmer split-letter duration-2000 split-delay-100">
  Shimmer
</p>
<p data-inmotion="text-fluid split-letter duration-2000 split-delay-50">
  Fluid
</p>
```

> Must be combined with `split-letter`. These effects auto‑loop with `jump` for continuous motion.

### Modifiers and Control

- `duration-{ms}` / `delay-{ms}`
- `easing-[cubic-bezier(0.4,0,0.2,1)]`, also supports `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `step-start`, `step-end`
- `threshold-{percent}`: triggers when that portion of the element is visible
- `blur` or `blur-{rem}` (e.g. `blur-2`)
- `once`: animate only once
- `forwards`: keep the final state
- `loop` or `loop-{mirror|jump}`: continuous animation (mirror reverses direction smoothly; jump restarts)

### IDs and Re‑animation

```html
<div data-inmotion="fade-u">Auto ID (may re‑animate on re‑render)</div>
<div data-inmotion="fade-u" data-inmotion-id="hero">
  Stable ID (prevents re‑animation)
</div>
```

### Custom Timeline: `line-[…]`

Fully custom keyframes using a compact grammar. Properties (case‑insensitive):

- Opacity: `o±{0..100}`
- Scale: `s±{v}`, `sx/sy/sz±{v}`
- Translate: `t±{%}`, `tx/ty/tz±{%}`
- Rotate: `r±{deg}`, `rx/ry/rz±{deg}`
- Blur: `b±{rem}`
- Perspective: `p±{rem}`
- Weight (font): `w±{100..900}`

Use `|` to separate keyframes; optional leading percent fixes frame position.

```html
<div
  data-inmotion="line-[o+0 tx+60|30o+80 tx+10|o+100 tx+0] duration-1200"
></div>
<div data-inmotion="line-[w+100|50w+900|w+100] loop linear split-letter"></div>
```

> Order matters. Avoid mixing `s` with `sx/sy/sz` in the same frame. When `line-[…]` is present, standard tokens like `fade`/`zoomin` are ignored.

> **⚠️ Important:** When `line-[{value}]` is defined, standard animation classes are ignored. The custom timeline takes complete control of the animation.

> **⚠️ Important:** When `line-[{value}]` is defined, standard animation classes (fade, zoomin, etc.) are ignored. The custom timeline takes complete control of the animation.

### Animation Tuning

Add numeric values after animation tokens to customize their behavior:

```html
<div data-inmotion="fade-40">Custom fade distance</div>
<div data-inmotion="zoomin-30-50-80">Custom zoom with X, Y, intensity</div>
<div data-inmotion="flip-120-60">Custom flip angle and perspective</div>
```

**How tuning works:**

- **Fade**: Distance values control how far elements move during animation
  - `fade-40` → 40% movement distance
  - `fade-30-60` → X: 30%, Y: 60% movement
- **Zoom**: Scale and movement values control zoom intensity and offset
  - `zoomin-30` → 30% zoom intensity
  - `zoomin-40-60` → 40% movement, 60% intensity
  - `zoomin-30-50-80` → X: 30%, Y: 50%, intensity: 80%
- **Flip**: Angle and perspective values control 3D rotation
  - `flip-120` → 120° rotation angle
  - `flip-90-60` → 90° angle, 60rem perspective depth

> **Note:** Default values are 15% for normal animations, 50% for split animations, 90° angle and 25rem perspective for flips.

```html
<!-- Gentle effects -->
<div data-inmotion="fade">Standard fade distance</div>
<div data-inmotion="fade-10">Minimal fade distance</div>

<!-- Bold effects -->
<div data-inmotion="zoomin">Standard zoom scale</div>
<div data-inmotion="zoomin-75">Strong zoom scale</div>

<!-- Advanced multi-parameter control -->
<div data-inmotion="fade-dr-60-40">Corner fade with custom X/Y offsets</div>
<div data-inmotion="zoomout-20-30-70">
  Precise zoom with movement and scale control
</div>

<!-- 3D rotation examples -->
<div data-inmotion="flip">Standard rotation with default depth</div>
<div data-inmotion="flip-180-50">Half-turn rotation with enhanced depth</div>
<div data-inmotion="flip-udlr-120-80">
  Multi-axis rotation with custom settings
</div>
```

---

## API Reference

### Programmatic API

| Function            | Description                                | Parameters                         | Returns            |
| ------------------- | ------------------------------------------ | ---------------------------------- | ------------------ |
| `InMotion(config?)` | Extension factory for renderer integration | `config?: Partial<InMotionConfig>` | Extension object   |
| `createMotion()`    | Creates motion instance (SSR-safe)         | None                               | `InMotionInstance` |

### InMotionInstance Methods

| Method              | Description                            | Parameters                           | Returns                     |
| ------------------- | -------------------------------------- | ------------------------------------ | --------------------------- |
| `config()`          | Get current configuration              | None                                 | `InMotionConfig`            |
| `config(newConfig)` | Update configuration                   | `newConfig: Partial<InMotionConfig>` | `InMotionInstance`          |
| `destroy()`         | Clean up and stop (extreme cases only) | None                                 | `Promise<void>`             |
| `restart()`         | Restart engine (extreme cases only)    | None                                 | `Promise<InMotionInstance>` |
| `initialized()`     | Check if engine is running             | None                                 | `boolean`                   |
| `version`           | Get version string                     | None                                 | `string`                    |

### Trigger Event Handlers

| Handler                 | Description                | Event Detail                                                                                        |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `motionStartHandler`    | Animation start trigger    | `{ id?: string }`                                                                                   |
| `motionEndHandler`      | Animation end trigger      | `{ id?: string }`                                                                                   |
| `motionProgressHandler` | Animation progress trigger | `{ id?: string, ratio: number, time: number, duration: number, direction: "forward" \| "reverse" }` |

### Configuration Types

| Interface          | Properties                                                                                                     | Description                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `InMotionDefaults` | `animation`, `direction`, `duration`, `delay`, `threshold`, `splitDelay`, `easing`, `blur`, `forwards`, `loop` | Default animation settings  |
| `InMotionConfig`   | `defaults`, `observersDelay`, `once`                                                                           | Global engine configuration |

### Animation Tokens

| Category         | Tokens                                                                                          | Description                |
| ---------------- | ----------------------------------------------------------------------------------------------- | -------------------------- |
| **Animations**   | `fade`, `zoomin`, `zoomout`, `flip`                                                             | Base animation types       |
| **Directions**   | `u`, `d`, `l`, `r`, `ul`, `ur`, `dl`, `dr`                                                      | Movement directions        |
| **Split Types**  | `split-word`, `split-letter`, `split-item`                                                      | Content splitting modes    |
| **Text Effects** | `text-shimmer`, `text-fluid`                                                                    | Special text animations    |
| **Modifiers**    | `duration-{ms}`, `delay-{ms}`, `threshold-{%}`, `once`, `forwards`, `loop`, `blur`              | Animation control          |
| **Easing**       | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `step-start`, `step-end`, `easing-[fn]` | Timing functions           |
| **Loop Types**   | `loop-mirror`, `loop-jump`                                                                      | Continuous animation modes |
| **Stagger**      | `split-delay-{ms}-{strategy}`                                                                   | Split animation timing     |

### Custom Timeline Properties

| Property        | Syntax                          | Description          | Units                |
| --------------- | ------------------------------- | -------------------- | -------------------- |
| **Opacity**     | `o±{value}`                     | Element transparency | 0-100 (auto-clamped) |
| **Scale**       | `s±{value}`, `sx/sy/sz±{value}` | Element scaling      | Multiplier           |
| **Translate**   | `t±{value}`, `tx/ty/tz±{value}` | Element movement     | Percentage           |
| **Rotate**      | `r±{value}`, `rx/ry/rz±{value}` | Element rotation     | Degrees              |
| **Blur**        | `b±{value}`                     | Blur effect          | rem                  |
| **Perspective** | `p±{value}`                     | 3D perspective       | rem                  |
| **Weight**      | `w±{value}`                     | Font weight          | 100-900              |

### DOM Events

| Event               | Bubbles | Detail Payload                                                                                      |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `inmotion:start`    | Yes     | `{ id?: string }`                                                                                   |
| `inmotion:end`      | Yes     | `{ id?: string }`                                                                                   |
| `inmotion:progress` | Yes     | `{ id?: string, ratio: number, time: number, duration: number, direction: "forward" \| "reverse" }` |

### Default Values

| Setting               | Normal Animations | Split Animations | Flip Animations |
| --------------------- | ----------------- | ---------------- | --------------- |
| **Movement Distance** | 15%               | 50%              | N/A             |
| **Zoom Intensity**    | 15%               | 50%              | N/A             |
| **Rotation Angle**    | N/A               | N/A              | 90°             |
| **Perspective**       | N/A               | N/A              | 25rem           |
| **Duration**          | 1000ms            | 1000ms           | 1000ms          |
| **Threshold**         | 10%               | 10%              | 10%             |
| **Split Delay**       | 30ms              | 30ms             | 30ms            |

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📄 License

InSpatial Kit is released under the Intentional 1.0 License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Ready to shape the future of Physics and Motion?</strong>
  <br>
  <a href="https://www.inspatial.io">Start Building with InSpatial</a>
</div>
