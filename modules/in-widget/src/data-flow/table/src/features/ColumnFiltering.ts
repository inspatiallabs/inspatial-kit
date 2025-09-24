import type { RowModel } from "../types.ts";
import { type BuiltInFilterFn, filterFns } from "../filterFns.ts";
import type {
  Column,
  FilterFns,
  FilterMeta,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
} from "../types.ts";
import { functionalUpdate, isFunction, makeStateUpdater } from "../utils.ts";

/*#####################################(TYPES)#####################################*/
export interface ColumnFiltersTableState {
  columnFilters: ColumnFiltersState;
}

export type ColumnFiltersState = ColumnFilter[];

export interface ColumnFilter {
  id: string;
  value: unknown;
}

export interface ResolvedColumnFilter<TData extends RowData> {
  filterFn: FilterFn<TData>;
  id: string;
  resolvedValue: unknown;
}

export interface FilterFn<TData extends RowData> {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: FilterMeta) => void
  ): boolean;
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>;
  resolveFilterValue?: TransformFilterValueFn<TData>;
}

export type TransformFilterValueFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>
) => unknown;

export type ColumnFilterAutoRemoveTestFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>
) => boolean;

export type CustomFilterFns<TData extends RowData> = Record<
  string,
  FilterFn<TData>
>;

export type FilterFnOption<TData extends RowData> =
  | "auto"
  | BuiltInFilterFn
  | keyof FilterFns
  | FilterFn<TData>;

export interface ColumnFiltersColumnDef<TData extends RowData> {
  enableColumnFilter?: boolean;

  filterFn?: FilterFnOption<TData>;
}

export interface ColumnFiltersColumn<TData extends RowData> {
  getAutoFilterFn: () => FilterFn<TData> | undefined;

  getCanFilter: () => boolean;

  getFilterFn: () => FilterFn<TData> | undefined;

  getFilterIndex: () => number;

  getFilterValue: () => unknown;

  getIsFiltered: () => boolean;

  setFilterValue: (updater: Updater<any>) => void;
}

export interface ColumnFiltersRow<TData extends RowData> {
  columnFilters: Record<string, boolean>;

  columnFiltersMeta: Record<string, FilterMeta>;
}

interface ColumnFiltersOptionsBase<TData extends RowData> {
  enableColumnFilters?: boolean;

  enableFilters?: boolean;

  filterFromLeafRows?: boolean;

  getFilteredRowModel?: (table: Table<any>) => () => RowModel<any>;

  manualFiltering?: boolean;

  maxLeafRowFilterDepth?: number;

  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

type ResolvedFilterFns = keyof FilterFns extends never
  ? {
      filterFns?: Record<string, FilterFn<any>>;
    }
  : {
      filterFns: Record<keyof FilterFns, FilterFn<any>>;
    };

export interface ColumnFiltersOptions<TData extends RowData>
  extends ColumnFiltersOptionsBase<TData>,
    ResolvedFilterFns {}

export interface ColumnFiltersInstance<TData extends RowData> {
  _getFilteredRowModel?: () => RowModel<TData>;

  getFilteredRowModel: () => RowModel<TData>;

  getPreFilteredRowModel: () => RowModel<TData>;

  resetColumnFilters: (defaultState?: boolean) => void;

  resetGlobalFilter: (defaultState?: boolean) => void;

  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;

  setGlobalFilter: (updater: Updater<any>) => void;
}

/*#####################################(COLUMN FILTERING)#####################################*/

export const ColumnFiltering: TableFeature = {
  getDefaultColumnDef: <
    TData extends RowData
  >(): ColumnFiltersColumnDef<TData> => {
    return {
      filterFn: "auto",
    };
  },

  getInitialState: (state): ColumnFiltersTableState => {
    return {
      columnFilters: [],
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnFiltersOptions<TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater("columnFilters", table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    } as ColumnFiltersOptions<TData>;
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getAutoFilterFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];

      const value = firstRow?.getValue(column.id);

      if (typeof value === "string") {
        return filterFns.includesString;
      }

      if (typeof value === "number") {
        return filterFns.inNumberRange;
      }

      if (typeof value === "boolean") {
        return filterFns.equals;
      }

      if (value !== null && typeof value === "object") {
        return filterFns.equals;
      }

      if (Array.isArray(value)) {
        return filterFns.arrIncludes;
      }

      return filterFns.weakEquals;
    };
    column.getFilterFn = () => {
      return isFunction(column.columnDef.filterFn)
        ? column.columnDef.filterFn
        : column.columnDef.filterFn === "auto"
        ? column.getAutoFilterFn()
        : // @ts-ignore
          table.options.filterFns?.[column.columnDef.filterFn as string] ??
          filterFns[column.columnDef.filterFn as BuiltInFilterFn];
    };
    column.getCanFilter = () => {
      return (
        (column.columnDef.enableColumnFilter ?? true) &&
        (table.options.enableColumnFilters ?? true) &&
        (table.options.enableFilters ?? true) &&
        !!column.accessorFn
      );
    };

    column.getIsFiltered = () => column.getFilterIndex() > -1;

    column.getFilterValue = () =>
      table.getState().columnFilters?.find((d) => d.id === column.id)?.value;

    column.getFilterIndex = () =>
      table.getState().columnFilters?.findIndex((d) => d.id === column.id) ??
      -1;

    column.setFilterValue = (value) => {
      table.setColumnFilters((old) => {
        const filterFn = column.getFilterFn();
        const previousFilter = old?.find((d) => d.id === column.id);

        const newFilter = functionalUpdate(
          value,
          previousFilter ? previousFilter.value : undefined
        );

        //
        if (
          shouldAutoRemoveFilter(filterFn as FilterFn<TData>, newFilter, column)
        ) {
          return old?.filter((d) => d.id !== column.id) ?? [];
        }

        const newFilterObj = { id: column.id, value: newFilter };

        if (previousFilter) {
          return (
            old?.map((d) => {
              if (d.id === column.id) {
                return newFilterObj;
              }
              return d;
            }) ?? []
          );
        }

        if (old?.length) {
          return [...old, newFilterObj];
        }

        return [newFilterObj];
      });
    };
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    _table: Table<TData>
  ): void => {
    row.columnFilters = {};
    row.columnFiltersMeta = {};
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnFilters = (updater: Updater<ColumnFiltersState>) => {
      const leafColumns = table.getAllLeafColumns();

      const updateFn = (old: ColumnFiltersState) => {
        return functionalUpdate(updater, old)?.filter((filter) => {
          const column = leafColumns.find((d) => d.id === filter.id);

          if (column) {
            const filterFn = column.getFilterFn();

            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
              return false;
            }
          }

          return true;
        });
      };

      table.options.onColumnFiltersChange?.(updateFn);
    };

    table.resetColumnFilters = (defaultState) => {
      table.setColumnFilters(
        defaultState ? [] : table.initialState?.columnFilters ?? []
      );
    };

    table.getPreFilteredRowModel = () => table.getCoreRowModel();
    table.getFilteredRowModel = () => {
      if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
        table._getFilteredRowModel = table.options.getFilteredRowModel(table);
      }

      if (table.options.manualFiltering || !table._getFilteredRowModel) {
        return table.getPreFilteredRowModel();
      }

      return table._getFilteredRowModel();
    };
  },
};

/*#####################################(HELPERS)#####################################*/
export function shouldAutoRemoveFilter<TData extends RowData>(
  filterFn?: FilterFn<TData>,
  value?: any,
  column?: Column<TData, unknown>
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === "undefined" ||
    (typeof value === "string" && !value)
  );
}
