import { Table, type ColumnDef } from "@inspatial/kit/control-flow";
import { EntryProps, useCounter } from "../counter/state.ts";

export function TableView() {
  const entries = useCounter.entries;
  const columns: ColumnDef<EntryProps, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
  ];

  return (
    <>
      <Table<EntryProps, any>
        columns={columns}
        data={entries.get()}
        filterColumn="name"
        getRowId={(row) => String(row.id)}
        checkedRows={new Set<string>()}
      />
    </>
  );
}
