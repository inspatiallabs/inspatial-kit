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

## 🔍 InBuild (🟡 Preview)
InBuild is a universal build system that provides three different bundling strategies (InServe for zero-config dev servers, InVite for Vite integration, and InPack for Webpack/Rspack) to compile and serve cross-platform and spatial applications for both development and production environments.

## 📦 Install InBuild:

Choose your preferred package manager:

```bash
deno install jsr:@in/build
```

##

```bash
npx jsr add @in/build
```

##

```bash
yarn dlx jsr add @in/build
```

##

```bash
pnpm dlx jsr add @in/build
```

##

```bash
bunx jsr add @in/build
```

---

# Building for Dev & Production

#### A friendly guide from “it works on my machine” to “it runs everywhere”

So, you’ve created your amazing InSpatial website, app, game or XR experience. Now it’s time to get it in front of real people. This page is your roadmap from everyday local development to fast, reliable deployments. Think of it like moving from rehearsal to opening night: you’ll polish performance, bundle what’s needed, and serve it from a place your audience can reach.

In development, you want speed and instant feedback. In production, you want stability, caching, and small, efficient files. We’ll show you both paths clearly—how to build quickly while you’re iterating, and how to produce optimized assets when you’re ready to host.

> **Terminology:**
>
> - “Dev build” prioritizes fast feedback (watch, hot reload, minimal configuration).
> - “Production build” prioritizes small file sizes, caching, and predictable output for hosting.

You have several options for building your app for development and production. InSpatial supports multiple tools through dedicated plugins and extensions:

- **InServe** (the default choice)
- **InVite** (for Vite integration)
- **InPack** (for Webpack, Rspack, or similar bundlers)

## InServe (Founders Choice)

#### A simple, dev server and smart builder for your app

InSpatial Serve automatically monitor your files, rebuild anything that changes, and refreshes your website, app, game or XR experience so you always see the latest updates right away.

> **Note:** InServe is a focused, zero‑config dev server with sensible defaults and opt‑in controls when you need them.

#### Quick start

```typescript
// render.ts
import { createRenderer } from "@inspatial/kit/renderer";
import { InServe } from "@in/build";

createRenderer({
  extensions: [InServe()],
});
```

```json
// deno.json
{
  "tasks": {
    "serve": "deno run --allow-net --allow-read --allow-write --allow-env --allow-run src/config/render.ts"
  }
}
```

Run:

```bash
deno task serve
```

#### What it does for you

- **Serves files** from `./dist` on an available port (defaults: 6310 → 6311 → 6312)
- **Hot reloads** the browser via WebSocket (defaults: 8888 → 8889 → 8890)
- **Rebuilds CSS first** so Tailwind classes are always ready before JS
- **Watches sources** in `./src` (and optionally framework roots) to trigger smart rebuilds
- **Handles assets** under `/asset/` with a dev‑friendly cache policy

> **Terminology:** “Hot reload” here means an automatic full page reload when files change. It’s deliberately simple and reliable.

### Configuration

You can adjust behavior in `deno.json` using the `inspatial.serve` block. Everything is optional; defaults match the zero‑config behavior above.

```json
// deno.json
{
  "inspatial": {
    "serve": {
      "server": {
        "httpPorts": [6310, 6311, 6312],
        "wsPorts": [8888, 8889, 8890],
        "host": "localhost",
        "injectClient": true,
        "clientScriptUrl": "",
        "cacheControl": "no-store",
        "assetRouteBase": "/asset/"
      },
      "paths": {
        "srcDir": "./src",
        "distDir": "./dist",
        "htmlEntry": "./index.html",
        "htmlDist": "./dist/index.html",
        "assetSrcDir": "./src/asset",
        "assetDistDir": "./dist/asset",
        "favicon": "./src/asset/favicon.png",
        "renderEntry": "./src/config/render.ts",
        "cssInput": "./src/config/app.css",
        "cssOutput": "./dist/kit.css",
        "jsOutput": "./dist/bundle.js"
      },
      "watch": {
        "include": ["./src", "./index.html"],
        "includeFramework": ["@inspatial/kit", "../kit/src", "../kit/modules"],
        "exclude": ["node_modules", "dist", ".git"]
      },
      "build": {
        "js": {
          "engine": "cli",
          "entrypoints": [],
          "outputDir": "./dist",
          "platform": "browser",
          "minify": false,
          "codeSplitting": false,
          "format": "esm",
          "inlineImports": false,
          "external": [],
          "packages": "bundle",
          "sourcemap": false,
          "write": true,
          "htmlEntrypoints": false
        },
        "css": {
          "input": "./src/config/app.css",
          "output": "./dist/kit.css",
          "contentGlobs": [
            "src/**/*.{ts,tsx,js,jsx}",
            "../kit/modules/**/*.{ts,tsx,js,jsx}"
          ]
        },
        "html": { "enabled": true },
        "timing": {
          "debounceMs": 100,
          "waitAttempts": 50,
          "waitIntervalMs": 100,
          "cssStabilizeAttempts": 10,
          "cssStabilizeIntervalMs": 100
        }
      },
      "discovery": {
        "renderSearch": [
          "./render.ts",
          "./src/render.ts",
          "./src/config/render.ts"
        ],
        "kitRoots": ["@inspatial/kit", "../kit/src", "../kit/modules"]
      }
    }
  }
}
```

#### JS bundling modes

- **inprocess:** uses Deno’s runtime API `Deno.bundle()` in‑process.
  - Pros: supports HTML entrypoints, optional in‑memory outputs (`write=false`), fewer shell hops.
  - Requirements: Deno ≥ 2.5 with `--unstable-bundle`.
  - Set via `deno.json`: `inspatial.serve.build.js.engine = "runtime"` (alias for inprocess)
- **subprocess:** invokes the `deno bundle` CLI as a child process.
  - Pros: very stable, no unstable flags.
  - Behavior: writes to disk; HTML entrypoints supported via CLI flags.
  - Set via `deno.json`: `inspatial.serve.build.js.engine = "cli"` (alias for subprocess)

> **Note:** When `htmlEntrypoints` is true, the server skips manual HTML copying because the bundler rewrites your HTML with hashed asset names.

<details>
  <summary><strong>Genius</strong></summary>

- Build orchestration uses a debounced BuildQueue: if both CSS and JS are queued, CSS runs first to ensure Tailwind (when installed) classes exist before JS reloads. Timings (debounce, waits, stabilization) are configurable.
- Tailiwind CSS is built via Tailwind CLI with content globs from <code>build.css.contentGlobs</code> and optionally augmented by <code>discovery.kitRoots</code>. The server waits for <code>cssOutput</code> to stabilize (size unchanged) to avoid race conditions.
- JS bundling maps 1:1 to either <code>deno bundle</code> (subprocess) or <code>Deno.bundle()</code> (inprocess). Inprocess supports HTML entrypoints and optional in‑memory outputs (<code>write: false</code>) for fast dev serving; subprocess passes equivalent flags and falls back automatically on runtime errors.
- The WebSocket server binds the first available port from <code>server.wsPorts</code>. HTML responses get a tiny injected client (unless <code>injectClient</code> is false or a custom <code>clientScriptUrl</code> is provided) that reloads the page on change.
- The file server serves from <code>paths.distDir</code>, applies SPA fallback (serves <code>index.html</code> when no extension), and handles <code>/asset/</code> (or <code>assetRouteBase</code>) with <code>Cache-Control: no-store</code> in dev.
- Watchers are configured via <code>watch.include</code> and <code>watch.includeFramework</code>. Any TS/JS/TSX/JSX edit also queues a CSS rebuild to catch new Tailwind classes; pure asset edits trigger reload without rebuilding.

</details>

#### Hot reload client

- Toggle with `server.injectClient` (true by default)
- Provide a custom script with `server.clientScriptUrl` if you want to host your own client

#### Ports and environment overrides

- HTTP ports: `server.httpPorts` or `INSPATIAL_SERVE_HTTP_PORTS=6310,6311`
- WS ports: `server.wsPorts` or `INSPATIAL_SERVE_WS_PORTS=8888,8889`

#### Tailwind and CSS stability

- Styles build first to ensure new style classes exist before JS reloads
- `build.css.contentGlobs` controls where Tailwind scans for class names
- The server waits briefly for `cssOutput` to stabilize before reloading the page

### Examples

#### Example 1: Runtime bundling with in‑memory outputs

```json
{
  "inspatial": {
    "serve": {
      "build": {
        "js": {
          "engine": "runtime",
          "entrypoints": ["./src/config/render.ts"],
          "write": false
        }
      }
    }
  }
}
```

#### Example 2: HTML entrypoint bundling

```json
{
  "inspatial": {
    "serve": {
      "build": {
        "js": {
          "engine": "runtime",
          "entrypoints": ["./index.html"],
          "htmlEntrypoints": true
        }
      }
    }
  }
}
```

## InVite

Use `InVite` plugin for Vite. Create a `vite.config.ts` file and add the following conifguration

##### Pragma Config (Default)

```typescript
import { defineConfig } from "vite";
import { InVite } from "@in/build";

export default defineConfig({
  server: {
    port: 6310,
  },
  esbuild: {
    jsxFactory: "R.c",
    jsxFragment: "R.f",
  },
  plugins: [InVite()],
  build: {
    target: "esnext",
  },
});
```

##### Automatic Config

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@inspatial/kit", // This tells Vite where to find the runtime
  },
});
```

#### Babel (`.babelrc.json`)

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "@inspatial/kit"
      }
    ]
  ]
}
```

See the [Vite](https://vite.dev/) for setup, usage, and API details.

## InPack

Use the `InPack` plugin for Webpack and/or RSPack/RSBuild

```javascript
import { defineConfig } from "@rsbuild/core";
import { InPack } from "@in/build";

export default defineConfig({
  plugins: [InPack()],
  // ... jsx config
});
```

See the [Webpack](https://webpack.js.org/) for setup, usage, and API details.
See the [Rspack](https://rspack.rs/) for setup, usage, and API details.
See the [Rsbuild](https://rsbuild.rs/) for setup, usage, and API details.

---

## 📄 License

InStyle is released under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Ready to shape the future of spatial computing?</strong>
  <br>
  <a href="https://www.inspatial.io">Start Building with InSpatial</a>
</div>
