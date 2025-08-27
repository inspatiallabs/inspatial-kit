import type { RowModel } from "../types.ts";
import { BuiltInAggregationFn, aggregationFns } from "../aggregationFns.ts";
import type {
  AggregationFns,
  Cell,
  Column,
  ColumnDefTemplate,
  OnChangeFn,
  Row,
  RowData,
  Table,
  TableFeature,
  Updater,
} from "../types.ts";
import { isFunction, makeStateUpdater } from "../utils.ts";

/*#####################################(TYPES)#####################################*/

export type GroupingState = string[];

export interface GroupingTableState {
  grouping: GroupingState;
}

export type AggregationFn<TData extends RowData> = (
  columnId: string,
  leafRows: Row<TData>[],
  childRows: Row<TData>[]
) => any;

export type CustomAggregationFns = Record<string, AggregationFn<any>>;

export type AggregationFnOption<TData extends RowData> =
  | "auto"
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>;

export interface GroupingColumnDef<TData extends RowData, TValue> {
  aggregatedCell?: ColumnDefTemplate<
    ReturnType<Cell<TData, TValue>["getContext"]>
  >;

  aggregationFn?: AggregationFnOption<TData>;

  enableGrouping?: boolean;

  getGroupingValue?: (row: TData) => any;
}

export interface GroupingColumn<TData extends RowData> {
  getAggregationFn: () => AggregationFn<TData> | undefined;

  getAutoAggregationFn: () => AggregationFn<TData> | undefined;

  getCanGroup: () => boolean;

  getGroupedIndex: () => number;

  getIsGrouped: () => boolean;

  getToggleGroupingHandler: () => () => void;

  toggleGrouping: () => void;
}

export interface GroupingRow {
  _groupingValuesCache: Record<string, any>;

  getGroupingValue: (columnId: string) => unknown;

  getIsGrouped: () => boolean;

  groupingColumnId?: string;

  groupingValue?: unknown;
}

export interface GroupingCell {
  getIsAggregated: () => boolean;

  getIsGrouped: () => boolean;

  getIsPlaceholder: () => boolean;
}

export interface ColumnDefaultOptions {
  enableGrouping: boolean;
  onGroupingChange: OnChangeFn<GroupingState>;
}

interface GroupingOptionsBase {
  enableGrouping?: boolean;

  getGroupedRowModel?: (table: Table<any>) => () => RowModel<any>;

  groupedColumnMode?: false | "reorder" | "remove";

  manualGrouping?: boolean;

  onGroupingChange?: OnChangeFn<GroupingState>;
}

type ResolvedAggregationFns = keyof AggregationFns extends never
  ? {
      aggregationFns?: Record<string, AggregationFn<any>>;
    }
  : {
      aggregationFns: Record<keyof AggregationFns, AggregationFn<any>>;
    };

export interface GroupingOptions
  extends GroupingOptionsBase,
    ResolvedAggregationFns {}

export type GroupingColumnMode = false | "reorder" | "remove";

export interface GroupingInstance<TData extends RowData> {
  _getGroupedRowModel?: () => RowModel<TData>;

  getGroupedRowModel: () => RowModel<TData>;

  getPreGroupedRowModel: () => RowModel<TData>;

  resetGrouping: (defaultState?: boolean) => void;

  setGrouping: (updater: Updater<GroupingState>) => void;
}

/*####################################(COLUMN GROUPING)####################################*/

export const ColumnGrouping: TableFeature = {
  getDefaultColumnDef: <TData extends RowData>(): GroupingColumnDef<
    TData,
    unknown
  > => {
    return {
      aggregatedCell: (props) =>
        (props.getValue() as any)?.toString?.() ?? null,
      aggregationFn: "auto",
    };
  },

  getInitialState: (state): GroupingTableState => {
    return {
      grouping: [],
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GroupingOptions => {
    return {
      onGroupingChange: makeStateUpdater("grouping", table),
      groupedColumnMode: "reorder",
    };
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.toggleGrouping = () => {
      table.setGrouping((old) => {
        // Find any existing grouping for this column
        if (old?.includes(column.id)) {
          return old.filter((d) => d !== column.id);
        }

        return [...(old ?? []), column.id];
      });
    };

    column.getCanGroup = () => {
      return (
        (column.columnDef.enableGrouping ?? true) &&
        (table.options.enableGrouping ?? true) &&
        (!!column.accessorFn || !!column.columnDef.getGroupingValue)
      );
    };

    column.getIsGrouped = () => {
      return table.getState().grouping?.includes(column.id);
    };

    column.getGroupedIndex = () =>
      table.getState().grouping?.indexOf(column.id);

    column.getToggleGroupingHandler = () => {
      const canGroup = column.getCanGroup();

      return () => {
        if (!canGroup) return;
        column.toggleGrouping();
      };
    };
    column.getAutoAggregationFn = () => {
      const firstRow = table.getCoreRowModel().flatRows[0];

      const value = firstRow?.getValue(column.id);

      if (typeof value === "number") {
        return aggregationFns.sum;
      }

      if (Object.prototype.toString.call(value) === "[object Date]") {
        return aggregationFns.extent;
      }
    };
    column.getAggregationFn = () => {
      if (!column) {
        throw new Error();
      }

      return isFunction(column.columnDef.aggregationFn)
        ? column.columnDef.aggregationFn
        : column.columnDef.aggregationFn === "auto"
        ? column.getAutoAggregationFn()
        : table.options.aggregationFns?.[
            column.columnDef.aggregationFn as string
          ] ??
          aggregationFns[
            column.columnDef.aggregationFn as BuiltInAggregationFn
          ];
    };
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setGrouping = (updater) => table.options.onGroupingChange?.(updater);

    table.resetGrouping = (defaultState) => {
      table.setGrouping(defaultState ? [] : table.initialState?.grouping ?? []);
    };

    table.getPreGroupedRowModel = () => table.getFilteredRowModel();
    table.getGroupedRowModel = () => {
      if (!table._getGroupedRowModel && table.options.getGroupedRowModel) {
        table._getGroupedRowModel = table.options.getGroupedRowModel(table);
      }

      if (table.options.manualGrouping || !table._getGroupedRowModel) {
        return table.getPreGroupedRowModel();
      }

      return table._getGroupedRowModel();
    };
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getIsGrouped = () => !!row.groupingColumnId;
    row.getGroupingValue = (columnId) => {
      if (row._groupingValuesCache.hasOwnProperty(columnId)) {
        return row._groupingValuesCache[columnId];
      }

      const column = table.getColumn(columnId);

      if (!column?.columnDef.getGroupingValue) {
        return row.getValue(columnId);
      }

      row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
        row.original
      );

      return row._groupingValuesCache[columnId];
    };
    row._groupingValuesCache = {};
  },

  createCell: <TData extends RowData, TValue>(
    cell: Cell<TData, TValue>,
    column: Column<TData, TValue>,
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    const getRenderValue = () =>
      cell.getValue() ?? table.options.renderFallbackValue;

    cell.getIsGrouped = () =>
      column.getIsGrouped() && column.id === row.groupingColumnId;
    cell.getIsPlaceholder = () => !cell.getIsGrouped() && column.getIsGrouped();
    cell.getIsAggregated = () =>
      !cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows?.length;
  },
};

/*####################################(ORDER COLUMNS)####################################*/

export function orderColumns<TData extends RowData>(
  leafColumns: Column<TData, unknown>[],
  grouping: string[],
  groupedColumnMode?: GroupingColumnMode
) {
  if (!grouping?.length || !groupedColumnMode) {
    return leafColumns;
  }

  const nonGroupingColumns = leafColumns.filter(
    (col) => !grouping.includes(col.id)
  );

  if (groupedColumnMode === "remove") {
    return nonGroupingColumns;
  }

  const groupingColumns = grouping
    .map((g) => leafColumns.find((col) => col.id === g)!)
    .filter(Boolean);

  return [...groupingColumns, ...nonGroupingColumns];
}
