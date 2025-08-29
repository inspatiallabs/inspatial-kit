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
  TableHeaderColumn,
  TableHeader,
  TableRow,
  TableHeaderBar,
} from "./primitive.tsx";
import { $ } from "@in/teract/signal/index.ts";
import { Button } from "../../ornament/button/index.ts";
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
import { PlusPrimeIcon } from "../../icon/plus-prime-icon.tsx";
import { Modal } from "../../presentation/modal/index.tsx";
import { Drawer } from "../../presentation/drawer/index.tsx";

// import { DropdownMenu } from "../../navigation/dropdown-menu/index.tsx";
// import { Switch } from "../../input/switch/index.tsx";
// import { Checkbox } from "../../input/checkbox/index.tsx";

// TODO: Implement Table as composable component with multiple formats
// - base, zebra (current), spreadsheet
// - create a Base variant for managing database tables

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
  if (!data || !columns) {
    return <Text>No data or columns provided to table</Text>;
  }

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
  };

  const hasSelectionColumn = columns.some((col) => col.id === "select");

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
    state: {
      sorting: useTable.sorting.get(),
      columnFilters: useTable.columnFilters.get(),
      columnVisibility: useTable.columnVisibility.get(),
      pagination: useTable.pagination.get(),
    },
    onSortingChange: useTable.action.setSorting,
    onColumnFiltersChange: useTable.action.setColumnFilters,
    onColumnVisibilityChange: useTable.action.setColumnVisibility,
    onPaginationChange: useTable.action.setPagination,
    manualPagination: false,
    pageCount: Math.ceil(
      data.length / (useTable.pagination.peek()?.pageSize || 10)
    ),
  });

  const rows = $(() => {
    useTable.sorting.get();
    useTable.columnFilters.get();
    useTable.pagination.get();

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
      arrowHover: false,
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
            <TableCell
              format="cell-span"
              className="w-full"
              on:tap={() => {
                if (col.getCanSort?.()) col.toggleSorting?.();
              }}
              on:hover={(hovering: any) => headerState.arrowHover.set(hovering)}
            >
              <XStack className="items-center gap-2">
                <Show
                  when={() => headerState.arrowHover.get()}
                  otherwise={
                    <ArrowSwapIcon
                      size="sm"
                      on:tap={() => {
                        if (col.getCanSort?.()) {
                          col.toggleSorting?.();
                        }
                      }}
                      style={{
                        web: {
                          transition: "transform 120ms ease",
                          transform: "rotate(0deg)",
                        },
                      }}
                    />
                  }
                >
                  <ArrowSwapIcon
                    size="sm"
                    style={{
                      web: {
                        transition:
                          "transform 120ms ease, background-color 120ms ease",
                        transform: "rotate(90deg)",
                        backgroundColor: "var(--surface)",
                        borderRadius: "var(--radius-xl)",
                        padding: "2px",
                        fontWeight: "bold",
                      },
                    }}
                    on:tap={() => {
                      if (col.getCanSort?.()) {
                        col.toggleSorting?.();
                      }
                    }}
                  />
                </Show>
                <Text>{label}</Text>
              </XStack>
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

  /*#################################(RENDER)#################################*/
  try {
    return (
      <>
        <ScrollView
          scrollable={false}
          style={{
            web: {
              width: "100%",
            },
          }}
        >
          {/* <Modal
            id="import-export-modal"
            className="p-8"
            size="base"
            radius="4xl"
            overlayFormat="transparent"
          
          >
            <Text className="text-2xl mb-4">Simple Modal</Text>
            <Text>This modal uses direct children without widget tree.</Text>
            <Button
              className="mt-4"
              on:presentation={{
                id: "import-export-modal",
                action: "close",
              }}
            >
              Close
            </Button>
          </Modal> */}

          {/* <Modal
            id="import-export-modal"
            children={{
              // 1. Custom Overlay
              overlay: {
                className: "!bg-(--brand)/10",
                overlayFormat: "transparent",
              },

              // 2. Custom View
              view: [
                {
                  className: "p-12 !bg-yellow-100 text-black",
                  size: "base",
                  radius: "none",
                  children: (
                    <YStack className="p-6 gap-3">
                      <Text className="text-xl font-semibold">
                        Counter Help
                      </Text>
                      <Text>
                        Use the buttons to adjust the counter and explore
                        trigger props. This modal is controlled via
                        on:presentation.
                      </Text>
                      <Slot className="flex justify-end">
                        <Button
                          format="outline"
                          on:presentation={{
                            id: "import-export-modal",
                            action: "close",
                          }}
                        >
                          Close
                        </Button>
                      </Slot>
                    </YStack>
                  ),
                },
              ],

              // 3. Optional Wrapper Customization (99% of the time you don't need this)
              // wrapper: {},
            }}
          /> */}

          <Drawer id="new-entry-drawer">
            <Text>New Entry</Text>
          </Drawer>

          {/*#################################(Table Header Bar)#################################*/}
          <TableHeaderBar
            pagination={{
              display: true,
              prev: { "on:tap": () => table.previousPage() } as any,
              next: { "on:tap": () => table.nextPage() } as any,
            }}
            filter={{ display: true }}
            search={
              {
                display: Boolean(filterColumn),
                placeholder: filterColumn
                  ? `Search by ${formatColumnName(filterColumn)}...`
                  : "Search...",
                value:
                  (filterColumn &&
                    (table
                      .getColumn(filterColumn)
                      ?.getFilterValue() as string)) ||
                  "",
                "on:input": (event: any) => {
                  if (!filterColumn) return;
                  const raw =
                    typeof event === "string" ? event : event?.target?.value;
                  const next = typeof raw === "string" ? raw.trim() : raw;
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(next ? next : undefined);
                },
              } as any
            }
            actions={{
              display: true,

              importExport: {
                "on:presentation": {
                  id: "import-export-modal",
                  action: "toggle",
                },
              },

              newEntry: {
                "on:presentation": {
                  id: "new-entry-drawer",
                  action: "toggle",
                },
              },
            }}
          />

          {/* Table Wrapper */}
          <TableWrapper>
            {/*#################################(Table Header)#################################*/}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    /*********************************(Table Header Columns)*********************************/
                    <TableHeaderColumn key={header.id}>
                      {header.isPlaceholder ? null : typeof header.column
                          .columnDef.header === "function" ? (
                        cellRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      ) : (
                        <Slot>{renderDefaultHeader(header)}</Slot>
                      )}
                    </TableHeaderColumn>
                  ))}
                  <Button
                    size="md"
                    format="background"
                    radius="none"
                    style={{
                      web: {
                        position: "absolute",
                        right: "0px",
                        color: "var(--primary)",
                        width: "fit-content",
                        height: "100%",
                      },
                    }}
                  >
                    <PlusPrimeIcon />
                  </Button>
                </TableRow>
              ))}
            </TableHeader>

            {/*#################################(Table List)#################################*/}
            <TableList each={rows}>
              {(row: any) => (
                <TableRow
                  key={getRowId(row.original)}
                  data-state={
                    checkedRows.has(getRowId(row.original)) && "selected"
                  }
                  on:tap={() => onRowClick && onRowClick(row.original)}
                  on:rightclick={(e: any) => handleContextMenu(e, row.original)}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {cellRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
            <XStack className="m-auto w_full justify=center">
              {(dockMenuActions ?? []).map((action, index) => (
                <Dock
                  axis="x"
                  minimized={false}
                  toggle={{ modes: ["minimize"] }}
                >
                  <Slot on:tap={action.onClick}>{action.icon}</Slot>
                </Dock>
              ))}
            </XStack>
          )}
        </ScrollView>
      </>
    );
  } catch (error) {
    console.error("Table rendering error:", error);
    return (
      <Text>
        Error rendering table:{" "}
        {String((error as any)?.message || "Unknown error")}
      </Text>
    );
  }
}
