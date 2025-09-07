// deno-lint-ignore-file jsx-no-children-prop
import {
  Table,
  TableCell,
  TableHeaderBar,
  type ColumnDef,
  type Row,
} from "@inspatial/kit/data-flow";
import { View, Slot, YStack } from "@inspatial/kit/structure";
import { Button } from "@inspatial/kit/ornament";
import { Text } from "@inspatial/kit/typography";
import { EntryProps, useCounter } from "../(example)/counter/state.ts";
import { PlusIcon } from "@in/widget/icon/plus-icon.tsx";
import { Modal } from "@in/widget/presentation/modal/index.tsx";
import { Drawer } from "@in/widget/presentation/drawer/index.tsx";
import { ShareIIIcon } from "@in/widget/icon/share-ii-icon.tsx";
import { XStack } from "@inspatial/kit/structure";
// @ts-types="@inspatial/kit"
import { SettingsIcon, APIIcon } from "@inspatial/kit/icon";

export function EditorView() {
  const entries = useCounter.entries;
  // const checkedRows = createSignal(new Set<string>());
  // const allChecked = createSignal(false);

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

  /*#################################(Presentation)#################################*/
  const modals = [
    <Modal
      key="create-new-collection"
      id="create-new-collection"
      className="p-8"
    >
      <Text className="text-2xl mb-4">New Collection</Text>
    </Modal>,

    <Modal key="import-export-modal" id="import-export-modal" className="p-8">
      <Text className="text-2xl mb-4">Import/Export Entries</Text>
    </Modal>,

    <Modal
      key="create-new-field-modal"
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
    />,

    <Modal
      key="update-field-modal"
      id="update-field-modal"
      children={{
        view: [
          {
            children: (
              <YStack className="p-6 gap-3">
                <Text className="text-xl font-semibold">Update Field</Text>
              </YStack>
            ),
          },
        ],
      }}
    />,
  ];

  const drawers = [
    <Drawer key="api-docs-drawer" id="api-docs-drawer">
      <Text>API Docs Form</Text>
    </Drawer>,

    <Drawer key="settings-drawer" id="settings-drawer">
      <Text>Settings Form</Text>
    </Drawer>,

    <Drawer key="create-new-entry-drawer" id="create-new-entry-drawer">
      <Text>New Entry Form</Text>
    </Drawer>,

    <Drawer key="update-entry-drawer" id="update-entry-drawer">
      <Text>Update Entry Form</Text>
    </Drawer>,
  ];

  /*#################################(Render)#################################*/

  return (
    <>
      {/* <View className="mt-[64px]"> */}
      <Table
        columns={fields}
        data={entries.get()}
        filterColumn="name"
        getRowId={(row: EntryProps) => String(row.id)}
        // checkedRows={checkedRows.get()}
        // allChecked={allChecked.get()}
        // onAllChecked={handleAllChecked}
        // onRowChecked={handleRowChecked}
        // dockMenuActions={dockMenuActions}

        navigator={{
          selected: "user",
          "on:input": (label: string) =>
            console.log("Navigator changed:", label),
          children: [{ label: "User" }, { label: "Post" }],
          cta: {
            children: <PlusIcon scale="9xs" />,
            "on:presentation": {
              id: "create-new-collection",
              action: "toggle",
            },
          },
        }}
        relations={{
          selected: "profiles",
          "on:input": (label: string) =>
            console.log("Relations changed:", label),
          children: [
            { label: "Profiles" },
            { label: "Organizations" },
            { label: "Sessions" },
            { label: "Activity" },
            { label: "Payments" },
          ],
        }}
        headerBar={{
          display: true,
          cta: {
            display: true,

            actions: [
              {
                children: <APIIcon scale="9xs" />,
                format: "outlineBackground",
                size: "lg",
                "on:presentation": {
                  id: "api-docs-drawer",
                  action: "toggle",
                },
              },

              {
                children: <SettingsIcon />,
                format: "outlineBackground",
                size: "lg",
                "on:presentation": {
                  id: "settings-drawer",
                  action: "toggle",
                },
              },

              {
                children: <ShareIIIcon />,
                format: "outlineBackground",
                size: "lg",
                "on:presentation": {
                  id: "import-export-modal",
                  action: "toggle",
                },
              },

              {
                children: "New Entry",
                "on:presentation": {
                  id: "create-new-entry-drawer",
                  action: "toggle",
                },
              },
              // Full JSX element approach
            ],
          },
        }}
        presentations={{
          modals,
          drawers,
        }}
      />
      {/* </View> */}
    </>
  );
}
