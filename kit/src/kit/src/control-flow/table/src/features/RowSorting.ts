import { RowModel } from '../types.ts'
import {
  BuiltInSortingFn,
  reSplitAlphaNumeric,
  sortingFns,
} from '../sortingFns.ts'

import {
  Column,
  OnChangeFn,
  Table,
  Row,
  Updater,
  RowData,
  SortingFns,
  TableFeature,
} from '../types.ts'

import { isFunction, makeStateUpdater } from '../utils.ts'

export type SortDirection = 'asc' | 'desc'

export interface ColumnSort {
  desc: boolean
  id: string
}

export type SortingState = ColumnSort[]

export interface SortingTableState {
  sorting: SortingState
}

export interface SortingFn<TData extends RowData> {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}

export type CustomSortingFns<TData extends RowData> = Record<
  string,
  SortingFn<TData>
>

export type SortingFnOption<TData extends RowData> =
  | 'auto'
  | keyof SortingFns
  | BuiltInSortingFn
  | SortingFn<TData>

export interface SortingColumnDef<TData extends RowData> {
  
  enableMultiSort?: boolean
  
  enableSorting?: boolean
  
  invertSorting?: boolean
  
  sortDescFirst?: boolean
  
  sortingFn?: SortingFnOption<TData>
  
  sortUndefined?: false | -1 | 1 | 'first' | 'last'
}

export interface SortingColumn<TData extends RowData> {
  
  clearSorting: () => void
  
  getAutoSortDir: () => SortDirection
  
  getAutoSortingFn: () => SortingFn<TData>
  
  getCanMultiSort: () => boolean
  
  getCanSort: () => boolean
  
  getFirstSortDir: () => SortDirection
  
  getIsSorted: () => false | SortDirection
  
  getNextSortingOrder: () => SortDirection | false
  
  getSortIndex: () => number
  
  getSortingFn: () => SortingFn<TData>
  
  getToggleSortingHandler: () => undefined | ((event: unknown) => void)
  
  toggleSorting: (desc?: boolean, isMulti?: boolean) => void
}

interface SortingOptionsBase {
  
  enableMultiRemove?: boolean
  
  enableMultiSort?: boolean
  
  enableSorting?: boolean
  
  enableSortingRemoval?: boolean
  
  getSortedRowModel?: (table: Table<any>) => () => RowModel<any>
  
  isMultiSortEvent?: (e: unknown) => boolean
  
  manualSorting?: boolean
  
  maxMultiSortColCount?: number
  
  onSortingChange?: OnChangeFn<SortingState>
  
  sortDescFirst?: boolean
}

type ResolvedSortingFns = keyof SortingFns extends never
  ? {
      sortingFns?: Record<string, SortingFn<any>>
    }
  : {
      sortingFns: Record<keyof SortingFns, SortingFn<any>>
    }

export interface SortingOptions<TData extends RowData>
  extends SortingOptionsBase,
    ResolvedSortingFns {}

export interface SortingInstance<TData extends RowData> {
  _getSortedRowModel?: () => RowModel<TData>
  
  getPreSortedRowModel: () => RowModel<TData>
  
  getSortedRowModel: () => RowModel<TData>
  
  resetSorting: (defaultState?: boolean) => void
  
  setSorting: (updater: Updater<SortingState>) => void
}

export const RowSorting: TableFeature = {
  getInitialState: (state): SortingTableState => {
    return {
      sorting: [],
      ...state,
    }
  },

  getDefaultColumnDef: <TData extends RowData>(): SortingColumnDef<TData> => {
    return {
      sortingFn: 'auto',
      sortUndefined: 1,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): SortingOptions<TData> => {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getAutoSortingFn = () => {
      const firstRows = table.getFilteredRowModel().flatRows.slice(10)

      let isString = false

      for (const row of firstRows) {
        const value = row?.getValue(column.id)

        if (Object.prototype.toString.call(value) === '[object Date]') {
          return sortingFns.datetime
        }

        if (typeof value === 'string') {
          isString = true

          if (value.split(reSplitAlphaNumeric).length > 1) {
            return sortingFns.alphanumeric
          }
        }
      }

      if (isString) {
        return sortingFns.text
      }

      return sortingFns.basic
    }
    column.getAutoSortDir = () => {
      const firstRow = table.getFilteredRowModel().flatRows[0]

      const value = firstRow?.getValue(column.id)

      if (typeof value === 'string') {
        return 'asc'
      }

      return 'desc'
    }
    column.getSortingFn = () => {
      if (!column) {
        throw new Error()
      }

      return isFunction(column.columnDef.sortingFn)
        ? column.columnDef.sortingFn
        : column.columnDef.sortingFn === 'auto'
          ? column.getAutoSortingFn()
          : table.options.sortingFns?.[column.columnDef.sortingFn as string] ??
            sortingFns[column.columnDef.sortingFn as BuiltInSortingFn]
    }
    column.toggleSorting = (desc, multi) => {

      const nextSortingOrder = column.getNextSortingOrder()
      const hasManualValue = typeof desc !== 'undefined' && desc !== null

      table.setSorting(old => {

        const existingSorting = old?.find(d => d.id === column.id)
        const existingIndex = old?.findIndex(d => d.id === column.id)

        let newSorting: SortingState = []

        let sortAction: 'add' | 'remove' | 'toggle' | 'replace'
        let nextDesc = hasManualValue ? desc : nextSortingOrder === 'desc'

        if (old?.length && column.getCanMultiSort() && multi) {
          if (existingSorting) {
            sortAction = 'toggle'
          } else {
            sortAction = 'add'
          }
        } else {

          if (old?.length && existingIndex !== old.length - 1) {
            sortAction = 'replace'
          } else if (existingSorting) {
            sortAction = 'toggle'
          } else {
            sortAction = 'replace'
          }
        }

        if (sortAction === 'toggle') {

          if (!hasManualValue) {

            if (!nextSortingOrder) {
              sortAction = 'remove'
            }
          }
        }

        if (sortAction === 'add') {
          newSorting = [
            ...old,
            {
              id: column.id,
              desc: nextDesc,
            },
          ]

          newSorting.splice(
            0,
            newSorting.length -
              (table.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER)
          )
        } else if (sortAction === 'toggle') {

          newSorting = old.map(d => {
            if (d.id === column.id) {
              return {
                ...d,
                desc: nextDesc,
              }
            }
            return d
          })
        } else if (sortAction === 'remove') {
          newSorting = old.filter(d => d.id !== column.id)
        } else {
          newSorting = [
            {
              id: column.id,
              desc: nextDesc,
            },
          ]
        }

        return newSorting
      })
    }

    column.getFirstSortDir = () => {
      const sortDescFirst =
        column.columnDef.sortDescFirst ??
        table.options.sortDescFirst ??
        column.getAutoSortDir() === 'desc'
      return sortDescFirst ? 'desc' : 'asc'
    }

    column.getNextSortingOrder = (multi?: boolean) => {
      const firstSortDirection = column.getFirstSortDir()
      const isSorted = column.getIsSorted()

      if (!isSorted) {
        return firstSortDirection
      }

      if (
        isSorted !== firstSortDirection &&
        (table.options.enableSortingRemoval ?? true) && // If enableSortRemove, enable in general
        (multi ? table.options.enableMultiRemove ?? true : true) // If multi, don't allow if enableMultiRemove))
      ) {
        return false
      }
      return isSorted === 'desc' ? 'asc' : 'desc'
    }

    column.getCanSort = () => {
      return (
        (column.columnDef.enableSorting ?? true) &&
        (table.options.enableSorting ?? true) &&
        !!column.accessorFn
      )
    }

    column.getCanMultiSort = () => {
      return (
        column.columnDef.enableMultiSort ??
        table.options.enableMultiSort ??
        !!column.accessorFn
      )
    }

    column.getIsSorted = () => {
      const columnSort = table.getState().sorting?.find(d => d.id === column.id)

      return !columnSort ? false : columnSort.desc ? 'desc' : 'asc'
    }

    column.getSortIndex = () =>
      table.getState().sorting?.findIndex(d => d.id === column.id) ?? -1

    column.clearSorting = () => {

      table.setSorting(old =>
        old?.length ? old.filter(d => d.id !== column.id) : []
      )
    }

    column.getToggleSortingHandler = () => {
      const canSort = column.getCanSort()

      return (e: unknown) => {
        if (!canSort) return
        ;(e as any).persist?.()
        column.toggleSorting?.(
          undefined,
          column.getCanMultiSort() ? table.options.isMultiSortEvent?.(e) : false
        )
      }
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setSorting = updater => table.options.onSortingChange?.(updater)
    table.resetSorting = defaultState => {
      table.setSorting(defaultState ? [] : table.initialState?.sorting ?? [])
    }
    table.getPreSortedRowModel = () => table.getGroupedRowModel()
    table.getSortedRowModel = () => {
      if (!table._getSortedRowModel && table.options.getSortedRowModel) {
        table._getSortedRowModel = table.options.getSortedRowModel(table)
      }

      if (table.options.manualSorting || !table._getSortedRowModel) {
        return table.getPreSortedRowModel()
      }

      return table._getSortedRowModel()
    }
  },
}
