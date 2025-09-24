import type { RowData, Cell, Column, Row, Table } from "../types.ts";
import { type Getter, getMemoOptions, memo } from "../utils.ts";

/*#####################################(TYPES)#####################################*/
export interface CellContext<TData extends RowData, TValue> {
  cell: Cell<TData, TValue>;
  column: Column<TData, TValue>;
  getValue: Getter<TValue>;
  renderValue: Getter<TValue | null>;
  row: Row<TData>;
  table: Table<TData>;
}

export interface CoreCell<TData extends RowData, TValue> {
  column: Column<TData, TValue>;

  getContext: () => CellContext<TData, TValue>;

  getValue: CellContext<TData, TValue>["getValue"];

  id: string;

  renderValue: CellContext<TData, TValue>["renderValue"];

  row: Row<TData>;
}

/*#####################################(CREATE CELL)#####################################*/
export function createCell<TData extends RowData, TValue>(
  table: Table<TData>,
  row: Row<TData>,
  column: Column<TData, TValue>,
  columnId: string
): Cell<TData, TValue> {
  const getRenderValue = () =>
    cell.getValue() ?? table.options.renderFallbackValue;

  const cell: CoreCell<TData, TValue> = {
    id: `${row.id}_${column.id}`,
    row,
    column,
    getValue: () => row.getValue(columnId),
    renderValue: getRenderValue,
    getContext: memo(
      () => [table, column, row, cell],
      (table, column, row, cell) => ({
        table,
        column,
        row,
        cell: cell as Cell<TData, TValue>,
        getValue: cell.getValue,
        renderValue: cell.renderValue,
      }),
      getMemoOptions(table.options, "debugCells", "cell.getContext")
    ),
  };

  table._features.forEach((feature) => {
    feature.createCell?.(
      cell as Cell<TData, TValue>,
      column,
      row as Row<TData>,
      table
    );
  }, {});

  return cell as Cell<TData, TValue>;
}
