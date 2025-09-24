import { getMemoOptions, makeStateUpdater, memo } from "../utils.ts";

import type {
  Column,
  OnChangeFn,
  RowData,
  Table,
  TableFeature,
  Updater,
} from "../types.ts";

import { orderColumns } from "./ColumnGrouping.ts";
import type { ColumnPinningPosition } from "./ColumnPinning.ts";
import { _getVisibleLeafColumns } from "./ColumnVisibility.ts";

/*#####################################(TYPES)#####################################*/
export interface ColumnOrderTableState {
  columnOrder: ColumnOrderState;
}

export type ColumnOrderState = string[];

export interface ColumnOrderOptions {
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
}

export interface ColumnOrderColumn {
  getIndex: (position?: ColumnPinningPosition | "center") => number;

  getIsFirstColumn: (position?: ColumnPinningPosition | "center") => boolean;

  getIsLastColumn: (position?: ColumnPinningPosition | "center") => boolean;
}

export interface ColumnOrderDefaultOptions {
  onColumnOrderChange: OnChangeFn<ColumnOrderState>;
}

export interface ColumnOrderInstance<TData extends RowData> {
  _getOrderColumnsFn: () => (
    columns: Column<TData, unknown>[]
  ) => Column<TData, unknown>[];

  resetColumnOrder: (defaultState?: boolean) => void;

  setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
}

/*#####################################(COLUMN ORDERING)#####################################*/

export const ColumnOrdering: TableFeature = {
  getInitialState: (state): ColumnOrderTableState => {
    return {
      columnOrder: [],
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnOrderDefaultOptions => {
    return {
      onColumnOrderChange: makeStateUpdater("columnOrder", table),
    };
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getIndex = memo(
      (position) => [_getVisibleLeafColumns(table, position)],
      (columns) => columns.findIndex((d) => d.id === column.id),
      getMemoOptions(table.options, "debugColumns", "getIndex")
    );
    column.getIsFirstColumn = (position) => {
      const columns = _getVisibleLeafColumns(table, position);
      return columns[0]?.id === column.id;
    };
    column.getIsLastColumn = (position) => {
      const columns = _getVisibleLeafColumns(table, position);
      return columns[columns.length - 1]?.id === column.id;
    };
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnOrder = (updater) =>
      table.options.onColumnOrderChange?.(updater);
    table.resetColumnOrder = (defaultState) => {
      table.setColumnOrder(
        defaultState ? [] : table.initialState.columnOrder ?? []
      );
    };
    table._getOrderColumnsFn = memo(
      () => [
        table.getState().columnOrder,
        table.getState().grouping,
        table.options.groupedColumnMode,
      ],
      (columnOrder, grouping, groupedColumnMode) =>
        (columns: Column<TData, unknown>[]) => {
          // Sort grouped columns to the start of the column list
          // before the headers are built
          let orderedColumns: Column<TData, unknown>[] = [];

          // If there is no order, return the normal columns
          if (!columnOrder?.length) {
            orderedColumns = columns;
          } else {
            const columnOrderCopy = [...columnOrder];

            // If there is an order, make a copy of the columns
            const columnsCopy = [...columns];

            // And make a new ordered array of the columns

            // Loop over the columns and place them in order into the new array
            while (columnsCopy.length && columnOrderCopy.length) {
              const targetColumnId = columnOrderCopy.shift();
              const foundIndex = columnsCopy.findIndex(
                (d) => d.id === targetColumnId
              );
              if (foundIndex > -1) {
                orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]!);
              }
            }

            // If there are any columns left, add them to the end
            orderedColumns = [...orderedColumns, ...columnsCopy];
          }

          return orderColumns(orderedColumns, grouping, groupedColumnMode);
        },
      getMemoOptions(table.options, "debugTable", "_getOrderColumnsFn")
    );
  },
};
