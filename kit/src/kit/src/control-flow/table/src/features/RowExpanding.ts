import { RowModel } from '../types.ts'
import {
  OnChangeFn,
  Table,
  Row,
  Updater,
  RowData,
  TableFeature,
} from '../types.ts'
import { makeStateUpdater } from '../utils.ts'

export type ExpandedStateList = Record<string, boolean>
export type ExpandedState = true | Record<string, boolean>
export interface ExpandedTableState {
  expanded: ExpandedState
}

export interface ExpandedRow {
  getCanExpand: () => boolean
  getIsAllParentsExpanded: () => boolean
  getIsExpanded: () => boolean
  getToggleExpandedHandler: () => () => void
  toggleExpanded: (expanded?: boolean) => void
}

export interface ExpandedOptions<TData extends RowData> {
  autoResetExpanded?: boolean
  enableExpanding?: boolean
  getExpandedRowModel?: (table: Table<any>) => () => RowModel<any>
  getIsRowExpanded?: (row: Row<TData>) => boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  manualExpanding?: boolean
  onExpandedChange?: OnChangeFn<ExpandedState>
  paginateExpandedRows?: boolean
}

export interface ExpandedInstance<TData extends RowData> {
  _autoResetExpanded: () => void
  _getExpandedRowModel?: () => RowModel<TData>
  getCanSomeRowsExpand: () => boolean
  getExpandedDepth: () => number
  getExpandedRowModel: () => RowModel<TData>
  getIsAllRowsExpanded: () => boolean
  getIsSomeRowsExpanded: () => boolean
  getPreExpandedRowModel: () => RowModel<TData>
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  resetExpanded: (defaultState?: boolean) => void
  setExpanded: (updater: Updater<ExpandedState>) => void
  toggleAllRowsExpanded: (expanded?: boolean) => void
}

export const RowExpanding: TableFeature = {
  getInitialState: (state): ExpandedTableState => {
    return {
      expanded: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ExpandedOptions<TData> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    let registered = false
    let queued = false

    table._autoResetExpanded = () => {
      if (!registered) {
        table._queue(() => {
          registered = true
        })
        return
      }

      if (
        table.options.autoResetAll ??
        table.options.autoResetExpanded ??
        !table.options.manualExpanding
      ) {
        if (queued) return
        queued = true
        table._queue(() => {
          table.resetExpanded()
          queued = false
        })
      }
    }
    table.setExpanded = updater => table.options.onExpandedChange?.(updater)
    table.toggleAllRowsExpanded = expanded => {
      if (expanded ?? !table.getIsAllRowsExpanded()) {
        table.setExpanded(true)
      } else {
        table.setExpanded({})
      }
    }
    table.resetExpanded = defaultState => {
      table.setExpanded(defaultState ? {} : table.initialState?.expanded ?? {})
    }
    table.getCanSomeRowsExpand = () => {
      return table
        .getPrePaginationRowModel()
        .flatRows.some(row => row.getCanExpand())
    }
    table.getToggleAllRowsExpandedHandler = () => {
      return (e: unknown) => {
        ;(e as any).persist?.()
        table.toggleAllRowsExpanded()
      }
    }
    table.getIsSomeRowsExpanded = () => {
      const expanded = table.getState().expanded
      return expanded === true || Object.values(expanded).some(Boolean)
    }
    table.getIsAllRowsExpanded = () => {
      const expanded = table.getState().expanded


      if (typeof expanded === 'boolean') {
        return expanded === true
      }

      if (!Object.keys(expanded).length) {
        return false
      }


      if (table.getRowModel().flatRows.some(row => !row.getIsExpanded())) {
        return false
      }


      return true
    }
    table.getExpandedDepth = () => {
      let maxDepth = 0

      const rowIds =
        table.getState().expanded === true
          ? Object.keys(table.getRowModel().rowsById)
          : Object.keys(table.getState().expanded)

      rowIds.forEach(id => {
        const splitId = id.split('.')
        maxDepth = Math.max(maxDepth, splitId.length)
      })

      return maxDepth
    }
    table.getPreExpandedRowModel = () => table.getSortedRowModel()
    table.getExpandedRowModel = () => {
      if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
        table._getExpandedRowModel = table.options.getExpandedRowModel(table)
      }

      if (table.options.manualExpanding || !table._getExpandedRowModel) {
        return table.getPreExpandedRowModel()
      }

      return table._getExpandedRowModel()
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.toggleExpanded = expanded => {
      table.setExpanded(old => {
        const exists = old === true ? true : !!old?.[row.id]

        let oldExpanded: ExpandedStateList = {}

        if (old === true) {
          Object.keys(table.getRowModel().rowsById).forEach(rowId => {
            oldExpanded[rowId] = true
          })
        } else {
          oldExpanded = old
        }

        expanded = expanded ?? !exists

        if (!exists && expanded) {
          return {
            ...oldExpanded,
            [row.id]: true,
          }
        }

        if (exists && !expanded) {
          const { [row.id]: _, ...rest } = oldExpanded
          return rest
        }

        return old
      })
    }
    row.getIsExpanded = () => {
      const expanded = table.getState().expanded

      return !!(
        table.options.getIsRowExpanded?.(row) ??
        (expanded === true || expanded?.[row.id])
      )
    }
    row.getCanExpand = () => {
      return (
        table.options.getRowCanExpand?.(row) ??
        ((table.options.enableExpanding ?? true) && !!row.subRows?.length)
      )
    }
    row.getIsAllParentsExpanded = () => {
      let isFullyExpanded = true
      let currentRow = row

      while (isFullyExpanded && currentRow.parentId) {
        currentRow = table.getRow(currentRow.parentId, true)
        isFullyExpanded = currentRow.getIsExpanded()
      }

      return isFullyExpanded
    }
    row.getToggleExpandedHandler = () => {
      const canExpand = row.getCanExpand()

      return () => {
        if (!canExpand) return
        row.toggleExpanded()
      }
    }
  },
}
