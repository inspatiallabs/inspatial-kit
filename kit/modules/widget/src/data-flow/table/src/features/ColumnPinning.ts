import type {
  OnChangeFn,
  Updater,
  Table,
  Column,
  Row,
  Cell,
  RowData,
  TableFeature,
} from "../types.ts";
import { getMemoOptions, makeStateUpdater, memo } from "../utils.ts";

/*#####################################(TYPES)#####################################*/

export type ColumnPinningPosition = false | "left" | "right";

export interface ColumnPinningState {
  left?: string[];
  right?: string[];
}

export interface ColumnPinningTableState {
  columnPinning: ColumnPinningState;
}

export interface ColumnPinningOptions {
  enablePinning?: boolean;

  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>;
}

export interface ColumnPinningColumnDef {
  enablePinning?: boolean;
}

export interface ColumnPinningColumn {
  getCanPin: () => boolean;

  getIsPinned: () => ColumnPinningPosition;

  getPinnedIndex: () => number;

  pin: (position: ColumnPinningPosition) => void;
}

export interface ColumnPinningRow<TData extends RowData> {
  getCenterVisibleCells: () => Cell<TData, unknown>[];

  getLeftVisibleCells: () => Cell<TData, unknown>[];

  getRightVisibleCells: () => Cell<TData, unknown>[];
}

export interface ColumnPinningInstance<TData extends RowData> {
  getCenterLeafColumns: () => Column<TData, unknown>[];

  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean;

  getLeftLeafColumns: () => Column<TData, unknown>[];

  getRightLeafColumns: () => Column<TData, unknown>[];

  resetColumnPinning: (defaultState?: boolean) => void;

  setColumnPinning: (updater: Updater<ColumnPinningState>) => void;
}

/*#####################################(COLUMN PINNING)#####################################*/

const getDefaultColumnPinningState = (): ColumnPinningState => ({
  left: [],
  right: [],
});

export const ColumnPinning: TableFeature = {
  getInitialState: (state): ColumnPinningTableState => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater("columnPinning", table),
    };
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.pin = (position) => {
      const columnIds = column
        .getLeafColumns()
        .map((d) => d.id)
        .filter(Boolean) as string[];

      table.setColumnPinning((old) => {
        if (position === "right") {
          return {
            left: (old?.left ?? []).filter((d) => !columnIds?.includes(d)),
            right: [
              ...(old?.right ?? []).filter((d) => !columnIds?.includes(d)),
              ...columnIds,
            ],
          };
        }

        if (position === "left") {
          return {
            left: [
              ...(old?.left ?? []).filter((d) => !columnIds?.includes(d)),
              ...columnIds,
            ],
            right: (old?.right ?? []).filter((d) => !columnIds?.includes(d)),
          };
        }

        return {
          left: (old?.left ?? []).filter((d) => !columnIds?.includes(d)),
          right: (old?.right ?? []).filter((d) => !columnIds?.includes(d)),
        };
      });
    };

    column.getCanPin = () => {
      const leafColumns = column.getLeafColumns();

      return leafColumns.some(
        (d) =>
          (d.columnDef.enablePinning ?? true) &&
          (table.options.enableColumnPinning ??
            table.options.enablePinning ??
            true)
      );
    };

    column.getIsPinned = () => {
      const leafColumnIds = column.getLeafColumns().map((d) => d.id);

      const { left, right } = table.getState().columnPinning;

      const isLeft = leafColumnIds.some((d) => left?.includes(d));
      const isRight = leafColumnIds.some((d) => right?.includes(d));

      return isLeft ? "left" : isRight ? "right" : false;
    };

    column.getPinnedIndex = () => {
      const position = column.getIsPinned();

      return position
        ? table.getState().columnPinning?.[position]?.indexOf(column.id) ?? -1
        : 0;
    };
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getCenterVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allCells, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])];

        return allCells.filter((d) => !leftAndRight.includes(d.column.id));
      },
      getMemoOptions(table.options, "debugRows", "getCenterVisibleCells")
    );
    row.getLeftVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.left],
      (allCells, left) => {
        const cells = (left ?? [])
          .map(
            (columnId) => allCells.find((cell) => cell.column.id === columnId)!
          )
          .filter(Boolean)
          .map((d) => ({ ...d, position: "left" } as Cell<TData, unknown>));

        return cells;
      },
      getMemoOptions(table.options, "debugRows", "getLeftVisibleCells")
    );
    row.getRightVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
      (allCells, right) => {
        const cells = (right ?? [])
          .map(
            (columnId) => allCells.find((cell) => cell.column.id === columnId)!
          )
          .filter(Boolean)
          .map((d) => ({ ...d, position: "right" } as Cell<TData, unknown>));

        return cells;
      },
      getMemoOptions(table.options, "debugRows", "getRightVisibleCells")
    );
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnPinning = (updater) =>
      table.options.onColumnPinningChange?.(updater);

    table.resetColumnPinning = (defaultState) =>
      table.setColumnPinning(
        defaultState
          ? getDefaultColumnPinningState()
          : table.initialState?.columnPinning ?? getDefaultColumnPinningState()
      );

    table.getIsSomeColumnsPinned = (position) => {
      const pinningState = table.getState().columnPinning;

      if (!position) {
        return Boolean(pinningState.left?.length || pinningState.right?.length);
      }
      return Boolean(pinningState[position]?.length);
    };

    table.getLeftLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
      (allColumns, left) => {
        return (left ?? [])
          .map(
            (columnId) => allColumns.find((column) => column.id === columnId)!
          )
          .filter(Boolean);
      },
      getMemoOptions(table.options, "debugColumns", "getLeftLeafColumns")
    );

    table.getRightLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
      (allColumns, right) => {
        return (right ?? [])
          .map(
            (columnId) => allColumns.find((column) => column.id === columnId)!
          )
          .filter(Boolean);
      },
      getMemoOptions(table.options, "debugColumns", "getRightLeafColumns")
    );

    table.getCenterLeafColumns = memo(
      () => [
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])];

        return allColumns.filter((d) => !leftAndRight.includes(d.id));
      },
      getMemoOptions(table.options, "debugColumns", "getCenterLeafColumns")
    );
  },
};
