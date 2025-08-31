import { createSignal, type Signal } from "@in/teract/signal/index.ts";
import { createTableCore } from "./src/index.ts";
import type {
  RowData,
  Table,
  TableOptions,
  TableOptionsResolved,
  TableState,
  Updater,
} from "./src/index.ts";

/*#################################(CREATE INSPATIAL TABLE)#################################*/
function createInSpatialTable<TData extends RowData>(
  options: TableOptions<TData>
): Table<TData> {
  // Create initial resolved options
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  };

  // Create the core table instance
  const table = createTableCore(resolvedOptions);

  // Create a signal for managing table state
  const stateSignal = createSignal<TableState>(table.initialState);

  // Compose internal state management with user-provided state
  table.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...stateSignal.get(),
      ...options.state,
    },
    onStateChange: (updater: Updater<TableState>) => {
      // Update our internal state signal
      if (typeof updater === "function") {
        stateSignal.set(updater(stateSignal.get()));
      } else {
        stateSignal.set(updater);
      }

      // Call user's onStateChange if provided
      options.onStateChange?.(updater);
    },
  }));

  // Create a generic state update interceptor
  const stateKeys = [
    "sorting",
    "columnFilters",
    "columnVisibility",
    "pagination",
    "rowSelection",
    "expanded",
    "grouping",
    "columnOrder",
    "columnPinning",
    "rowPinning",
    "globalFilter",
  ] as const;

  const stateUpdateInterceptors: any = {};

  // Dynamically create interceptors for all state keys
  stateKeys.forEach((key) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    const handlerName =
      `on${capitalizedKey}Change` as keyof TableOptions<TData>;

    if (options[handlerName] || table.options[handlerName]) {
      stateUpdateInterceptors[handlerName] = (updater: Updater<any>) => {
        // Update internal state
        table.setState((old) => ({
          ...old,
          [key]:
            typeof updater === "function"
              ? updater((old as any)[key])
              : updater,
        }));
        // Forward to user handler
        const handler = options[handlerName] as any;
        handler?.(updater);
      };
    }
  });

  // Apply all interceptors
  if (Object.keys(stateUpdateInterceptors).length > 0) {
    table.setOptions((prev) => ({
      ...prev,
      ...stateUpdateInterceptors,
    }));
  }

  // Add InSpatial-specific enhancements
  (table as any)._stateSignal = stateSignal;

  // Override state getter to use signal
  const originalGetState = table.getState.bind(table);
  table.getState = () => ({
    ...originalGetState(),
    ...stateSignal.get(),
  });

  return table;
}
/*#################################(CREATE TABLE)#################################*/
/**
 * Hook-like function for creating a reactive table with InSpatial
 * Returns both the table instance and a state signal for fine-grained reactivity
 */
export function createTable<TData extends RowData>(
  options: TableOptions<TData>
): {
  table: Table<TData>;
  state: Signal<TableState>;
} {
  const table = createInSpatialTable(options);
  const state = (table as any)._stateSignal as Signal<TableState>;

  return { table, state };
}
