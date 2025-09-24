import type {
  OnChangeFn,
  Table,
  RowModel,
  Updater,
  RowData,
  TableFeature,
} from "../types.ts";
import {
  functionalUpdate,
  getMemoOptions,
  makeStateUpdater,
  memo,
} from "../utils.ts";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationTableState {
  pagination: PaginationState;
}

export interface PaginationInitialTableState {
  pagination?: Partial<PaginationState>;
}

export interface PaginationOptions {
  autoResetPageIndex?: boolean;
  getPaginationRowModel?: (table: Table<any>) => () => RowModel<any>;
  manualPagination?: boolean;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  rowCount?: number;
}

export interface PaginationDefaultOptions {
  onPaginationChange: OnChangeFn<PaginationState>;
}

export interface PaginationInstance<TData extends RowData> {
  _autoResetPageIndex: () => void;
  _getPaginationRowModel?: () => RowModel<TData>;
  getCanNextPage: () => boolean;
  getCanPreviousPage: () => boolean;
  getPageCount: () => number;
  getRowCount: () => number;
  getPageOptions: () => number[];
  getPaginationRowModel: () => RowModel<TData>;
  getPrePaginationRowModel: () => RowModel<TData>;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  resetPageIndex: (defaultState?: boolean) => void;
  resetPageSize: (defaultState?: boolean) => void;
  resetPagination: (defaultState?: boolean) => void;
  setPageCount: (updater: Updater<number>) => void;
  setPageIndex: (updater: Updater<number>) => void;
  setPageSize: (updater: Updater<number>) => void;
  setPagination: (updater: Updater<PaginationState>) => void;
}

const defaultPageIndex = 0;
const defaultPageSize = 10;

const getDefaultPaginationState = (): PaginationState => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize,
});

export const RowPagination: TableFeature = {
  getInitialState: (state): PaginationTableState => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state?.pagination,
      },
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): PaginationDefaultOptions => {
    return {
      onPaginationChange: makeStateUpdater("pagination", table),
    };
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    let registered = false;
    let queued = false;

    table._autoResetPageIndex = () => {
      if (!registered) {
        table._queue(() => {
          registered = true;
        });
        return;
      }

      if (
        table.options.autoResetAll ??
        table.options.autoResetPageIndex ??
        !table.options.manualPagination
      ) {
        if (queued) return;
        queued = true;
        table._queue(() => {
          table.resetPageIndex();
          queued = false;
        });
      }
    };
    table.setPagination = (updater) => {
      const safeUpdater: Updater<PaginationState> = (old) => {
        const newState = functionalUpdate(updater, old);

        return newState;
      };

      return table.options.onPaginationChange?.(safeUpdater);
    };
    table.resetPagination = (defaultState) => {
      table.setPagination(
        defaultState
          ? getDefaultPaginationState()
          : table.initialState.pagination ?? getDefaultPaginationState()
      );
    };
    table.setPageIndex = (updater) => {
      table.setPagination((old) => {
        let pageIndex = functionalUpdate(updater, old.pageIndex);

        const maxPageIndex =
          typeof table.options.pageCount === "undefined" ||
          table.options.pageCount === -1
            ? Number.MAX_SAFE_INTEGER
            : table.options.pageCount - 1;

        pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex));

        return {
          ...old,
          pageIndex,
        };
      });
    };
    table.resetPageIndex = (defaultState) => {
      table.setPageIndex(
        defaultState
          ? defaultPageIndex
          : table.initialState?.pagination?.pageIndex ?? defaultPageIndex
      );
    };
    table.resetPageSize = (defaultState) => {
      table.setPageSize(
        defaultState
          ? defaultPageSize
          : table.initialState?.pagination?.pageSize ?? defaultPageSize
      );
    };
    table.setPageSize = (updater) => {
      table.setPagination((old) => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize));
        const topRowIndex = old.pageSize * old.pageIndex!;
        const pageIndex = Math.floor(topRowIndex / pageSize);

        return {
          ...old,
          pageIndex,
          pageSize,
        };
      });
    };

    table.setPageCount = (updater) =>
      table.setPagination((old) => {
        let newPageCount = functionalUpdate(
          updater,
          table.options.pageCount ?? -1
        );

        if (typeof newPageCount === "number") {
          newPageCount = Math.max(-1, newPageCount);
        }

        return {
          ...old,
          pageCount: newPageCount,
        };
      });

    table.getPageOptions = memo(
      () => [table.getPageCount()],
      (pageCount) => {
        let pageOptions: number[] = [];
        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i);
        }
        return pageOptions;
      },
      getMemoOptions(table.options, "debugTable", "getPageOptions")
    );

    table.getCanPreviousPage = () => table.getState().pagination.pageIndex > 0;

    table.getCanNextPage = () => {
      const { pageIndex } = table.getState().pagination;

      const pageCount = table.getPageCount();

      if (pageCount === -1) {
        return true;
      }

      if (pageCount === 0) {
        return false;
      }

      return pageIndex < pageCount - 1;
    };

    table.previousPage = () => {
      return table.setPageIndex((old) => old - 1);
    };

    table.nextPage = () => {
      return table.setPageIndex((old) => {
        return old + 1;
      });
    };

    table.firstPage = () => {
      return table.setPageIndex(0);
    };

    table.lastPage = () => {
      return table.setPageIndex(table.getPageCount() - 1);
    };

    table.getPrePaginationRowModel = () => table.getExpandedRowModel();
    table.getPaginationRowModel = () => {
      if (
        !table._getPaginationRowModel &&
        table.options.getPaginationRowModel
      ) {
        table._getPaginationRowModel =
          table.options.getPaginationRowModel(table);
      }

      if (table.options.manualPagination || !table._getPaginationRowModel) {
        return table.getPrePaginationRowModel();
      }

      return table._getPaginationRowModel();
    };

    table.getPageCount = () => {
      return (
        table.options.pageCount ??
        Math.ceil(table.getRowCount() / table.getState().pagination.pageSize)
      );
    };

    table.getRowCount = () => {
      return (
        table.options.rowCount ?? table.getPrePaginationRowModel().rows.length
      );
    };
  },
};
