import { createTableCore } from "./src/index.ts";
import type {
  RowData,
  Table,
  TableOptions,
  TableOptionsResolved,
} from "./src/index.ts";

/*#####################################(CREATE TABLE)#####################################*/

export function createTable<TData extends RowData>(
  options: TableOptions<TData>
): Table<TData> {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  };
  return createTableCore(resolvedOptions);
}
