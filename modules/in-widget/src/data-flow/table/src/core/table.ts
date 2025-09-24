import {
  functionalUpdate,
  getMemoOptions,
  memo,
  type RequiredKeys,
} from "../utils.ts";

import type {
  Updater,
  TableOptionsResolved,
  TableState,
  Table,
  InitialTableState,
  Row,
  Column,
  RowModel,
  ColumnDef,
  TableOptions,
  RowData,
  TableMeta,
  ColumnDefResolved,
  GroupColumnDef,
  TableFeature,
} from "../types.ts";

//
import { createColumn } from "./column.ts";
import { Headers } from "./headers.ts";
//

import { ColumnFaceting } from "../features/ColumnFaceting.ts";
import { ColumnFiltering } from "../features/ColumnFiltering.ts";
import { ColumnGrouping } from "../features/ColumnGrouping.ts";
import { ColumnOrdering } from "../features/ColumnOrdering.ts";
import { ColumnPinning } from "../features/ColumnPinning.ts";
import { ColumnSizing } from "../features/ColumnSizing.ts";
import { ColumnVisibility } from "../features/ColumnVisibility.ts";
import { GlobalFaceting } from "../features/GlobalFaceting.ts";
import { GlobalFiltering } from "../features/GlobalFiltering.ts";
import { RowExpanding } from "../features/RowExpanding.ts";
import { RowPagination } from "../features/RowPagination.ts";
import { RowPinning } from "../features/RowPinning.ts";
import { RowSelection } from "../features/RowSelection.ts";
import { RowSorting } from "../features/RowSorting.ts";
import { env } from "@in/vader/env";

/*#####################################(CONST)#####################################*/
const builtInFeatures = [
  Headers,
  ColumnVisibility,
  ColumnOrdering,
  ColumnPinning,
  ColumnFaceting,
  ColumnFiltering,
  GlobalFaceting, //depends on ColumnFaceting
  GlobalFiltering, //depends on ColumnFiltering
  RowSorting,
  ColumnGrouping, //depends on RowSorting
  RowExpanding,
  RowPagination,
  RowPinning,
  RowSelection,
  ColumnSizing,
] as const;

/*#####################################(TYPES)#####################################*/
export interface CoreTableState {}

export interface CoreOptions<TData extends RowData> {
  _features?: TableFeature[];

  autoResetAll?: boolean;

  columns: ColumnDef<TData, any>[];

  data: TData[];

  debugAll?: boolean;

  debugCells?: boolean;

  debugColumns?: boolean;

  debugHeaders?: boolean;

  debugRows?: boolean;

  debugTable?: boolean;

  defaultColumn?: Partial<ColumnDef<TData, unknown>>;

  getCoreRowModel: (table: Table<any>) => () => RowModel<any>;

  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;

  getSubRows?: (originalRow: TData, index: number) => undefined | TData[];

  initialState?: InitialTableState;

  mergeOptions?: (
    defaultOptions: TableOptions<TData>,
    options: Partial<TableOptions<TData>>
  ) => TableOptions<TData>;

  meta?: TableMeta<TData>;

  onStateChange: (updater: Updater<TableState>) => void;

  renderFallbackValue: any;

  state: Partial<TableState>;
}

/*#####################################(CORE INSTANCE)#####################################*/
export interface CoreInstance<TData extends RowData> {
  _features: readonly TableFeature[];
  _getAllFlatColumnsById: () => Record<string, Column<TData, unknown>>;
  _getColumnDefs: () => ColumnDef<TData, unknown>[];
  _getCoreRowModel?: () => RowModel<TData>;
  _getDefaultColumnDef: () => Partial<ColumnDef<TData, unknown>>;
  _getRowId: (_: TData, index: number, parent?: Row<TData>) => string;
  _queue: (cb: () => void) => void;

  getAllColumns: () => Column<TData, unknown>[];

  getAllFlatColumns: () => Column<TData, unknown>[];

  getAllLeafColumns: () => Column<TData, unknown>[];

  getColumn: (columnId: string) => Column<TData, unknown> | undefined;

  getCoreRowModel: () => RowModel<TData>;

  getRow: (id: string, searchAll?: boolean) => Row<TData>;

  getRowModel: () => RowModel<TData>;

  getState: () => TableState;

  initialState: TableState;

  options: RequiredKeys<TableOptionsResolved<TData>, "state">;

  reset: () => void;

  setOptions: (newOptions: Updater<TableOptionsResolved<TData>>) => void;

  setState: (updater: Updater<TableState>) => void;
}

/*#####################################(CREATE TABLE)#####################################*/
export function createTableCore<TData extends RowData>(
  options: TableOptionsResolved<TData>
): Table<TData> {
  if (!env.isProduction && (options.debugAll || options.debugTable)) {
    console.info("Creating Table Instance...");
  }

  const _features = [...builtInFeatures, ...(options._features ?? [])];

  let table = { _features } as unknown as Table<TData>;

  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(table));
  }, {}) as TableOptionsResolved<TData>;

  const mergeOptions = (options: TableOptionsResolved<TData>) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options);
    }

    return {
      ...defaultOptions,
      ...options,
    };
  };

  const coreInitialState: CoreTableState = {};

  let initialState = {
    ...coreInitialState,
    ...(options.initialState ?? {}),
  } as TableState;

  table._features.forEach((feature) => {
    initialState = (feature.getInitialState?.(initialState) ??
      initialState) as TableState;
  });

  const queued: (() => void)[] = [];
  let queuedTimeout = false;

  const coreInstance: CoreInstance<TData> = {
    _features,
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
    _queue: (cb) => {
      queued.push(cb);

      if (!queuedTimeout) {
        queuedTimeout = true;

        // Schedule a microtask to run the queued callbacks after
        // the current call stack (render, etc) has finished.
        Promise.resolve()
          .then(() => {
            while (queued.length) {
              queued.shift()!();
            }
            queuedTimeout = false;
          })
          .catch((error) =>
            setTimeout(() => {
              throw error;
            })
          );
      }
    },
    reset: () => {
      table.setState(table.initialState);
    },
    setOptions: (updater) => {
      const newOptions = functionalUpdate(updater, table.options);
      table.options = mergeOptions(newOptions) as RequiredKeys<
        TableOptionsResolved<TData>,
        "state"
      >;
    },

    getState: () => {
      return table.options.state as TableState;
    },

    setState: (updater: Updater<TableState>) => {
      table.options.onStateChange?.(updater);
    },

    _getRowId: (row: TData, index: number, parent?: Row<TData>) =>
      table.options.getRowId?.(row, index, parent) ??
      `${parent ? [parent.id, index].join(".") : index}`,

    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table);
      }

      return table._getCoreRowModel!();
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up

    getRowModel: () => {
      return table.getPaginationRowModel();
    },
    //in next version, we should just pass in the row model as the optional 2nd arg
    getRow: (id: string, searchAll?: boolean) => {
      let row = (
        searchAll ? table.getPrePaginationRowModel() : table.getRowModel()
      ).rowsById[id];

      if (!row) {
        row = table.getCoreRowModel().rowsById[id];
        if (!row) {
          if (env.isProduction()) {
            throw new Error(`getRow could not find row with ID: ${id}`);
          }
          throw new Error();
        }
      }

      return row;
    },
    _getDefaultColumnDef: memo(
      () => [table.options.defaultColumn],
      (defaultColumn) => {
        defaultColumn = (defaultColumn ?? {}) as Partial<
          ColumnDef<TData, unknown>
        >;

        return {
          header: (props) => {
            const resolvedColumnDef = props.header.column
              .columnDef as ColumnDefResolved<TData>;

            if (resolvedColumnDef.accessorKey) {
              return resolvedColumnDef.accessorKey;
            }

            if (resolvedColumnDef.accessorFn) {
              return resolvedColumnDef.id;
            }

            return null;
          },
          // footer: props => props.header.column.id,
          cell: (props) => props.renderValue<any>()?.toString?.() ?? null,
          ...table._features.reduce((obj, feature) => {
            return Object.assign(obj, feature.getDefaultColumnDef?.());
          }, {}),
          ...defaultColumn,
        } as Partial<ColumnDef<TData, unknown>>;
      },
      getMemoOptions(options, "debugColumns", "_getDefaultColumnDef")
    ),

    _getColumnDefs: () => table.options.columns,

    getAllColumns: memo(
      () => [table._getColumnDefs()],
      (columnDefs) => {
        const recurseColumns = (
          columnDefs: ColumnDef<TData, unknown>[],
          parent?: Column<TData, unknown>,
          depth = 0
        ): Column<TData, unknown>[] => {
          return columnDefs.map((columnDef) => {
            const column = createColumn(table, columnDef, depth, parent);

            const groupingColumnDef = columnDef as GroupColumnDef<
              TData,
              unknown
            >;

            column.columns = groupingColumnDef.columns
              ? recurseColumns(groupingColumnDef.columns, column, depth + 1)
              : [];

            return column;
          });
        };

        return recurseColumns(columnDefs);
      },
      getMemoOptions(options, "debugColumns", "getAllColumns")
    ),

    getAllFlatColumns: memo(
      () => [table.getAllColumns()],
      (allColumns) => {
        return allColumns.flatMap((column) => {
          return column.getFlatColumns();
        });
      },
      getMemoOptions(options, "debugColumns", "getAllFlatColumns")
    ),

    _getAllFlatColumnsById: memo(
      () => [table.getAllFlatColumns()],
      (flatColumns) => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column;
          return acc;
        }, {} as Record<string, Column<TData, unknown>>);
      },
      getMemoOptions(options, "debugColumns", "getAllFlatColumnsById")
    ),

    getAllLeafColumns: memo(
      () => [table.getAllColumns(), table._getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap((column) =>
          column.getLeafColumns()
        );
        return orderColumns(leafColumns);
      },
      getMemoOptions(options, "debugColumns", "getAllLeafColumns")
    ),

    getColumn: (columnId) => {
      const column = table._getAllFlatColumnsById()[columnId];

      if (!env.isProduction && !column) {
        console.error(`[Table] Column with id '${columnId}' does not exist.`);
      }

      return column;
    },
  };

  Object.assign(table, coreInstance);

  for (let index = 0; index < table._features.length; index++) {
    const feature = table._features[index];
    feature?.createTable?.(table);
  }

  return table;
}

