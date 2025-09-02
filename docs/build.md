
### 10. Building for Dev & Production

You can build your app for dev and production using different tools like (InSpatial `Serve` extension, Vite, Rollup with Babel, Rspack or Webpack). InSpatial provides different plugins and extensions for different tools.

- InServe (Default)
- InVite
- InPack

#### InServe (Founders Choice)

When using `InServe()` extension there's no need to use or configure a build tool like Vite or RSPack. To use `InServe()`, create your render.ts file and add it as an extension.

```typescript
// render.ts
import { createRenderer } from "@inspatial/kit/renderer";
import { InServe } from "@in/build";

createRenderer({
  extensions: [InServe()],
});
```

Then add your deno.json

```json
//deno.json
{
  "tasks": {
    "serve": "deno run --allow-net --allow-read --allow-write --allow-env --allow-run src/config/render.ts"
  }
}
```

#### InVite

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
    jsxImportSource: "@inspatial/kit", // This tells Vite/esbuild where to find the runtime
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

#### InPack

Use the `InPack` plugin for Webpack and/or RSPack/RSBuild

```javascript
import { defineConfig } from "@rsbuild/core";
import { InPack } from "@in/build";

export default defineConfig({
  plugins: [InPack()],
  // ... jsx config
});
```