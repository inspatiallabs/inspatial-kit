import {
  OnChangeFn,
  Table,
  Row,
  RowModel,
  Updater,
  RowData,
  TableFeature,
} from '../types.ts'
import { getMemoOptions, makeStateUpdater, memo } from '../utils.ts'

export type RowSelectionState = Record<string, boolean>

export interface RowSelectionTableState {
  rowSelection: RowSelectionState
}

export interface RowSelectionOptions<TData extends RowData> {
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export interface RowSelectionRow {
  
  getCanMultiSelect: () => boolean
  
  getCanSelect: () => boolean
  
  getCanSelectSubRows: () => boolean
  
  getIsAllSubRowsSelected: () => boolean
  
  getIsSelected: () => boolean
  
  getIsSomeSelected: () => boolean
  
  getToggleSelectedHandler: () => (event: unknown) => void
  
  toggleSelected: (value?: boolean, opts?: { selectChildren?: boolean }) => void
}

export interface RowSelectionInstance<TData extends RowData> {
  
  getFilteredSelectedRowModel: () => RowModel<TData>
  
  getGroupedSelectedRowModel: () => RowModel<TData>
  
  getIsAllPageRowsSelected: () => boolean
  
  getIsAllRowsSelected: () => boolean
  
  getIsSomePageRowsSelected: () => boolean
  
  getIsSomeRowsSelected: () => boolean
  
  getPreSelectedRowModel: () => RowModel<TData>
  
  getSelectedRowModel: () => RowModel<TData>
  
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
  
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void
  
  resetRowSelection: (defaultState?: boolean) => void
  
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  
  toggleAllPageRowsSelected: (value?: boolean) => void
  
  toggleAllRowsSelected: (value?: boolean) => void
}

export const RowSelection: TableFeature = {
  getInitialState: (state): RowSelectionTableState => {
    return {
      rowSelection: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowSelectionOptions<TData> => {
    return {
      onRowSelectionChange: makeStateUpdater('rowSelection', table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowSelection = updater =>
      table.options.onRowSelectionChange?.(updater)
    table.resetRowSelection = defaultState =>
      table.setRowSelection(
        defaultState ? {} : table.initialState.rowSelection ?? {}
      )
    table.toggleAllRowsSelected = value => {
      table.setRowSelection(old => {
        value =
          typeof value !== 'undefined' ? value : !table.getIsAllRowsSelected()

        const rowSelection = { ...old }

        const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

        if (value) {
          preGroupedFlatRows.forEach(row => {
            if (!row.getCanSelect()) {
              return
            }
            rowSelection[row.id] = true
          })
        } else {
          preGroupedFlatRows.forEach(row => {
            delete rowSelection[row.id]
          })
        }

        return rowSelection
      })
    }
    table.toggleAllPageRowsSelected = value =>
      table.setRowSelection(old => {
        const resolvedValue =
          typeof value !== 'undefined'
            ? value
            : !table.getIsAllPageRowsSelected()

        const rowSelection: RowSelectionState = { ...old }

        table.getRowModel().rows.forEach(row => {
          mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
        })

        return rowSelection
      })

    table.getPreSelectedRowModel = () => table.getCoreRowModel()
    table.getSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getCoreRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      getMemoOptions(table.options, 'debugTable', 'getSelectedRowModel')
    )

    table.getFilteredSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getFilteredRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      getMemoOptions(table.options, 'debugTable', 'getFilteredSelectedRowModel')
    )

    table.getGroupedSelectedRowModel = memo(
      () => [table.getState().rowSelection, table.getSortedRowModel()],
      (rowSelection, rowModel) => {
        if (!Object.keys(rowSelection).length) {
          return {
            rows: [],
            flatRows: [],
            rowsById: {},
          }
        }

        return selectRowsFn(table, rowModel)
      },
      getMemoOptions(table.options, 'debugTable', 'getGroupedSelectedRowModel')
    )

    table.getIsAllRowsSelected = () => {
      const preGroupedFlatRows = table.getFilteredRowModel().flatRows
      const { rowSelection } = table.getState()

      let isAllRowsSelected = Boolean(
        preGroupedFlatRows.length && Object.keys(rowSelection).length
      )

      if (isAllRowsSelected) {
        if (
          preGroupedFlatRows.some(
            row => row.getCanSelect() && !rowSelection[row.id]
          )
        ) {
          isAllRowsSelected = false
        }
      }

      return isAllRowsSelected
    }

    table.getIsAllPageRowsSelected = () => {
      const paginationFlatRows = table
        .getPaginationRowModel()
        .flatRows.filter(row => row.getCanSelect())
      const { rowSelection } = table.getState()

      let isAllPageRowsSelected = !!paginationFlatRows.length

      if (
        isAllPageRowsSelected &&
        paginationFlatRows.some(row => !rowSelection[row.id])
      ) {
        isAllPageRowsSelected = false
      }

      return isAllPageRowsSelected
    }

    table.getIsSomeRowsSelected = () => {
      const totalSelected = Object.keys(
        table.getState().rowSelection ?? {}
      ).length
      return (
        totalSelected > 0 &&
        totalSelected < table.getFilteredRowModel().flatRows.length
      )
    }

    table.getIsSomePageRowsSelected = () => {
      const paginationFlatRows = table.getPaginationRowModel().flatRows
      return table.getIsAllPageRowsSelected()
        ? false
        : paginationFlatRows
            .filter(row => row.getCanSelect())
            .some(d => d.getIsSelected() || d.getIsSomeSelected())
    }

    table.getToggleAllRowsSelectedHandler = () => {
      return (e: unknown) => {
        table.toggleAllRowsSelected(
          ((e as MouseEvent).target as HTMLInputElement).checked
        )
      }
    }

    table.getToggleAllPageRowsSelectedHandler = () => {
      return (e: unknown) => {
        table.toggleAllPageRowsSelected(
          ((e as MouseEvent).target as HTMLInputElement).checked
        )
      }
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.toggleSelected = (value, opts) => {
      const isSelected = row.getIsSelected()

      table.setRowSelection(old => {
        value = typeof value !== 'undefined' ? value : !isSelected

        if (row.getCanSelect() && isSelected === value) {
          return old
        }

        const selectedRowIds = { ...old }

        mutateRowIsSelected(
          selectedRowIds,
          row.id,
          value,
          opts?.selectChildren ?? true,
          table
        )

        return selectedRowIds
      })
    }
    row.getIsSelected = () => {
      const { rowSelection } = table.getState()
      return isRowSelected(row, rowSelection)
    }

    row.getIsSomeSelected = () => {
      const { rowSelection } = table.getState()
      return isSubRowSelected(row, rowSelection, table) === 'some'
    }

    row.getIsAllSubRowsSelected = () => {
      const { rowSelection } = table.getState()
      return isSubRowSelected(row, rowSelection, table) === 'all'
    }

    row.getCanSelect = () => {
      if (typeof table.options.enableRowSelection === 'function') {
        return table.options.enableRowSelection(row)
      }

      return table.options.enableRowSelection ?? true
    }

    row.getCanSelectSubRows = () => {
      if (typeof table.options.enableSubRowSelection === 'function') {
        return table.options.enableSubRowSelection(row)
      }

      return table.options.enableSubRowSelection ?? true
    }

    row.getCanMultiSelect = () => {
      if (typeof table.options.enableMultiRowSelection === 'function') {
        return table.options.enableMultiRowSelection(row)
      }

      return table.options.enableMultiRowSelection ?? true
    }
    row.getToggleSelectedHandler = () => {
      const canSelect = row.getCanSelect()

      return (e: unknown) => {
        if (!canSelect) return
        row.toggleSelected(
          ((e as MouseEvent).target as HTMLInputElement)?.checked
        )
      }
    }
  },
}

const mutateRowIsSelected = <TData extends RowData>(
  selectedRowIds: Record<string, boolean>,
  id: string,
  value: boolean,
  includeChildren: boolean,
  table: Table<TData>
) => {
  const row = table.getRow(id, true)

  if (value) {
    if (!row.getCanMultiSelect()) {
      Object.keys(selectedRowIds).forEach(key => delete selectedRowIds[key])
    }
    if (row.getCanSelect()) {
      selectedRowIds[id] = true
    }
  } else {
    delete selectedRowIds[id]
  }

  if (includeChildren && row.subRows?.length && row.getCanSelectSubRows()) {
    row.subRows.forEach(row =>
      mutateRowIsSelected(selectedRowIds, row.id, value, includeChildren, table)
    )
  }
}

export function selectRowsFn<TData extends RowData>(
  table: Table<TData>,
  rowModel: RowModel<TData>
): RowModel<TData> {
  const rowSelection = table.getState().rowSelection

  const newSelectedFlatRows: Row<TData>[] = []
  const newSelectedRowsById: Record<string, Row<TData>> = {}

  const recurseRows = (rows: Row<TData>[], depth = 0): Row<TData>[] => {
    return rows
      .map(row => {
        const isSelected = isRowSelected(row, rowSelection)

        if (isSelected) {
          newSelectedFlatRows.push(row)
          newSelectedRowsById[row.id] = row
        }

        if (row.subRows?.length) {
          row = {
            ...row,
            subRows: recurseRows(row.subRows, depth + 1),
          }
        }

        if (isSelected) {
          return row
        }
      })
      .filter(Boolean) as Row<TData>[]
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

export function isRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>
): boolean {
  return selection[row.id] ?? false
}

export function isSubRowSelected<TData extends RowData>(
  row: Row<TData>,
  selection: Record<string, boolean>,
  table: Table<TData>
): boolean | 'some' | 'all' {
  if (!row.subRows?.length) return false

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach(subRow => {

    if (someSelected && !allChildrenSelected) {
      return
    }

    if (subRow.getCanSelect()) {
      if (isRowSelected(subRow, selection)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    }

    if (subRow.subRows && subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow, selection, table)
      if (subRowChildrenSelected === 'all') {
        someSelected = true
      } else if (subRowChildrenSelected === 'some') {
        someSelected = true
        allChildrenSelected = false
      } else {
        allChildrenSelected = false
      }
    }
  })

  return allChildrenSelected ? 'all' : someSelected ? 'some' : false
}
