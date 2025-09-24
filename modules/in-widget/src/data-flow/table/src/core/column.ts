import { env } from "@in/vader/env";
import type {
  Column,
  Table,
  AccessorFn,
  ColumnDef,
  RowData,
  ColumnDefResolved,
} from "../types.ts";
import { getMemoOptions, memo } from "../utils.ts";

export interface CoreColumn<TData extends RowData, TValue> {
  accessorFn?: AccessorFn<TData, TValue>;

  columnDef: ColumnDef<TData, TValue>;

  columns: Column<TData, TValue>[];

  depth: number;

  getFlatColumns: () => Column<TData, TValue>[];

  getLeafColumns: () => Column<TData, TValue>[];

  id: string;

  parent?: Column<TData, TValue>;
}

export function createColumn<TData extends RowData, TValue>(
  table: Table<TData>,
  columnDef: ColumnDef<TData, TValue>,
  depth: number,
  parent?: Column<TData, TValue>
): Column<TData, TValue> {
  const defaultColumn = table._getDefaultColumnDef();

  const resolvedColumnDef = {
    ...defaultColumn,
    ...columnDef,
  } as ColumnDefResolved<TData>;

  const accessorKey = resolvedColumnDef.accessorKey;

  let id =
    resolvedColumnDef.id ??
    (accessorKey
      ? typeof String.prototype.replaceAll === "function"
        ? accessorKey.replaceAll(".", "_")
        : accessorKey.replace(/\./g, "_")
      : undefined) ??
    (typeof resolvedColumnDef.header === "string"
      ? resolvedColumnDef.header
      : undefined);

  let accessorFn: AccessorFn<TData> | undefined;

  if (resolvedColumnDef.accessorFn) {
    accessorFn = resolvedColumnDef.accessorFn;
  } else if (accessorKey) {
    // Support deep accessor keys
    if (accessorKey.includes(".")) {
      accessorFn = (originalRow: TData) => {
        let result = originalRow as Record<string, any>;

        for (const key of accessorKey.split(".")) {
          result = result?.[key];
          if (!env.isProduction && result === undefined) {
            console.warn(
              `"${key}" in deeply nested key "${accessorKey}" returned undefined.`
            );
          }
        }

        return result;
      };
    } else {
      accessorFn = (originalRow: TData) =>
        (originalRow as any)[resolvedColumnDef.accessorKey];
    }
  }

  if (!id) {
    if (!env.isProduction) {
      throw new Error(
        resolvedColumnDef.accessorFn
          ? `Columns require an id when using an accessorFn`
          : `Columns require an id when using a non-string header`
      );
    }
    throw new Error();
  }

  let column: CoreColumn<TData, any> = {
    id: `${String(id)}`,
    accessorFn,
    parent: parent as any,
    depth,
    columnDef: resolvedColumnDef as ColumnDef<TData, any>,
    columns: [],
    getFlatColumns: memo(
      () => [true],
      () => {
        return [
          column as Column<TData, TValue>,
          ...column.columns?.flatMap((d) => d.getFlatColumns()),
        ];
      },
      getMemoOptions(table.options, "debugColumns", "column.getFlatColumns")
    ),
    getLeafColumns: memo(
      () => [table._getOrderColumnsFn()],
      (orderColumns) => {
        if (column.columns?.length) {
          let leafColumns = column.columns.flatMap((column) =>
            column.getLeafColumns()
          );

          return orderColumns(leafColumns);
        }

        return [column as Column<TData, TValue>];
      },
      getMemoOptions(table.options, "debugColumns", "column.getLeafColumns")
    ),
  };

  for (const feature of table._features) {
    feature.createColumn?.(column as Column<TData, TValue>, table);
  }

  // Yes, we have to convert table to unknown, because we know more than the compiler here.
  return column as Column<TData, TValue>;
}
