
# Runtime & Markup

InSpatial ships with a JSX runtime by default, but you can also compose UI with our renderer primitives. Think of the runtime as one way to markup your UI. The renderer primitives are a minimal, framework-agnostic alternative when you want explicit control or teaching-oriented examples.

### Runtime markups (configurable)

- The renderer can be paired with a "runtime markup". By default, interactive browser mode uses the JSX runtime automatically.
- You can explicitly choose or provide a custom runtime via `createRenderer({ runtimeMarkup })`.
- Built-in name: `"jsx"`.
- Custom markups can be created with `createRuntimeMarkup(name, apply)`.

#### Selecting a runtime markup

```ts
import { createRenderer } from "@in/renderer";

// Default (interactive browser): JSX is applied automatically
await createRenderer({ mode: "auto" });

// Explicit JSX selection
await createRenderer({ runtimeMarkup: "jsx" });

// Provide an inline applier
await createRenderer({ runtimeMarkup: (renderer) => {
  // connect your custom runtime to the renderer here
} });
```

#### Creating a custom runtime markup

```ts
import { createRuntimeMarkup } from "@in/renderer";

createRuntimeMarkup("sfc", (renderer) => {
  // install your SFC runtime hooks with the renderer
});

// later
await createRenderer({ runtimeMarkup: "sfc" });
```

> **Note:** Server/static renderers do not apply a runtime markup by default. Pass `runtimeMarkup` explicitly if you need one in those modes.

#### JSX Markups

According to Meta, the authors of the JSX concept:

*"JSX is an XML-like syntax extension to JavaScript without any defined semantics."*

The key takeaway here is that **JSX is not a standalone technology** it’s simply a templating syntax. InSpatial Kit adopts JSX as its **default templating runtime**, making it the foundation for building interfaces.


- **Retained Mode:** JSX markups are evaluated once to build the initial UI.
- **Pragma Transform::** Provides maximum flexibility. Requires configuring `jsxFactory: 'R.c'` and `jsxFragment: 'R.f'` in build tools (Vite, Babel). Components receive `R` as an argument.
- **Automatic Runtime:** Easier setup, but less flexible. Configures `jsx: 'automatic'` and `jsxImportSource: 'InSpatial'`.
- **Hot Reload:** Use `InVite` extension for vite-rollup/rolldown and `InPack` for webpack/rspack client development.

##### SFC Markups

Single File Component - coming soon...

Notes:

- Use `!` prefixed utilities (e.g., `!bg-*`) to give class utilities authority over variant-generated background colors.
- Prefer overriding at the row level (`<TableRow className="..." />`). Removing the conditional override restores the default zebra striping.


#### Creating your own runtime?

You can wire your own runtime by creating a markup and applying it through `createRenderer({ runtimeMarkup })`. For JSX, the explicit wrapper is `jsxRuntimeWrap(renderer)` from `@in/jsx-runtime`.