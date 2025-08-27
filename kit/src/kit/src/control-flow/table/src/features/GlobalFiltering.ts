import { type BuiltInFilterFn, filterFns } from '../filterFns.ts'
import type {
  Column,
  OnChangeFn,
  Table,
  Updater,
  RowData,
  TableFeature,
} from '../types.ts'
import { isFunction, makeStateUpdater } from '../utils.ts'
import type { FilterFn, FilterFnOption } from "./ColumnFiltering.ts"

/*#######################################(TYPES)#######################################*/
export interface GlobalFilterTableState {
  globalFilter: any
}

export interface GlobalFilterColumnDef {
  enableGlobalFilter?: boolean
}

export interface GlobalFilterColumn {
  getCanGlobalFilter: () => boolean
}

export interface GlobalFilterOptions<TData extends RowData> {
  enableGlobalFilter?: boolean
  getColumnCanGlobalFilter?: (column: Column<TData, unknown>) => boolean
  globalFilterFn?: FilterFnOption<TData>
  onGlobalFilterChange?: OnChangeFn<any>
}

export interface GlobalFilterInstance<TData extends RowData> {
  getGlobalAutoFilterFn: () => FilterFn<TData> | undefined
  getGlobalFilterFn: () => FilterFn<TData> | undefined
  resetGlobalFilter: (defaultState?: boolean) => void
  setGlobalFilter: (updater: Updater<any>) => void
}

/*#######################################(GLOBAL FILTERING)#######################################*/
export const GlobalFiltering: TableFeature = {
  getInitialState: (state): GlobalFilterTableState => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GlobalFilterOptions<TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    } as GlobalFilterOptions<TData>
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getCanGlobalFilter = () => {
      return (
        (column.columnDef.enableGlobalFilter ?? true) &&
        (table.options.enableGlobalFilter ?? true) &&
        (table.options.enableFilters ?? true) &&
        (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
        !!column.accessorFn
      )
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGlobalAutoFilterFn = () => {
      return filterFns.includesString
    }

    table.getGlobalFilterFn = () => {
      const { globalFilterFn: globalFilterFn } = table.options

      return isFunction(globalFilterFn)
        ? globalFilterFn
        : globalFilterFn === 'auto'
          ? table.getGlobalAutoFilterFn()
          : table.options.filterFns?.[globalFilterFn as string] ??
            filterFns[globalFilterFn as BuiltInFilterFn]
    }

    table.setGlobalFilter = updater => {
      table.options.onGlobalFilterChange?.(updater)
    }

    table.resetGlobalFilter = defaultState => {
      table.setGlobalFilter(
        defaultState ? undefined : table.initialState.globalFilter
      )
    }
  },
}
