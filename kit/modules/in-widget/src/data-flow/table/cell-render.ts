import { createComponent } from "@in/widget/component/index.ts";

function toErgonomicCellProps(ctx: any): any | null {
  if (!ctx) return null;
  const row = ctx.row;
  const original = row?.original ?? row;
  let value =
    typeof ctx.getValue === "function"
      ? ctx.getValue()
      : ctx.cell?.getValue?.();
  if (value === undefined && row && ctx.column?.id) {
    // Fallback to property lookup by column id (accessorKey case)
    try {
      value = (original as any)?.[ctx.column.id];
    } catch {}
  }

  if (row || value !== undefined) {
    // Merge ergonomic aliases with the original TanStack context.
    // Important: do NOT overwrite ctx.row. Keep Row<TData> intact for native usage.
    return {
      ...ctx,
      value,
      original,
      index: row?.index,
      id: row?.id,
    };
  }
  return null;
}

export function cellRender<TProps>(
  Comp: ((props: TProps) => any) | any,
  props: TProps
): any {
  if (!Comp) return null;

  if (typeof Comp === "function") {
    // Map TanStack CellContext to merged props (native + ergonomic aliases)
    const merged = toErgonomicCellProps(props) ?? props;
    const result = Comp(merged as TProps);
    // If the result is a plain value (string, number, etc), return it directly
    if (
      typeof result === "string" ||
      typeof result === "number" ||
      typeof result === "boolean"
    ) {
      return result;
    }
    // If it's a JSX element, wrap it with createComponent
    if (result && typeof result === "object" && result.$$typeof) {
      return createComponent(() => result, {});
    }
    return result;
  }

  // If Comp is a plain value, return it directly
  if (
    typeof Comp === "string" ||
    typeof Comp === "number" ||
    typeof Comp === "boolean"
  ) {
    return Comp;
  }

  return Comp;
}
