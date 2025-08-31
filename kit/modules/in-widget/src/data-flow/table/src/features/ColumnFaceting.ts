import type { RowModel } from "../types.ts";
import type { Column, RowData, Table, TableFeature } from "../types.ts";

/*#####################################(TYPES)#####################################*/

export interface FacetedColumn<TData extends RowData> {
  _getFacetedMinMaxValues?: () => undefined | [number, number];
  _getFacetedRowModel?: () => RowModel<TData>;
  _getFacetedUniqueValues?: () => Map<any, number>;

  getFacetedMinMaxValues: () => undefined | [number, number];

  getFacetedRowModel: () => RowModel<TData>;

  getFacetedUniqueValues: () => Map<any, number>;
}

export interface FacetedOptions<TData extends RowData> {
  getFacetedMinMaxValues?: (
    table: Table<TData>,
    columnId: string
  ) => () => undefined | [number, number];
  getFacetedRowModel?: (
    table: Table<TData>,
    columnId: string
  ) => () => RowModel<TData>;
  getFacetedUniqueValues?: (
    table: Table<TData>,
    columnId: string
  ) => () => Map<any, number>;
}

/*#####################################(COLUMN FACETING)#####################################*/

export const ColumnFaceting: TableFeature = {
  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column._getFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, column.id);
    column.getFacetedRowModel = () => {
      if (!column._getFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }

      return column._getFacetedRowModel();
    };
    column._getFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, column.id);
    column.getFacetedUniqueValues = () => {
      if (!column._getFacetedUniqueValues) {
        return new Map();
      }

      return column._getFacetedUniqueValues();
    };
    column._getFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, column.id);
    column.getFacetedMinMaxValues = () => {
      if (!column._getFacetedMinMaxValues) {
        return undefined;
      }

      return column._getFacetedMinMaxValues();
    };
  },
};
