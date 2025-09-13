# Rendering

### DOM Renderer

See the [InDOM Renderer](./dom.md) for setup, usage, and API details.

### GPU Renderer

See the [InGPU Renderer](./gpu.md) for setup, usage, and API details.

### Tauri Renderer

See the [InTauri Renderer](./tauri.md) for setup, usage, and API details.

### NativeScript Renderer

See the [InNativeScript Renderer](./nativescript.md) for setup, usage, and API details.

### VisionOS Renderer

See the [InVisionOS Renderer](./vision-os.md) for setup, usage, and API details.

### AndroidXR Renderer

See the [InAndroidXR Renderer](./android-xr.md) for setup, usage, and API details.

### HorizonOS Renderer

See the [InHorizonOS Renderer](./horizon-os.md) for setup, usage, and API details.

### SSR Renderer

See the [InSSR Renderer](./ssr.md) for setup, usage, and API details.

## Render targets - "Use Directives"

InSpatial allows you to switch between renderers with directives, because all InSpatial Kit components and widgets are built for different platforms e.g `button.dom.tsx`, `button.gpu.tsx` etc... You can easily switch the render targets by declaring the following directive at the beginning of your `window.tsx` or `scene.tsx` files.

### For `window.tsx` Views

- **"use native":** universal defaults this is the default directive and is what is auto attached to every .tsx file if no directive is declared. This will auto use the appropraite renderer based on detected environment.
- **"use dom":**
- **"use gpu":**
- **"use ios:"**
- **"use visionos:"**
- **"use android:"**
- **"use androidxr:"**
- **"use horizonos:"**
- **"use ssr:"**

### For `scene.tsx` Views

- **"use volumentric":** for 3d scenes
- **"use ar":** for augmented reality scenes
- **"use vr":** for virtual reality scenes
- **"use mr":** for mixed reality scenes

## Composing components with renderer primitives

InSpatial lets you compose UI with primitive render functions. The `Fn` control-flow returns a render function that receives a low-level renderer `R`. Using `R.c` (create element) and `R.text` (create text).

**Terminology**

    `R` -> Renderer
    `c` -> Create Element
    `f` -> Fragment

    R.c -> renderer.createElement
    R.f -> renderer.fragment

Below is an example of how to compose a component via renderer primitives and a template runtime i.e (JSX).

```typescript
import {
  Fn,
  useTable,
  type ColumnDef,
  getCoreRowModel,
} from "@inspatial/kit/control-flow";

export type PrimitiveTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
};

export function PrimitiveTable<TData>({
  columns,
  data,
}: PrimitiveTableProps<TData>) {
  return Fn({ name: "PrimitiveTable" }, () => {
    const { table } = useTable<TData>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (R: any) => {
      const headerGroups = table.getHeaderGroups();
      const rows = table.getRowModel().rows;

      return R.c(
        "div",
        { style: { width: "100%", padding: "8px" } },
        R.c(
          "div",
          { style: { marginBottom: "8px", fontSize: "12px", color: "#667" } },
          R.text(`PrimitiveTable • data: ${data.length} • rows: ${rows.length}`)
        ),
        R.c(
          "table",
          { style: { width: "100%", borderCollapse: "collapse" } },
          R.c(
            "thead",
            {},
            ...headerGroups.map((hg) =>
              R.c(
                "tr",
                { key: hg.id },
                ...hg.headers.map((h) =>
                  R.c(
                    "th",
                    {
                      key: h.id,
                      style: {
                        textAlign: "left",
                        borderBottom: "2px solid var(--muted)",
                        padding: "8px 12px",
                      },
                    },
                    h.isPlaceholder
                      ? null
                      : R.text(
                          String(
                            (h.column.columnDef as any).header ?? h.column.id
                          )
                        )
                  )
                )
              )
            )
          ),
          R.c(
            "tbody",
            {},
            ...rows.map((row, idx) =>
              R.c(
                "tr",
                { key: String((row.original as any)?.id ?? row.id ?? idx) },
                ...row.getVisibleCells().map((cell) =>
                  R.c(
                    "td",
                    {
                      key: cell.id,
                      style: {
                        padding: "8px 12px",
                        borderBottom: "1px solid var(--muted)",
                      },
                    },
                    (() => {
                      const cellDef = cell.column.columnDef as any;
                      if (typeof cellDef.cell === "function") {
                        const result = cellDef.cell(cell.getContext());
                        return R.text(String(result ?? cell.getValue()));
                      }
                      return R.text(String(cell.getValue()));
                    })()
                  )
                )
              )
            )
          )
        )
      );
    };
  });
}
```
