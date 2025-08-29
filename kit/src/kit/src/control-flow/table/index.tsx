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
import { FunnelIcon } from "../../icon/funnel-icon.tsx";
import { APIIcon } from "../../icon/api-icon.tsx";
import { ShareIIIcon } from "../../icon/share-ii-icon.tsx";
import { SettingsIcon } from "../../icon/settings-icon.tsx";
import { PlusPrimeIcon } from "../../icon/plus-prime-icon.tsx";

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
    // Add reactive dependencies
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
                        console.log(
                          "Sort clicked (non-hover)",
                          col.id,
                          col.getCanSort?.()
                        );
                        if (col.getCanSort?.()) {
                          col.toggleSorting?.();
                          console.log(
                            "Sorting state after toggle:",
                            useTable.sorting.get()
                          );
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
                      console.log("Sort clicked", col.id, col.getCanSort?.());
                      if (col.getCanSort?.()) {
                        col.toggleSorting?.();
                        console.log(
                          "Sorting state after toggle:",
                          useTable.sorting.get()
                        );
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
          {/*********************************(Table Header Bar)*********************************/}
          <XStack
            style={{
              web: {
                width: "100%",
                alignItems: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingRight: "50px",
                paddingLeft: "10px",
                backgroundColor: "var(--surface)",
                marginBottom: "2px",
              },
            }}
          >
            {/*----------------------(Paginate With Filters)----------------------*/}
            <XStack
              style={{
                web: {
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                },
              }}
            >
              {/***********(Paginated Buttons)************/}
              <Button
                format="background"
                size="lg"
                style={{
                  web: {
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "4px",
                  },
                }}
                on:tap={() => table.previousPage()}
                // disabled={!table.getCanPreviousPage()}
              >
                <CaretLeftPrimeIcon />
              </Button>
              <Button
                format="background"
                size="lg"
                style={{
                  web: {
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "4px",
                  },
                }}
                on:tap={() => table.nextPage()}
                // disabled={!table.getCanNextPage()}
              >
                <CaretRightPrimeIcon />
              </Button>

              {/***********(Filter Button)************/}
              <Button
                format="outlineBackground"
                style={{
                  web: {
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "0px 6px 0px 10px",
                  },
                }}
              >
                <XStack gap={6} align="center">
                  <Text>Filter</Text>
                  <Slot
                    style={{
                      web: {
                        backgroundColor: "var(--background)",
                        borderRadius: "6px",
                        width: "32px",
                        height: "32px",
                      },
                    }}
                  >
                    <FunnelIcon
                      size="md"
                      style={{
                        web: {
                          padding: "4px",
                        },
                      }}
                    />
                  </Slot>
                </XStack>
              </Button>
            </XStack>
            {/*-------------------------(Search)-----------------------*/}
            {filterColumn && (
              <InputField
                variant="searchfield"
                format="base"
                placeholder={`Search by ${formatColumnName(filterColumn)}...`}
                value={
                  (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                  ""
                }
                on:input={(event: any) => {
                  const raw =
                    typeof event === "string" ? event : event?.target?.value;
                  const next = typeof raw === "string" ? raw.trim() : raw;
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(next ? next : undefined);
                }}
                style={{
                  web: {
                    width: "100%",
                    marginRight: "10px",
                    marginLeft: "10px",
                  },
                }}
              />
            )}

            {/*-------------------------(Actions)-----------------------*/}
            <XStack gap={10}>
              {/***********(API Docs Button)************/}
              <Button
                format="outlineBackground"
                style={{
                  web: {
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "0px 10px 0px 6px",
                  },
                }}
              >
                <XStack gap={6} align="center">
                  <Slot
                    style={{
                      web: {
                        background:
                          "linear-gradient(0deg, rgba(17, 20, 44, 0.50) 0%, rgba(17, 20, 44, 0.50) 100%), radial-gradient(102.81% 102.81% at 70.4% 31.2%, #B53FFE 0%, rgba(144, 0, 255, 0.10) 100%), var(--brand)", // brand-bubble
                        borderRadius: "6px",
                        width: "32px",
                        height: "32px",
                      },
                    }}
                  >
                    <APIIcon
                      size="md"
                      style={{
                        web: {
                          padding: "4px",
                          color: "var(--color-white)",
                        },
                      }}
                    />
                  </Slot>
                  <Text
                    style={{
                      web: {
                        color: "var(--primary)",
                      },
                    }}
                  >
                    Docs
                  </Text>
                </XStack>
              </Button>

              {/***********(Settings Button)************/}
              <Button
                format="outlineBackground"
                size="lg"
                style={{
                  web: {
                    color: "var(--primary)",
                    borderRadius: "8px",
                    padding: "4px",
                  },
                }}
              >
                <SettingsIcon />
              </Button>

              {/***********(Import/Export Button)************/}
              <Button
                format="outlineBackground"
                size="lg"
                style={{
                  web: {
                    color: "var(--primary)",
                    borderRadius: "8px",
                    padding: "4px",
                  },
                }}
              >
                <ShareIIIcon />
              </Button>

              {/***********(New Entry (Row) Button)************/}
              <Button>New Entry</Button>
            </XStack>
          </XStack>

          {/* Table Controls */}
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
                  {/***********(New Table Column Button)************/}
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
        </ScrollView>
      </>
    );
  } catch (error) {
    console.error("Table rendering error:", error);
    return (
      <Text>
        Error rendering table:{" "}
        {
          // @ts-ignore
          String(error?.message || "Unknown error")
        }
      </Text>
    );
  }
}
