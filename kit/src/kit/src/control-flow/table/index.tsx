import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "./src/index.ts";
import { createTable } from "./create-table.ts";
import {
  TableWrapper,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./primitive.tsx";
import { Button } from "../../ornament/button/index.ts";
import { InputField } from "../../input/inputfield/inputfield.native.tsx";

import { CaretDownPrimeIcon } from "../../icon/caret-down-prime-icon.tsx";
import { CaretLeftPrimeIcon } from "../../icon/caret-left-prime-icon.tsx";
import { CaretRightPrimeIcon } from "../../icon/caret-right-prime-icon.tsx";
import { Dock } from "../../presentation/dock/index.tsx";

import { createComponent } from "../../component/index.ts";
import {
  Stack,
  XStack,
  Slot,
  ScrollView,
  YStack,
} from "../../structure/index.ts";
import { Text } from "../../typography/index.ts";
import { Image } from "../../media/image/index.ts";
import { useTableState } from "./state.ts";
import type { TableProps } from "./type.ts";

// import { DropdownMenu } from "../../navigation/dropdown-menu/index.tsx";
// import { Switch } from "../../input/switch/index.tsx";
// import { Checkbox } from "../../input/checkbox/index.tsx";

// TODO: Implement DataTable as composable component with multiple variants
// This will be - dataList Variant
// - create a Base variant for managing database tables
// use full power of tanstack/react-table

/*#################################(FLEX RENDER)#################################*/

function flexRender<TProps>(
  Comp: ((props: TProps) => JSX.Element) | JSX.Element | undefined,
  props: TProps
): JSX.Element {
  if (!Comp) return null;

  if (typeof Comp === "function") {
    return createComponent(Comp, props);
  }

  return Comp;
}

/*#################################(TABLE)#################################*/
export function Table<TData, TValue>({
  columns,
  data,
  filterColumn,
  onRowClick,
  onRowChecked,
  allChecked,
  onAllChecked,
  getRowId,
  checkedRows,
  contextMenuActions,
  dockMenuActions,
  isPublic = false,
}: TableProps<TData, TValue>) {
  const useTable = useTableState<TData>();
  const handleContextMenu = (e: any, row: TData) => {
    useTable.action.openContextMenu({
      row,
      x: e?.event?.clientX ?? 0,
      y: e?.event?.clientY ?? 0,
    });
  };

  const selectedRowCount = (() => checkedRows.size)();

  const selectionColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) =>
      !isPublic && (
        <>
          <input
            type="checkbox"
            checked={allChecked}
            on:input={(checked) => onAllChecked?.(!!checked)}
            className="print:hidden"
            aria-label="Select all"
          />
        </>
      ),
    cell: ({ row }) =>
      !isPublic && (
        <input
          type="checkbox"
          checked={checkedRows.has(getRowId(row.original))}
          on:input={(checked) => onRowChecked?.(row.original, !!checked)}
          className="print:hidden"
          aria-label="Select row"
          on:tap={(e) => e?.stopPropagation?.()}
        />
      ),
    enableSorting: false,
    enableHiding: false,
  };

  // Check if the selection column already exists in the columns array
  // If it does, then we don't need to add it again
  // However, this means you have to implement your own
  // Checkbox selection logic in the cell
  const hasSelectionColumn = columns.some((col) => col.id === "select");

  // Only add the selection column if it doesn't already exist
  const allColumns = hasSelectionColumn
    ? columns
    : [selectionColumn, ...columns];

  const table = createTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: useTable.snapshot(),
    state: useTable.snapshot(),
    onStateChange: (updater: any) => {
      const next =
        typeof updater === "function" ? updater(useTable.snapshot()) : updater;
      useTable.batch(() => {
        if (next.sorting) useTable.sorting.set(next.sorting);
        if (next.columnFilters) useTable.columnFilters.set(next.columnFilters);
        if (next.columnVisibility)
          useTable.columnVisibility.set(next.columnVisibility);
        if (next.pagination) useTable.pagination.set(next.pagination);
      });
    },
    onSortingChange: useTable.action.setSorting,
    onColumnFiltersChange: useTable.action.setColumnFilters,
    onColumnVisibilityChange: useTable.action.setColumnVisibility,
    onPaginationChange: useTable.action.setPagination,
    manualPagination: true, // Set this to true if you're handling pagination on the server
    pageCount: Math.ceil(data.length / useTable.pagination.peek().pageSize),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const formatColumnName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <ScrollView scrollable={false}>
        {/* Filter and column visibility controls*/}
        <XStack className="print:hidden items-center py-4">
          {filterColumn && (
            <InputField
              format="search"
              placeholder={`Search by ${formatColumnName(filterColumn)}...`}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                ""
              }
              on:input={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-full mr-4"
            />
          )}
          <select>
            <option>
              <Button className="flex bg-surface border border-(--muted) min-w-fit max-w-sm justify-between ml-auto gap-3">
                Filter
                <CaretDownPrimeIcon className="size-4 cursor-pointer transition-transform" />
              </Button>
            </option>
            <option>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <XStack
                      key={column.id}
                      className="flex items-center justify-between px-2 py-1"
                    >
                      <Text className="text-primary text-sm mx-2">
                        {formatColumnName(column.id)}
                      </Text>
                      switch coming soon...
                      {/* <Switch
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      /> */}
                    </XStack>
                  );
                })}
            </option>
          </select>
        </XStack>
        {/* Table Controls */}
        <TableWrapper className="relative w-auto border-collapse">
          <TableHeader className="border-b-2 border-(--muted)">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    checkedRows.has(getRowId(row.original)) && "selected"
                  }
                  className={
                    onRowClick
                      ? "cursor-pointer border-y-2 border-(--muted) hover:bg-background"
                      : ""
                  }
                  on:tap={() => onRowClick && onRowClick(row.original)}
                  on:rightclick={(e: any) => handleContextMenu(e, row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // TODO: Add a loading skeleton state and InSpatial Empty Component here...
              <TableRow className="w-full min-w-full h-screen-500">
                <TableCell
                  colSpan={columns.length}
                  className="m-auto pl-[140px] text-center border-t-2 border-(--muted)"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableWrapper>
        {useTable.contextMenu.get() && (
          <>
            <Slot
              className="fixed inset-0"
              on:tap={() => useTable.action.closeContextMenu()}
              style={{ web: { background: "transparent" } }}
            />
            <Stack
              className="fixed p-[5px] shadow-subtle bg-surface z-50 min-w-[200px] max-w-[215px] overflow-hidden rounded-md !border-0  text-sm animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              style={{
                web: {
                  top: useTable.contextMenu.peek()?.y,
                  left: useTable.contextMenu.peek()?.x,
                },
              }}
            >
              {contextMenuActions.map((action, index) => (
                <XStack
                  key={index}
                  on:tap={() => {
                    const row = useTable.contextMenu.peek()?.row as any;
                    action.action(row);
                    useTable.action.closeContextMenu();
                  }}
                  className="relative flex h-[32px] cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm border-none outline-0 outline-none hover:bg-background text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  style={{
                    cursor: "pointer",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {action.icon && (
                    <Image
                      src={action.icon}
                      alt=""
                      style={{
                        marginRight: "8px",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  )}
                  {action.label}
                </XStack>
              ))}
            </Stack>
          </>
        )}
        {/* Dock */}
        {selectedRowCount > 0 && (
          <XStack className="m-auto w-full justify-center">
            {dockMenuActions.map((action, index) => (
              <Dock
                axis="x"
                minimized={false}
                toggle={{
                  modes: ["minimize"],
                }}
              >
                <Slot on:tap={action.onClick}>{action.icon}</Slot>
              </Dock>
            ))}
          </XStack>
        )}
        {/****************Pagination controls****************/}
        <XStack className="items-center justify-between py-4">
          {/* Selected Row Count */}
          <XStack className="gap-4">
            <Text className="print:hidden flex w-auto text-xs text-primary">
              {selectedRowCount} of {table.getFilteredRowModel().rows.length}{" "}
              row(s) selected.
            </Text>
          </XStack>

          {/* Paginated Buttons */}
          <XStack className="print:hidden inline-flex rounded-md ring-1 ring-inset ring-(--muted)">
            <Button
              format="ghost"
              on:tap={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {" "}
              <Text className="sr-only">Previous</Text>{" "}
              <CaretLeftPrimeIcon
                className="size-5 text-damp group-hover:text-damp/50"
                aria-hidden={true}
              />{" "}
            </Button>{" "}
            <Text className="h-5 border-r border-(--muted)" aria-hidden={true}>
              {" "}
            </Text>
            <Button
              format="ghost"
              on:tap={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {" "}
              <Text className="sr-only">Next</Text>{" "}
              <CaretRightPrimeIcon
                className="size-5 text-damp group-hover:text-damp/50 "
                aria-hidden={true}
              />{" "}
            </Button>
          </XStack>

          {/* Page */}
          <XStack className="w-auto">
            <Text className="text-xs text-damp">
              Page{" "}
              <Slot className="font-medium text-gray-900 dark:text-gray-50">{`${
                table.getState().pagination.pageIndex + 1
              }`}</Slot>{" "}
              of{" "}
              <Slot className="font-medium text-gray-900 dark:text-gray-50">
                {" "}
                {`${table.getPageCount()}`}
              </Slot>
            </Text>
          </XStack>
        </XStack>
      </ScrollView>
    </>
  );
}
