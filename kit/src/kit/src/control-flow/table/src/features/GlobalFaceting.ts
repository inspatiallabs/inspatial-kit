import type { Table, RowData, TableFeature, RowModel } from "../types.ts";

/*#######################################(TYPES)#######################################*/

export interface GlobalFacetingInstance<TData extends RowData> {
  _getGlobalFacetedMinMaxValues?: () => undefined | [number, number];
  _getGlobalFacetedRowModel?: () => RowModel<TData>;
  _getGlobalFacetedUniqueValues?: () => Map<any, number>;

  getGlobalFacetedMinMaxValues: () => undefined | [number, number];

  getGlobalFacetedRowModel: () => RowModel<TData>;

  getGlobalFacetedUniqueValues: () => Map<any, number>;
}

/*#######################################(GLOBAL FACETING)#######################################*/

export const GlobalFaceting: TableFeature = {
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table._getGlobalFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, "__global__");

    table.getGlobalFacetedRowModel = () => {
      if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
        return table.getPreFilteredRowModel();
      }

      return table._getGlobalFacetedRowModel();
    };

    table._getGlobalFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, "__global__");
    table.getGlobalFacetedUniqueValues = () => {
      if (!table._getGlobalFacetedUniqueValues) {
        return new Map();
      }

      return table._getGlobalFacetedUniqueValues();
    };

    table._getGlobalFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, "__global__");
    table.getGlobalFacetedMinMaxValues = () => {
      if (!table._getGlobalFacetedMinMaxValues) {
        return;
      }

      return table._getGlobalFacetedMinMaxValues();
    };
  },
};
