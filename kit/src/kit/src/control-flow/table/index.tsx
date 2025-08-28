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
  TableList,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./primitive.tsx";
import { $ } from "@in/teract/signal/index.ts";
import { Button } from "../../ornament/button/index.ts";
import { InputField } from "../../input/inputfield/inputfield.native.tsx";

import { CaretDownPrimeIcon } from "../../icon/caret-down-prime-icon.tsx";
import { CaretLeftPrimeIcon } from "../../icon/caret-left-prime-icon.tsx";
import { CaretRightPrimeIcon } from "../../icon/caret-right-prime-icon.tsx";
import { ArrowSwapIcon } from "../../icon/arrow-swap-icon.tsx";
import { Dock } from "../../presentation/dock/index.tsx";
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
import { cellRender } from "./cell-render.ts";
import { createState } from "@in/teract/state/state.ts";
import { Show } from "../show/index.ts";
import { DotSixIcon } from "../../icon/dot-six-icon.tsx";
import { PencilIcon } from "../../icon/pencil-icon.tsx";

// import { DropdownMenu } from "../../navigation/dropdown-menu/index.tsx";
// import { Switch } from "../../input/switch/index.tsx";
// import { Checkbox } from "../../input/checkbox/index.tsx";

// TODO: Implement Table as composable component with multiple variants
// This will be - dataList Variant
// - create a Base variant for managing database tables
// use full power of tanstack/react-table

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

  const inputChoiceColumn: ColumnDef<TData, any> = {
    id: "select",
    header: ({ table }) => null,
    cell: ({ row }) => (
      <>
        <input
          type="checkbox"
          className="print:hidden"
          aria-label="Select all"
          checked={allChecked as any}
          on:input={(checked: any) => onAllChecked?.(!!checked)}
        />
      </>
    ),
    // enableSorting: false,
    // enableHiding: false,
  };

  // Check if the selection column already exists in the columns array
  // If it does, then we don't need to add it again
  // However, this means you have to implement your own
  // Checkbox selection logic in the cell
  const hasSelectionColumn = columns.some((col) => col.id === "select");

  // Only add the selection column if it doesn't already exist
  const allColumns = hasSelectionColumn
    ? columns
    : [inputChoiceColumn, ...columns];

  const { table, state } = createTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: useTable.snapshot(),
    state: useTable.snapshot(),
    onSortingChange: useTable.action.setSorting,
    onColumnFiltersChange: useTable.action.setColumnFilters,
    onColumnVisibilityChange: useTable.action.setColumnVisibility,
    onPaginationChange: useTable.action.setPagination,
    manualPagination: false, // Let the table handle pagination automatically
    pageCount: Math.ceil(
      data.length / (useTable.pagination.peek()?.pageSize || 10)
    ),
  });

  const rows = $(() => {
    state.get();
    return table.getRowModel().rows;
  });

  const formatColumnName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  /*#################################(DEFAULT HEADER)#################################*/
  function renderDefaultHeader(header: any): JSX.Element {
    const col = header.column;
    const def = col.columnDef;
    const label =
      typeof def.header === "string" && def.header
        ? def.header
        : formatColumnName(col.id);

    const headerState = createState({
      hover: false,
    });

    return (
      <>
        <Stack
          style={{
            web: {
              width: "100%",
              justifyContent: "space-between",
              position: "relative",
            },
          }}
          on:hover={(hovering: any) => headerState.hover.set(hovering)}
        >
          <Slot
            style={{
              web: {
                width: "100%",
              },
            }}
          >
            <TableCell format="cell-span" className="w-full">
              <ArrowSwapIcon
                size="sm"
                on:tap={() => {
                  if (col.getCanSort?.()) col.toggleSorting?.();
                }}
              />
              <Text>{label}</Text>
            </TableCell>
          </Slot>

          <Show when={() => headerState.hover.get()} otherwise={null}>
            <XStack
              gap={1}
              style={{
                web: {
                  position: "absolute",
                  right: "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              }}
            >
              <Button
                size="xs"
                style={{
                  web: {
                    borderRadius: "4px 0px 0px 4px",
                  },
                }}
              >
                <PencilIcon size="xs" />
              </Button>
              <Button
                size="xs"
                style={{
                  web: {
                    borderRadius: "0px 4px 4px 0px",
                    backgroundColor: "var(--surface)",
                  },
                }}
              >
                <DotSixIcon size="xs" />
              </Button>
            </XStack>
          </Show>
        </Stack>
      </>
    );
  }

  return (
    <>
      <ScrollView scrollable={false}>
        {/* Filter and column visibility controls*/}
        <XStack className="print:hidden items-center py-4">
          {filterColumn && (
            <InputField
              variant="searchfield"
              format="base"
              placeholder={`Search by ${formatColumnName(filterColumn)}...`}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                ""
              }
              on:input={(event: any) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event?.target?.value || event)
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
                    {header.isPlaceholder ? null : typeof header.column
                        .columnDef.header === "function" ? (
                      cellRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    ) : (
                      <Slot>{renderDefaultHeader(header)}</Slot>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableList each={rows} track="id">
            {(row: any) => (
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
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {cellRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableList>
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
              {(contextMenuActions ?? []).map((action, index) => (
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
            {(dockMenuActions ?? []).map((action, index) => (
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
