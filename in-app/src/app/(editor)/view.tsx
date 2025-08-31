import {
  Table,
  TableCell,
  type ColumnDef,
  type Row,
} from "@inspatial/kit/data-flow";
import { ScrollView, Slot } from "@inspatial/kit/structure";
import { Button } from "@inspatial/kit/ornament";
import { Text } from "@inspatial/kit/typography";
import { InSpatialIcon } from "@inspatial/kit/icon";
import { EntryProps, useCounter } from "../(example)/counter/state.ts";
// import { InSpatialIcon } from "@inspatial/kit/components";

export function EditorView() {
  const entries = useCounter.entries;

  const fields: ColumnDef<EntryProps>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: Row<EntryProps> }) => row.original.id,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: Row<EntryProps> }) => row.original.name,
    },
    // {
    //   accessorKey: "name",
    //   header: "Name",
    //   cell: ({ row }: { row: Row<EntryProps> }) => row.original.name,
    // },
  ];

  //   const dockMenuActions = () => {
  //     const actions = [
  //       {
  //         label: "Delete",
  //         icon: <InSpatialIcon />,
  //         on: tap(() => alert("Delete")),
  //       },
  //     ];

  //     if (entries.gte(1)) {
  //       actions.push({
  //         label: "Edit",
  //         icon: <InSpatialIcon />,
  //         on: tap(() => alert("Edit")),
  //       });
  //     }

  //     return actions;
  //   };

  return (
    <>
      {/* <ScrollView className="mt-[64px]"> */}
        <Table
          columns={fields}
          data={entries.get()}
          filterColumn="name"
          getRowId={(row: EntryProps) => String(row.id)}
          checkedRows={new Set<string>()}
          // dockMenuActions={dockMenuActions}
        />
      {/* </ScrollView> */}
    </>
  );
}
