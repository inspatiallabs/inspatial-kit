import type {
  OnChangeFn,
  Updater,
  Table,
  Row,
  RowData,
  TableFeature,
} from '../types.ts'
import { getMemoOptions, makeStateUpdater, memo } from '../utils.ts'

export type RowPinningPosition = false | 'top' | 'bottom'

export interface RowPinningState {
  bottom?: string[]
  top?: string[]
}

export interface RowPinningTableState {
  rowPinning: RowPinningState
}

export interface RowPinningOptions<TData extends RowData> {
  enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
  keepPinnedRows?: boolean
  onRowPinningChange?: OnChangeFn<RowPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface RowPinningRow {
  getCanPin: () => boolean
  getIsPinned: () => RowPinningPosition
  getPinnedIndex: () => number
  pin: (
    position: RowPinningPosition,
    includeLeafRows?: boolean,
    includeParentRows?: boolean
  ) => void
}

export interface RowPinningInstance<TData extends RowData> {
  _getPinnedRows: (
    visiblePinnedRows: Array<Row<TData>>,
    pinnedRowIds: Array<string> | undefined,
    position: 'top' | 'bottom'
  ) => Row<TData>[]
  getBottomRows: () => Row<TData>[]
  getCenterRows: () => Row<TData>[]
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  getTopRows: () => Row<TData>[]
  resetRowPinning: (defaultState?: boolean) => void
  setRowPinning: (updater: Updater<RowPinningState>) => void
}

const getDefaultRowPinningState = (): RowPinningState => ({
  top: [],
  bottom: [],
})

export const RowPinning: TableFeature = {
  getInitialState: (state): RowPinningTableState => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowPinningDefaultOptions => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.pin = (position, includeLeafRows, includeParentRows) => {
      const leafRowIds = includeLeafRows
        ? row.getLeafRows().map(({ id }) => id)
        : []
      const parentRowIds = includeParentRows
        ? row.getParentRows().map(({ id }) => id)
        : []
      const rowIds = new Set([...parentRowIds, row.id, ...leafRowIds])

      table.setRowPinning(old => {
        if (position === 'bottom') {
          return {
            top: (old?.top ?? []).filter(d => !rowIds?.has(d)),
            bottom: [
              ...(old?.bottom ?? []).filter(d => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
          }
        }

        if (position === 'top') {
          return {
            top: [
              ...(old?.top ?? []).filter(d => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
            bottom: (old?.bottom ?? []).filter(d => !rowIds?.has(d)),
          }
        }

        return {
          top: (old?.top ?? []).filter(d => !rowIds?.has(d)),
          bottom: (old?.bottom ?? []).filter(d => !rowIds?.has(d)),
        }
      })
    }
    row.getCanPin = () => {
      const { enableRowPinning, enablePinning } = table.options
      if (typeof enableRowPinning === 'function') {
        return enableRowPinning(row)
      }
      return enableRowPinning ?? enablePinning ?? true
    }
    row.getIsPinned = () => {
      const rowIds = [row.id]

      const { top, bottom } = table.getState().rowPinning

      const isTop = rowIds.some(d => top?.includes(d))
      const isBottom = rowIds.some(d => bottom?.includes(d))

      return isTop ? 'top' : isBottom ? 'bottom' : false
    }
    row.getPinnedIndex = () => {
      const position = row.getIsPinned()
      if (!position) return -1

      const visiblePinnedRowIds = (
        position === 'top' ? table.getTopRows() : table.getBottomRows()
      )?.map(({ id }) => id)

      return visiblePinnedRowIds?.indexOf(row.id) ?? -1
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowPinning = updater => table.options.onRowPinningChange?.(updater)

    table.resetRowPinning = defaultState =>
      table.setRowPinning(
        defaultState
          ? getDefaultRowPinningState()
          : table.initialState?.rowPinning ?? getDefaultRowPinningState()
      )

    table.getIsSomeRowsPinned = position => {
      const pinningState = table.getState().rowPinning

      if (!position) {
        return Boolean(pinningState.top?.length || pinningState.bottom?.length)
      }
      return Boolean(pinningState[position]?.length)
    }

    table._getPinnedRows = (visibleRows, pinnedRowIds, position) => {
      const rows =
        table.options.keepPinnedRows ?? true
          ? (pinnedRowIds ?? []).map(rowId => {
              const row = table.getRow(rowId, true)
              return row.getIsAllParentsExpanded() ? row : null
            })
          : (pinnedRowIds ?? []).map(
              rowId => visibleRows.find(row => row.id === rowId)!
            )

      return rows.filter(Boolean).map(d => ({ ...d, position })) as Row<TData>[]
    }

    table.getTopRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.top],
      (allRows, topPinnedRowIds) =>
        table._getPinnedRows(allRows, topPinnedRowIds, 'top'),
      getMemoOptions(table.options, 'debugRows', 'getTopRows')
    )

    table.getBottomRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.bottom],
      (allRows, bottomPinnedRowIds) =>
        table._getPinnedRows(allRows, bottomPinnedRowIds, 'bottom'),
      getMemoOptions(table.options, 'debugRows', 'getBottomRows')
    )

    table.getCenterRows = memo(
      () => [
        table.getRowModel().rows,
        table.getState().rowPinning.top,
        table.getState().rowPinning.bottom,
      ],
      (allRows, top, bottom) => {
        const topAndBottom = new Set([...(top ?? []), ...(bottom ?? [])])
        return allRows.filter(d => !topAndBottom.has(d.id))
      },
      getMemoOptions(table.options, 'debugRows', 'getCenterRows')
    )
  },
}
