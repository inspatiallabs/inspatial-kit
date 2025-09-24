import { createState } from "@in/teract/state";
import type {
  ColumnSort,
  ColumnFilter,
  VisibilityState,
  PaginationState,
} from "./src/index.ts";

/*####################################(TABLE STATE)####################################*/

export function useTableState<TData>() {
  return createState.in({
    id: "in-table",
    initialState: {
      sorting: [] as ColumnSort[],
      columnFilters: [] as ColumnFilter[],
      columnVisibility: {} as VisibilityState,
      pagination: { pageIndex: 0, pageSize: 13 } as PaginationState,
      rowSelection: {} as Record<string, boolean>,
      contextMenu: null as { x: number; y: number; row: TData } | null,
    },
    action: {
      setSorting: {
        key: "sorting",
        fn: (_: ColumnSort[], _v: ColumnSort[]) => _v,
      },
      setColumnFilters: {
        key: "columnFilters",
        fn: (_: ColumnFilter[], _v: ColumnFilter[]) => _v,
      },
      setColumnVisibility: {
        key: "columnVisibility",
        fn: (_: VisibilityState, _v: VisibilityState) => _v,
      },
      setPagination: {
        key: "pagination",
        fn: (_: PaginationState, _v: PaginationState) => _v,
      },
      setRowSelection: {
        key: "rowSelection",
        fn: (_: Record<string, boolean>, _v: Record<string, boolean>) => _v,
      },
      openContextMenu: {
        key: "contextMenu",
        fn: (    
          _: { x: number; y: number; row: TData } | null,
          _p: { x: number; y: number; row: TData }
        ) => _p,
      },
      closeContextMenu: { key: "contextMenu", fn: () => null },
    },
  });
}
