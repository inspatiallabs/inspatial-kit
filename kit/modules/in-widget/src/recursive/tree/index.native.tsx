// deno-lint-ignore-file jsx-no-children-prop
import {
  checkboxesFeature,
  createOnDropHandler,
  dragAndDropFeature,
  expandAllFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
  searchFeature,
  renamingFeature,
  propMemoizationFeature,
} from "./src/index.ts";
import { TreeWrapper, TreeItem, TreeItemLabel } from "./primitive.tsx";
import { createTree } from "./create-tree.ts";
import { Slot, YStack } from "@in/widget/structure/index.ts";
import { List } from "@in/widget/data-flow/index.ts";
import {
  FileIcon,
  FolderNotchIcon,
  FolderNotchOpenIcon,
  Icon,
} from "@in/widget/icon/index.ts";
import { XStack } from "@in/widget/structure/stack/index.tsx";
import { Show } from "@in/widget/control-flow/index.ts";
import type { TreeAnchorProps } from "./type.ts";
import { createState, $ } from "@in/teract/state";
import { createAction } from "@in/teract/state/action.ts";
import { Checkbox, SearchField, InputField } from "@in/widget/input/index.ts";
import { Button } from "@in/widget/ornament/button/index.ts";
import { Text } from "@in/widget/typography/index.ts";
import { Modal } from "@in/widget/presentation/modal/index.tsx";

const initialItems: Record<string, TreeAnchorProps> = {
  company: {
    name: "Company",
    children: ["engineering", "marketing", "operations"],
  },
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend", "platform-team"],
  },
  frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
  "design-system": {
    name: "Design System",
    children: ["components", "tokens", "guidelines"],
  },
  components: { name: "Components" },
  tokens: { name: "Tokens" },
  guidelines: { name: "Guidelines" },
  "web-platform": { name: "Web Platform" },
  backend: { name: "Backend", children: ["apis", "infrastructure"] },
  apis: { name: "APIs" },
  infrastructure: { name: "Infrastructure" },
  "platform-team": { name: "Platform Team" },
  marketing: { name: "Marketing", children: ["content", "seo"] },
  content: { name: "Content" },
  seo: { name: "SEO" },
  operations: { name: "Operations", children: ["hr", "finance"] },
  hr: { name: "HR" },
  finance: { name: "Finance" },
};

const indent = 10;

export function Tree() {
  try {
    /*##############################(STATE)##############################*/

    const useTree = createState({
      items: initialItems,
      searchQuery: "",
      showHelp: false,
    });

    const setSearchQuery = createAction(
      [useTree, "searchQuery"],
      (current, searchQuery) => searchQuery
    );

    /*##############################(CREATE TREE)##############################*/
    const tree = createTree<TreeAnchorProps>({
      initialState: {
        expandedItems: ["engineering", "frontend", "design-system"],
        selectedItems: ["components"],
        checkedItems: [],
      },
      // Checkbox configuration
      propagateCheckedState: false, // Don't auto-propagate to prevent unwanted checking
      canCheckFolders: true, // Allow checking folders
      indent,
      rootItemId: "company",
      getItemName: (item) => item.getItemData().name,
      isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
      canReorder: true,
      onDrop: createOnDropHandler((parentItem, newChildrenIds) => {
        const prevItems = useTree.items.peek();
        useTree.items.set({
          ...prevItems,
          [parentItem.getId()]: {
            ...prevItems[parentItem.getId()],
            children: newChildrenIds,
          },
        });
      }),
      dataLoader: {
        getItem: (itemId) => useTree.items.peek()[itemId],
        getChildren: (itemId) => useTree.items.peek()[itemId]?.children ?? [],
      },
      features: [
        expandAllFeature,
        syncDataLoaderFeature,
        hotkeysCoreFeature,
        checkboxesFeature,
        selectionFeature,
        searchFeature,
        renamingFeature,
        dragAndDropFeature,
        keyboardDragAndDropFeature,
        propMemoizationFeature,
      ],
      // Search configuration
      setSearch: (search) => setSearchQuery(search || ""),
      isSearchMatchingItem: (search, item) =>
        search.length > 0 &&
        item.getItemName().toLowerCase().includes(search.toLowerCase()),
      // Renaming configuration
      onRename: (item, newName) => {
        const prevItems = useTree.items.peek();
        const itemId = item.getId();
        useTree.items.set({
          ...prevItems,
          [itemId]: {
            ...prevItems[itemId],
            name: newName,
          },
        });
      },
    });

    // Create a computed list of filtered items based on search
    const filteredItems = $(() => {
      // Track tree items to trigger recomputation
      const allItems = tree.items;
      const searchValue = tree.getSearchValue();

      if (!searchValue || searchValue.trim() === "") {
        return allItems;
      }

      // Get all matching items and their ancestors
      const matchingItems = tree.getSearchMatchingItems();
      if (matchingItems.length === 0) {
        return []; // No matches, show empty tree
      }

      const matchingIds = new Set(matchingItems.map((item) => item.getId()));

      // Also include parent items to maintain tree structure
      const itemsToShow = new Set(matchingIds);
      matchingItems.forEach((item) => {
        let parent = item.getParent();
        while (parent) {
          itemsToShow.add(parent.getId());
          parent = parent.getParent();
        }
      });

      // Filter tree items to only show matching and their ancestors
      return allItems.filter((item) => itemsToShow.has(item.getId()));
    });

    /*##############################(RENDER TREE)##############################*/
    return (
      <>
        <Modal id="tree-help-modal">
          {/* @ts-ignore */}
          <YStack>
            <Text>Keyboard Shortcuts:</Text>
            <Text>• Arrow Up/Down - Navigate items</Text>
            <Text>• Arrow Left/Right - Collapse/Expand folders</Text>
            <Text>• Enter - Select item</Text>
            <Text>• Space - Toggle item selection</Text>
            <Text>• Ctrl+Click - Multi-select</Text>
            <Text>• Shift+Click - Range select</Text>
            <Text>• Ctrl+A - Select all</Text>
            <Text>• F2 - Rename selected item</Text>
            <Text>• Type any letter - Start search</Text>
            <Text>• Escape - Close search/rename</Text>
            <Text>• Ctrl+Shift+Plus - Expand all</Text>
            <Text>• Ctrl+Shift+Minus - Collapse all</Text>
            <Text>• Ctrl+Shift+D - Start drag</Text>
          </YStack>
        </Modal>

        <YStack className="h-full *:first:grow" gap={2}>
          {/*=============================(CONTROLS)=============================*/}
          <XStack className="gap-2 p-2 border-b">
            <Button
              format="ghost"
              size="sm"
              on:tap={() => tree.expandAll()}
              title="Expand all folders (Ctrl+Shift+Plus)"
            >
              Expand
            </Button>
            <Button
              format="ghost"
              size="sm"
              on:tap={() => tree.collapseAll()}
              title="Collapse all folders (Ctrl+Shift+Minus)"
            >
              Collapse
            </Button>

            <Button
              format="ghost"
              size="sm"
              on:presentation={{ id: "tree-help-modal", action: "toggle" }}
              title="Show keyboard shortcuts"
            >
              i
            </Button>
          </XStack>

          {/*================================(SEARCH FIELD)================================*/}
          {/* <Show when={tree.isSearchOpen()}> */}
          <SearchField
            value={tree.getSearchValue()}
            placeholder="Search hierarchy..."
            on:input={(value: string) => tree.setSearch(value)}
            on:blur={() => tree.closeSearch()}
            ref={(el: any) => tree.registerSearchInputElement(el)}
          />
          {/* </Show> */}

          {/*================================(TREE WRAPPER)================================*/}
          <TreeWrapper
            indent={indent}
            tree={tree}
            {...tree.getContainerProps("File tree navigation")}
            className="overflow-auto flex-1"
          >
            <List each={filteredItems}>
              {(item: any) => {
                try {
                  return (
                    <TreeItem
                      key={item.getId()}
                      item={item}
                      indent={indent}
                      on:rightclick={(e: any) => {
                        e?.preventDefault?.();
                        // Select the item on right-click
                        if (!item.isSelected()) {
                          tree.setSelectedItems([item.getId()]);
                        }
                        // TODO(@benemma): Add context menu here
                        console.log("Right-clicked on:", item.getItemName());
                      }}
                    >
                      <XStack className="flex items-center gap-2 w-full">
                        {/*================================(CHECKBOX)================================*/}
                        <Show
                          when={
                            tree.getConfig().propagateCheckedState ||
                            tree.getConfig().canCheckFolders ||
                            !item.isFolder()
                          }
                        >
                          <Checkbox
                            selected={item.getCheckboxProps().checked}
                            on:input={() => item.toggleCheckedState()}
                            className="shrink-0"
                            $ref={item.getCheckboxProps().ref}
                          />
                        </Show>

                        <TreeItemLabel item={item}>
                          <XStack className="flex items-center gap-1.5 flex-1">
                            {/*********************(Folder/File Icons)*********************/}
                            <Show when={item.isFolder() && item.isExpanded()}>
                              <FolderNotchOpenIcon
                                size="4xs"
                                className="shrink-0 text-primary"
                              />
                            </Show>
                            <Show when={item.isFolder() && !item.isExpanded()}>
                              <FolderNotchIcon
                                size="4xs"
                                className="shrink-0 text-muted-foreground"
                              />
                            </Show>
                            <Show when={!item.isFolder()}>
                              <FileIcon
                                size="4xs"
                                className="shrink-0 text-muted-foreground"
                              />
                            </Show>

                            {/*********************(Item Name or Rename Input)*********************/}
                            <Show when={item.isRenaming()}>
                              <InputField
                                value={tree.getRenamingValue()}
                                className="h-6 px-1 py-0 text-sm"
                                on:input={(e: any) => {
                                  // Handle both event and direct value
                                  const value =
                                    typeof e === "string"
                                      ? e
                                      : e?.target?.value ||
                                        e?.currentTarget?.value ||
                                        "";
                                  tree.applySubStateUpdate(
                                    "renamingValue",
                                    value
                                  );
                                }}
                                on:blur={() => tree.completeRenaming()} // Save on blur
                                on:keydown={(e: any) => {
                                  if (e?.key === "Enter") {
                                    tree.completeRenaming(); // Save on Enter
                                  } else if (e?.key === "Escape") {
                                    tree.abortRenaming(); // Cancel on Escape
                                  }
                                }}
                                ref={(r: any) =>
                                  setTimeout(() => r?.focus(), 0)
                                } // Focus after render
                              />
                            </Show>
                            <Show when={!item.isRenaming()}>
                              <span
                                className={
                                  item.isMatchingSearch()
                                    ? "bg-yellow-200 dark:bg-yellow-900 px-1 rounded"
                                    : ""
                                }
                              >
                                {item.getItemName()}
                              </span>
                            </Show>
                          </XStack>
                        </TreeItemLabel>
                      </XStack>
                    </TreeItem>
                  );
                } catch (itemError) {
                  console.error(
                    "Tree: Error rendering item",
                    item?.getId?.(),
                    itemError
                  );
                  return <Slot>Error rendering item: {String(itemError)}</Slot>;
                }
              }}
            </List>
          </TreeWrapper>
        </YStack>
      </>
    );
  } catch (error) {
    console.error("Tree component error:", error);
    return <Slot>Error initializing tree: {String(error)}</Slot>;
  }
}
