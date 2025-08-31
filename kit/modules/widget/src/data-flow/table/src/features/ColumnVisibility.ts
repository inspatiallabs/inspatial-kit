import type {
  Cell,
  Column,
  OnChangeFn,
  Table,
  Updater,
  Row,
  RowData,
  TableFeature,
} from "../types.ts";
import { getMemoOptions, makeStateUpdater, memo } from "../utils.ts";
import type { ColumnPinningPosition } from "./ColumnPinning.ts";

/*########################################(TYPES)########################################*/

export type VisibilityState = Record<string, boolean>;

export interface VisibilityTableState {
  columnVisibility: VisibilityState;
}

export interface VisibilityOptions {
  enableHiding?: boolean;

  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export type VisibilityDefaultOptions = Pick<
  VisibilityOptions,
  "onColumnVisibilityChange"
>;

export interface VisibilityInstance<TData extends RowData> {
  getCenterVisibleLeafColumns: () => Column<TData, unknown>[];

  getIsAllColumnsVisible: () => boolean;

  getIsSomeColumnsVisible: () => boolean;

  getLeftVisibleLeafColumns: () => Column<TData, unknown>[];

  getRightVisibleLeafColumns: () => Column<TData, unknown>[];

  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void;

  getVisibleFlatColumns: () => Column<TData, unknown>[];

  getVisibleLeafColumns: () => Column<TData, unknown>[];

  resetColumnVisibility: (defaultState?: boolean) => void;

  setColumnVisibility: (updater: Updater<VisibilityState>) => void;

  toggleAllColumnsVisible: (value?: boolean) => void;
}

export interface VisibilityColumnDef {
  enableHiding?: boolean;
}

export interface VisibilityRow<TData extends RowData> {
  _getAllVisibleCells: () => Cell<TData, unknown>[];

  getVisibleCells: () => Cell<TData, unknown>[];
}

export interface VisibilityColumn {
  getCanHide: () => boolean;

  getIsVisible: () => boolean;

  getToggleVisibilityHandler: () => (event: unknown) => void;

  toggleVisibility: (value?: boolean) => void;
}

/*########################################(COLUMN VISIBILITY)########################################*/

export const ColumnVisibility: TableFeature = {
  getInitialState: (state): VisibilityTableState => {
    return {
      columnVisibility: {},
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): VisibilityDefaultOptions => {
    return {
      onColumnVisibilityChange: makeStateUpdater("columnVisibility", table),
    };
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.toggleVisibility = (value) => {
      if (column.getCanHide()) {
        table.setColumnVisibility((old) => ({
          ...old,
          [column.id]: value ?? !column.getIsVisible(),
        }));
      }
    };
    column.getIsVisible = () => {
      const childColumns = column.columns;
      return (
        (childColumns.length
          ? childColumns.some((c) => c.getIsVisible())
          : table.getState().columnVisibility?.[column.id]) ?? true
      );
    };

    column.getCanHide = () => {
      return (
        (column.columnDef.enableHiding ?? true) &&
        (table.options.enableHiding ?? true)
      );
    };
    column.getToggleVisibilityHandler = () => {
      return (e: unknown) => {
        column.toggleVisibility?.(
          ((e as MouseEvent).target as HTMLInputElement).checked
        );
      };
    };
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row._getAllVisibleCells = memo(
      () => [row.getAllCells(), table.getState().columnVisibility],
      (cells) => {
        return cells.filter((cell) => cell.column.getIsVisible());
      },
      getMemoOptions(table.options, "debugRows", "_getAllVisibleCells")
    );
    row.getVisibleCells = memo(
      () => [
        row.getLeftVisibleCells(),
        row.getCenterVisibleCells(),
        row.getRightVisibleCells(),
      ],
      (left, center, right) => [...left, ...center, ...right],
      getMemoOptions(table.options, "debugRows", "getVisibleCells")
    );
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    const makeVisibleColumnsMethod = (
      key: string,
      getColumns: () => Column<TData, unknown>[]
    ): (() => Column<TData, unknown>[]) => {
      return memo(
        () => [
          getColumns(),
          getColumns()
            .filter((d) => d.getIsVisible())
            .map((d) => d.id)
            .join("_"),
        ],
        (columns) => {
          return columns.filter((d) => d.getIsVisible?.());
        },
        getMemoOptions(table.options, "debugColumns", key)
      );
    };

    table.getVisibleFlatColumns = makeVisibleColumnsMethod(
      "getVisibleFlatColumns",
      () => table.getAllFlatColumns()
    );
    table.getVisibleLeafColumns = makeVisibleColumnsMethod(
      "getVisibleLeafColumns",
      () => table.getAllLeafColumns()
    );
    table.getLeftVisibleLeafColumns = makeVisibleColumnsMethod(
      "getLeftVisibleLeafColumns",
      () => table.getLeftLeafColumns()
    );
    table.getRightVisibleLeafColumns = makeVisibleColumnsMethod(
      "getRightVisibleLeafColumns",
      () => table.getRightLeafColumns()
    );
    table.getCenterVisibleLeafColumns = makeVisibleColumnsMethod(
      "getCenterVisibleLeafColumns",
      () => table.getCenterLeafColumns()
    );

    table.setColumnVisibility = (updater) =>
      table.options.onColumnVisibilityChange?.(updater);

    table.resetColumnVisibility = (defaultState) => {
      table.setColumnVisibility(
        defaultState ? {} : table.initialState.columnVisibility ?? {}
      );
    };

    table.toggleAllColumnsVisible = (value) => {
      value = value ?? !table.getIsAllColumnsVisible();

      table.setColumnVisibility(
        table.getAllLeafColumns().reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: !value ? !column.getCanHide?.() : value,
          }),
          {}
        )
      );
    };

    table.getIsAllColumnsVisible = () =>
      !table.getAllLeafColumns().some((column) => !column.getIsVisible?.());

    table.getIsSomeColumnsVisible = () =>
      table.getAllLeafColumns().some((column) => column.getIsVisible?.());

    table.getToggleAllColumnsVisibilityHandler = () => {
      return (e: unknown) => {
        table.toggleAllColumnsVisible(
          ((e as MouseEvent).target as HTMLInputElement)?.checked
        );
      };
    };
  },
};

export function _getVisibleLeafColumns<TData extends RowData>(
  table: Table<TData>,
  position?: ColumnPinningPosition | "center"
) {
  return !position
    ? table.getVisibleLeafColumns()
    : position === "center"
    ? table.getCenterVisibleLeafColumns()
    : position === "left"
    ? table.getLeftVisibleLeafColumns()
    : table.getRightVisibleLeafColumns();
}
