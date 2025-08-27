import type { RowData, Cell, Row, Table } from "../types.ts";
import { flattenBy, getMemoOptions, memo } from "../utils.ts";
import { createCell } from "./cell.ts";

/*#####################################(TYPES)#####################################*/
export interface CoreRow<TData extends RowData> {
  _getAllCellsByColumnId: () => Record<string, Cell<TData, unknown>>;
  _uniqueValuesCache: Record<string, unknown>;
  _valuesCache: Record<string, unknown>;

  depth: number;

  getAllCells: () => Cell<TData, unknown>[];

  getLeafRows: () => Row<TData>[];

  getParentRow: () => Row<TData> | undefined;

  getParentRows: () => Row<TData>[];

  getUniqueValues: <TValue>(columnId: string) => TValue[];

  getValue: <TValue>(columnId: string) => TValue;

  id: string;

  index: number;

  original: TData;

  originalSubRows?: TData[];

  parentId?: string;

  renderValue: <TValue>(columnId: string) => TValue;

  subRows: Row<TData>[];
}

/*#####################################(CREATE ROW)#####################################*/
export const createRow = <TData extends RowData>(
  table: Table<TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Row<TData>[],
  parentId?: string
): Row<TData> => {
  let row: CoreRow<TData> = {
    id,
    index: rowIndex,
    original,
    depth,
    parentId,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (columnId) => {
      // deno-lint-ignore no-prototype-builtins
      if (row._valuesCache.hasOwnProperty(columnId)) {
        return row._valuesCache[columnId];
      }

      const column = table.getColumn(columnId);

      if (!column?.accessorFn) {
        return undefined;
      }

      row._valuesCache[columnId] = column.accessorFn(
        row.original as TData,
        rowIndex
      );

      return row._valuesCache[columnId] as any;
    },
    getUniqueValues: (columnId) => {
      // deno-lint-ignore no-prototype-builtins
      if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
        return row._uniqueValuesCache[columnId];
      }

      const column = table.getColumn(columnId);

      if (!column?.accessorFn) {
        return undefined;
      }

      if (!column.columnDef.getUniqueValues) {
        row._uniqueValuesCache[columnId] = [row.getValue(columnId)];
        return row._uniqueValuesCache[columnId];
      }

      row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
        row.original as TData,
        rowIndex
      );

      return row._uniqueValuesCache[columnId] as any;
    },
    renderValue: (columnId) =>
      row.getValue(columnId) ?? table.options.renderFallbackValue,
    subRows: subRows ?? [],
    getLeafRows: () => flattenBy(row.subRows, (d) => d.subRows),
    getParentRow: () =>
      row.parentId ? table.getRow(row.parentId, true) : undefined,
    getParentRows: () => {
      let parentRows: Row<TData>[] = [];
      let currentRow = row;
      while (true) {
        const parentRow = currentRow.getParentRow();
        if (!parentRow) break;
        parentRows.push(parentRow);
        currentRow = parentRow;
      }
      return parentRows.reverse();
    },
    getAllCells: memo(
      () => [table.getAllLeafColumns()],
      (leafColumns) => {
        return leafColumns.map((column) => {
          return createCell(table, row as Row<TData>, column, column.id);
        });
      },
      getMemoOptions(table.options, "debugRows", "getAllCells")
    ),

    _getAllCellsByColumnId: memo(
      () => [row.getAllCells()],
      (allCells) => {
        return allCells.reduce((acc, cell) => {
          acc[cell.column.id] = cell;
          return acc;
        }, {} as Record<string, Cell<TData, unknown>>);
      },
      getMemoOptions(table.options, "debugRows", "getAllCellsByColumnId")
    ),
  };

  for (let i = 0; i < table._features.length; i++) {
    const feature = table._features[i];
    feature?.createRow?.(row as Row<TData>, table);
  }

  return row as Row<TData>;
};
