import type {
  RowData,
  Column,
  Header,
  OnChangeFn,
  Table,
  Updater,
  TableFeature,
} from "../types.ts";
import { getMemoOptions, makeStateUpdater, memo } from "../utils.ts";
import type { ColumnPinningPosition } from "./ColumnPinning.ts";
import { safelyAccessDocument } from "../utils/document.ts";
import { _getVisibleLeafColumns } from "./ColumnVisibility.ts";

/*#####################################(TYPES)#####################################*/

export interface ColumnSizingTableState {
  columnSizing: ColumnSizingState;
  columnSizingInfo: ColumnSizingInfoState;
}

export type ColumnSizingState = Record<string, number>;

export interface ColumnSizingInfoState {
  columnSizingStart: [string, number][];
  deltaOffset: null | number;
  deltaPercentage: null | number;
  isResizingColumn: false | string;
  startOffset: null | number;
  startSize: null | number;
}

export type ColumnResizeMode = "onChange" | "onEnd";

export type ColumnResizeDirection = "ltr" | "rtl";

export interface ColumnSizingOptions {
  columnResizeMode?: ColumnResizeMode;

  enableColumnResizing?: boolean;

  columnResizeDirection?: ColumnResizeDirection;

  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;

  onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>;
}

export type ColumnSizingDefaultOptions = Pick<
  ColumnSizingOptions,
  | "columnResizeMode"
  | "onColumnSizingChange"
  | "onColumnSizingInfoChange"
  | "columnResizeDirection"
>;

export interface ColumnSizingInstance {
  getCenterTotalSize: () => number;

  getLeftTotalSize: () => number;

  getRightTotalSize: () => number;

  getTotalSize: () => number;

  resetColumnSizing: (defaultState?: boolean) => void;

  resetHeaderSizeInfo: (defaultState?: boolean) => void;

  setColumnSizing: (updater: Updater<ColumnSizingState>) => void;

  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void;
}

export interface ColumnSizingColumnDef {
  enableResizing?: boolean;

  maxSize?: number;

  minSize?: number;

  size?: number;
}

export interface ColumnSizingColumn {
  getCanResize: () => boolean;

  getIsResizing: () => boolean;

  getSize: () => number;

  getStart: (position?: ColumnPinningPosition | "center") => number;

  getAfter: (position?: ColumnPinningPosition | "center") => number;

  resetSize: () => void;
}

export interface ColumnSizingHeader {
  getResizeHandler: (context?: Document) => (event: unknown) => void;

  getSize: () => number;

  getStart: (position?: ColumnPinningPosition) => number;
}

/*#####################################(DEFAULT VALUES)#####################################*/

export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
};

const getDefaultColumnSizingInfoState = (): ColumnSizingInfoState => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
});

/*#####################################(COLUMN SIZING)#####################################*/

export const ColumnSizing: TableFeature = {
  getDefaultColumnDef: (): ColumnSizingColumnDef => {
    return defaultColumnSizing;
  },
  getInitialState: (state): ColumnSizingTableState => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeMode: "onEnd",
      columnResizeDirection: "ltr",
      onColumnSizingChange: makeStateUpdater("columnSizing", table),
      onColumnSizingInfoChange: makeStateUpdater("columnSizingInfo", table),
    };
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getSize = () => {
      const columnSize = table.getState().columnSizing[column.id];

      return Math.min(
        Math.max(
          column.columnDef.minSize ?? defaultColumnSizing.minSize,
          columnSize ?? column.columnDef.size ?? defaultColumnSizing.size
        ),
        column.columnDef.maxSize ?? defaultColumnSizing.maxSize
      );
    };

    column.getStart = memo(
      (position) => [
        position,
        _getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) =>
        columns
          .slice(0, column.getIndex(position))
          .reduce((sum, column) => sum + column.getSize(), 0),
      getMemoOptions(table.options, "debugColumns", "getStart")
    );

    column.getAfter = memo(
      (position) => [
        position,
        _getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) =>
        columns
          .slice(column.getIndex(position) + 1)
          .reduce((sum, column) => sum + column.getSize(), 0),
      getMemoOptions(table.options, "debugColumns", "getAfter")
    );

    column.resetSize = () => {
      table.setColumnSizing(({ [column.id]: _, ...rest }) => {
        return rest;
      });
    };
    column.getCanResize = () => {
      return (
        (column.columnDef.enableResizing ?? true) &&
        (table.options.enableColumnResizing ?? true)
      );
    };
    column.getIsResizing = () => {
      return table.getState().columnSizingInfo.isResizingColumn === column.id;
    };
  },

  createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: Table<TData>
  ): void => {
    header.getSize = () => {
      let sum = 0;

      const recurse = (header: Header<TData, TValue>) => {
        if (header.subHeaders.length) {
          header.subHeaders.forEach(recurse);
        } else {
          sum += header.column.getSize() ?? 0;
        }
      };

      recurse(header);

      return sum;
    };
    header.getStart = () => {
      if (header.index > 0) {
        const prevSiblingHeader = header.headerGroup.headers[header.index - 1]!;
        return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
      }

      return 0;
    };
    header.getResizeHandler = (_contextDocument) => {
      const column = table.getColumn(header.column.id);
      const canResize = column?.getCanResize();

      return (e: unknown) => {
        if (!column || !canResize) {
          return;
        }

        (e as any).persist?.();

        if (isTouchStartEvent(e)) {
          // lets not respond to multiple touches (e.g. 2 or 3 fingers)
          if (e.touches && e.touches.length > 1) {
            return;
          }
        }

        const startSize = header.getSize();

        const columnSizingStart: [string, number][] = header
          ? header
              .getLeafHeaders()
              .map((d) => [d.column.id, d.column.getSize()])
          : [[column.id, column.getSize()]];

        const clientX = isTouchStartEvent(e)
          ? Math.round(e.touches[0]!.clientX)
          : (e as MouseEvent).clientX;

        const newColumnSizing: ColumnSizingState = {};

        const updateOffset = (
          eventType: "move" | "end",
          clientXPos?: number
        ) => {
          if (typeof clientXPos !== "number") {
            return;
          }

          table.setColumnSizingInfo((old) => {
            const deltaDirection =
              table.options.columnResizeDirection === "rtl" ? -1 : 1;
            const deltaOffset =
              (clientXPos - (old?.startOffset ?? 0)) * deltaDirection;
            const deltaPercentage = Math.max(
              deltaOffset / (old?.startSize ?? 0),
              -0.999999
            );

            old.columnSizingStart.forEach(([columnId, headerSize]) => {
              newColumnSizing[columnId] =
                Math.round(
                  Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
                ) / 100;
            });

            return {
              ...old,
              deltaOffset,
              deltaPercentage,
            };
          });

          if (
            table.options.columnResizeMode === "onChange" ||
            eventType === "end"
          ) {
            table.setColumnSizing((old) => ({
              ...old,
              ...newColumnSizing,
            }));
          }
        };

        const onMove = (clientXPos?: number) =>
          updateOffset("move", clientXPos);

        const onEnd = (clientXPos?: number) => {
          updateOffset("end", clientXPos);

          table.setColumnSizingInfo((old) => ({
            ...old,
            isResizingColumn: false,
            startOffset: null,
            startSize: null,
            deltaOffset: null,
            deltaPercentage: null,
            columnSizingStart: [],
          }));
        };

        const contextDocument = safelyAccessDocument(_contextDocument);

        const mouseEvents = {
          moveHandler: (e: MouseEvent) => onMove(e.clientX),
          upHandler: (e: MouseEvent) => {
            contextDocument?.removeEventListener(
              "mousemove",
              mouseEvents.moveHandler
            );
            contextDocument?.removeEventListener(
              "mouseup",
              mouseEvents.upHandler
            );
            onEnd(e.clientX);
          },
        };

        const touchEvents = {
          moveHandler: (e: TouchEvent) => {
            if (e.cancelable) {
              e.preventDefault();
              e.stopPropagation();
            }
            onMove(e.touches[0]!.clientX);
            return false;
          },
          upHandler: (e: TouchEvent) => {
            contextDocument?.removeEventListener(
              "touchmove",
              touchEvents.moveHandler
            );
            contextDocument?.removeEventListener(
              "touchend",
              touchEvents.upHandler
            );
            if (e.cancelable) {
              e.preventDefault();
              e.stopPropagation();
            }
            onEnd(e.touches[0]?.clientX);
          },
        };

        const passiveIfSupported = passiveEventSupported()
          ? { passive: false }
          : false;

        if (isTouchStartEvent(e)) {
          contextDocument?.addEventListener(
            "touchmove",
            touchEvents.moveHandler,
            passiveIfSupported
          );
          contextDocument?.addEventListener(
            "touchend",
            touchEvents.upHandler,
            passiveIfSupported
          );
        } else {
          contextDocument?.addEventListener(
            "mousemove",
            mouseEvents.moveHandler,
            passiveIfSupported
          );
          contextDocument?.addEventListener(
            "mouseup",
            mouseEvents.upHandler,
            passiveIfSupported
          );
        }

        table.setColumnSizingInfo((old) => ({
          ...old,
          startOffset: clientX,
          startSize,
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart,
          isResizingColumn: column.id,
        }));
      };
    };
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnSizing = (updater) =>
      table.options.onColumnSizingChange?.(updater);
    table.setColumnSizingInfo = (updater) =>
      table.options.onColumnSizingInfoChange?.(updater);
    table.resetColumnSizing = (defaultState) => {
      table.setColumnSizing(
        defaultState ? {} : table.initialState.columnSizing ?? {}
      );
    };
    table.resetHeaderSizeInfo = (defaultState) => {
      table.setColumnSizingInfo(
        defaultState
          ? getDefaultColumnSizingInfoState()
          : table.initialState.columnSizingInfo ??
              getDefaultColumnSizingInfoState()
      );
    };
    table.getTotalSize = () =>
      table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize();
      }, 0) ?? 0;
    table.getLeftTotalSize = () =>
      table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize();
      }, 0) ?? 0;
    table.getCenterTotalSize = () =>
      table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize();
      }, 0) ?? 0;
    table.getRightTotalSize = () =>
      table.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize();
      }, 0) ?? 0;
  },
};

let passiveSupported: boolean | null = null;
export function passiveEventSupported() {
  if (typeof passiveSupported === "boolean") return passiveSupported;

  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      },
    };

    const noop = () => {};

    globalThis.addEventListener("test", noop, options);
    globalThis.removeEventListener("test", noop);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}

function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === "touchstart";
}
