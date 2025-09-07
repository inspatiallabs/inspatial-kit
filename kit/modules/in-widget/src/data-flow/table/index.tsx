// deno-lint-ignore-file jsx-no-children-prop
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
  TableHeaderRelations,
} from "./primitive.tsx";
import { $ } from "@in/teract/state";
import { Button } from "@in/widget/ornament/button/index.ts";
import { ArrowSwapIcon } from "@in/widget/icon/arrow-swap-icon.tsx";
import { Dock } from "@in/widget/presentation/dock/index.tsx";
import {
  Stack,
  XStack,
  Slot,
  View,
  YStack,
} from "@in/widget/structure/index.ts";
import { Text } from "@in/widget/typography/index.ts";
import { Image } from "@in/widget/media/image/index.ts";
import { useTableState } from "./state.ts";
import type { TableProps } from "./type.ts";
import { cellRender } from "./cell-render.ts";
import { createState } from "@in/teract/state/state.ts";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import { DotSixIcon } from "@in/widget/icon/dot-six-icon.tsx";
import { PencilIcon } from "@in/widget/icon/pencil-icon.tsx";
import { PlusPrimeIcon } from "@in/widget/icon/plus-prime-icon.tsx";
import { Modal } from "@in/widget/presentation/modal/index.tsx";
import { Drawer } from "@in/widget/presentation/drawer/index.tsx";
import { SecurityKeyIcon } from "@in/widget/icon/security-key-icon.tsx";
import { DirectionRightIcon } from "@in/widget/icon/direction-right-icon.tsx";
import { Switch, Checkbox } from "@in/widget/input/index.ts";
import { Tab } from "@in/widget/ornament/index.ts";

// import { DropdownMenu } from "../../navigation/dropdown-menu/index.tsx";

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

  const selectedRowCount = $(() => {
    const rows =
      typeof checkedRows === "object" && "get" in checkedRows
        ? (checkedRows as any).get()
        : (checkedRows as any);
    return rows?.size || 0;
  });

  const inputChoiceColumn: ColumnDef<TData, any> = {
    id: "select",
    size: 56,
    minSize: 32,
    maxSize: 56,
    enableResizing: false as any,
    header: ({ table }) => (
      <Slot
        style={{
          web: {
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Checkbox
          className="print:hidden"
          aria-label="Select all"
          checked={
            typeof allChecked === "object" && "get" in allChecked
              ? (allChecked as any).get()
              : (allChecked as any)
          }
          on:input={(e: any) => {
            alert("allChecked");
            const checked = e?.target?.checked ?? e;
            onAllChecked?.(!!checked);
          }}
        />
      </Slot>
    ),
    cell: ({ row }) => {
      const rowsSet =
        typeof checkedRows === "object" && "get" in checkedRows
          ? (checkedRows as any).get()
          : (checkedRows as any);
      const isChecked = rowsSet?.has(getRowId(row.original)) || false;
      return (
        <Slot
          style={{
            web: {
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              maxWidth: "56px",
            },
          }}
        >
          <Checkbox
            className="print:hidden"
            aria-label="Select row"
            checked={isChecked}
            on:input={(e: any) => {
              const checked = e?.target?.checked ?? e;
              onRowChecked?.(row.original, !!checked);
            }}
          />
        </Slot>
      );
    },
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
      data.length / (useTable.pagination.peek()?.pageSize || 13)
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

    const handleSortTap = () => {
      if (col.getCanSort?.()) col.toggleSorting?.();
    };

    const renderSortIcon = (labelText: string, hover: boolean) => {
      const isId = String(labelText).trim().toLowerCase() === "id";
      const Icon = isId ? SecurityKeyIcon : ArrowSwapIcon;
      return (
        <Icon
          size="sm"
          on:tap={handleSortTap}
          style={{
            web: hover
              ? {
                  transform: "rotate(90deg)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2px",
                  fontWeight: "bold",
                }
              : {
                  transition: "transform 120ms ease",
                  transform: "rotate(0deg)",
                },
          }}
        />
      );
    };

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
                <Choose
                  cases={[
                    {
                      when: () => headerState.arrowHover.get(),
                      children: () => renderSortIcon(label, true),
                    },
                  ]}
                  otherwise={renderSortIcon(label, false)}
                />
                <Text>{label}</Text>
              </XStack>
            </TableCell>
          </Slot>

          <Choose
            cases={[
              {
                when: () =>
                  headerState.hover.get() &&
                  String(col?.id ?? "")
                    .trim()
                    .toLowerCase() !== "id",
                children: () => (
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
                      on:presentation={{
                        id: "update-field-modal",
                        action: "toggle",
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
                          cursor: "grab",
                        },
                      }}
                    >
                      <DotSixIcon size="xs" />
                    </Button>
                  </XStack>
                ),
              },
            ]}
            otherwise={null}
          />
        </Stack>
      </>
    );
  }

  /*#################################(RENDER)#################################*/
  try {
    return (
      <>
        <View
          scrollable={false}
          style={{
            web: {
              width: "100%",
            },
          }}
        >
          {/*#################################(Table Presentations)#################################*/}

          <Modal id="import-export-modal" className="p-8">
            <Text className="text-2xl mb-4">Import/Export Entries</Text>
          </Modal>

          <Modal
            id="create-new-field-modal"
            children={{
              view: [
                {
                  children: (
                    <YStack className="p-6 gap-3">
                      <Text className="text-xl font-semibold">New Field</Text>
                    </YStack>
                  ),
                },
              ],
            }}
          />

          <Modal
            id="update-field-modal"
            children={{
              view: [
                {
                  children: (
                    <YStack className="p-6 gap-3">
                      <Text className="text-xl font-semibold">
                        Update Field
                      </Text>
                    </YStack>
                  ),
                },
              ],
            }}
          />

          <Drawer id="create-new-entry-drawer">
            <Text>New Entry Form</Text>
          </Drawer>

          <Drawer id="update-entry-drawer">
            <Text>Update Entry Form</Text>
          </Drawer>

          {/*#################################(Table Header Navigator)#################################*/}

          {/*#################################(Table Header Relations)#################################*/}

          <Slot
            style={{
              web: {
                width: "100%",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "var(--surface)",
                marginBottom: "2px",
              },
            }}
          >
            <Tab
              radius="sm"
              format="segmented"
              size="lg"
              selected={"profiles"}
              on:input={(label: any) => {}}
              children={[
                { label: "Profiles" },
                { label: "Organizations" },
                { label: "Sessions" },
                { label: "Activity" },
                { label: "Payments" },
              ]}
            />
          </Slot>

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
                  id: "create-new-entry-drawer",
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
                    <TableHeaderColumn
                      key={header.id}
                      style={{
                        web:
                          String(header?.column?.id ?? "") === "select"
                            ? { width: "56px", maxWidth: "56px", padding: "0" }
                            : String(header?.column?.id ?? "")
                                .trim()
                                .toLowerCase() === "id"
                            ? { width: "70px", maxWidth: "70px" }
                            : {},
                      }}
                    >
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
                    on:presentation={{
                      id: "create-new-field-modal",
                      action: "toggle",
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
                    (typeof checkedRows === "object" && "get" in checkedRows
                      ? (checkedRows as any).get()
                      : (checkedRows as any)
                    )?.has(getRowId(row.original)) && "selected"
                  }
                  on:rightclick={(e: any) => handleContextMenu(e, row.original)}
                  on:tap={() => {
                    onRowClick && onRowClick(row.original);
                  }}
                  on:presentation={{
                    id: "update-entry-drawer",
                    action: "toggle",
                  }}
                >
                  {row.getVisibleCells().map((cell: any, hover: boolean) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        web:
                          String((cell?.column?.id ?? "") as any) === "select"
                            ? { width: "56px", maxWidth: "56px", padding: "0" }
                            : String((cell?.column?.id ?? "") as any)
                                .trim()
                                .toLowerCase() === "id"
                            ? { width: "70px", maxWidth: "70px" }
                            : {},
                      }}
                    >
                      {(() => {
                        const isIdCol =
                          String(cell.column?.id ?? "")
                            .trim()
                            .toLowerCase() === "id";
                        const content = cellRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        );
                        return isIdCol ? (
                          <XStack
                            style={{
                              web: {
                                borderRadius: "var(--radius-full)",
                                background: "var(--surface)",
                                color: "var(--secondary)",
                                width: "fit-content",
                                height: "auto",
                                padding: "4px 10px",
                                alignItems: "center",
                                gap: "4px",
                                minWidth: "68px",
                              },
                            }}
                          >
                            <DirectionRightIcon
                              size="sm"
                              style={{
                                web: {
                                  stroke: "var(--secondary)",
                                },
                              }}
                            />
                            <Slot
                              style={{
                                web: {
                                  marginBottom: "2px",
                                  display: "inline-block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "20px",
                                },
                              }}
                            >
                              {content}
                            </Slot>
                          </XStack>
                        ) : (
                          content
                        );
                      })()}
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
          {selectedRowCount.get() > 0 && (
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
        </View>
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
