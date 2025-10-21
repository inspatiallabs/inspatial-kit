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
import {
  TreeWrapper,
  TreeItem,
  TreeItemLabel,
  TreeAssistiveDescription,
  TreeDragLine,
} from "./primitive.tsx";
import { createTree } from "./create-tree.ts";
import { Slot, YStack } from "@in/widget/structure/index.ts";
import { List } from "@in/widget/data-flow/index.ts";
import {
  ArrowBottomIcon,
  ArrowUpIcon,
  CaretDownPrimeIcon,
  FileIcon,
  FolderNotchIcon,
  FolderNotchOpenIcon,
  Icon,
  XPrimeIcon,
} from "@in/widget/icon/index.ts";
import { XStack } from "@in/widget/structure/stack/index.ts";
import { Show } from "@in/widget/control-flow/index.ts";
import type { TreeAnchorProps } from "./type.ts";
import type { ItemInstance } from "./src/index.ts";
import { createState, createAction, $ } from "@in/teract/state";
import { Checkbox, SearchField, InputField } from "@in/widget/input/index.ts";
import { Button } from "@in/widget/ornament/button/index.ts";
import { isOneEditAway } from "@in/vader";
import { Text } from "@in/widget/typography/index.ts";

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

/*##############################(TREE COMPONENT)##############################*/
export function Tree() {
  try {
    /*##############################(STATE)##############################*/

    const useTree = createState({
      items: initialItems,
      showHelp: false,
      isExpanded: true,
      searchValue: "",
    });

    const setSearchValue = createAction(
      useTree.searchValue,
      (_current, searchValue: string) => searchValue
    );

    const clearSearchAction = createAction(useTree.searchValue, () => "");

    /*##############################(CREATE TREE)##############################*/
    const tree = createTree<TreeAnchorProps>({
      initialState: {
        expandedItems: ["engineering", "frontend", "design-system"],
        // selectedItems: ["engineering"], // default selected item
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

    // Helper to get all descendant IDs using tree API (reactive)
    const getAllDescendantIds = (
      item: ItemInstance<TreeAnchorProps>
    ): string[] => {
      const children = item.getChildren();
      if (!children || children.length === 0) return [];
      const ids: string[] = [];
      for (const child of children) {
        ids.push(child.getId());
        ids.push(...getAllDescendantIds(child));
      }
      return ids;
    };

    // Create reactive filtered items based on search (searches full data map, not only visible items)
    const filteredItemIds = $(() => {
      const searchValue = useTree.searchValue.get();

      if (!searchValue || searchValue.trim() === "") {
        return [];
      }

      // Work with the full items data map (source of truth)
      const itemsData = useTree.items.get();
      const allIds = Object.keys(itemsData);

      // Build child->parent map for quick ascent
      const parentOf: Record<string, string | undefined> = {};
      for (const [id, data] of Object.entries(itemsData)) {
        const children = data?.children || [];
        for (const childId of children) parentOf[childId] = id;
      }

      // Find direct matches by name (substring or one-edit fuzzy)
      const q = searchValue.toLowerCase();
      const directMatches = allIds.filter((id) => {
        const name = (itemsData[id]?.name || "").toLowerCase();
        return name.includes(q) || isOneEditAway(name, q);
      });

      // Collect all parents of each direct match
      const parentIds = new Set<string>();
      for (const id of directMatches) {
        let p = parentOf[id];
        while (p) {
          parentIds.add(p);
          p = parentOf[p];
        }
      }

      // Collect all descendants of each direct match via itemsData
      const childrenIds = new Set<string>();
      const collectDesc = (id: string) => {
        const children = itemsData[id]?.children || [];
        for (const child of children) {
          childrenIds.add(child);
          collectDesc(child);
        }
      };
      for (const id of directMatches) collectDesc(id);

      // Combine direct matches, parents, and children
      return [
        ...directMatches,
        ...Array.from(parentIds),
        ...Array.from(childrenIds),
      ];
    });

    // Update filtered items when search changes
    const updateFilteredItems = (searchValue: string) => {
      // This will trigger the computed to recalculate
      setSearchValue(searchValue);
      // Keep headless search feature in sync for hotkeys/highlights
      if (typeof tree.setSearch === "function") {
        if (searchValue && searchValue.trim() !== "")
          tree.setSearch(searchValue);
        else tree.setSearch(null);
      }

      // Expand all folders during search
      if (searchValue && searchValue.trim() !== "") {
        const allItems = tree.getItems();
        const folderIds = allItems
          .filter((item) => item.isFolder())
          .map((item) => item.getId());

        tree.setConfig((prev) => ({
          ...prev,
          state: {
            ...prev.state,
            expandedItems: [
              ...new Set([...tree.getState().expandedItems, ...folderIds]),
            ],
          },
        }));
      } else {
        // Reset to initial expanded state when search is cleared
        tree.setConfig((prev) => ({
          ...prev,
          state: {
            ...prev.state,
            expandedItems: ["engineering", "frontend", "design-system"],
          },
        }));
      }
    };

    // Create a computed list of visible items based on search
    const visibleItems = $(() => {
      const allItems = tree.items.get();
      const searchValue = useTree.searchValue.get();

      if (!searchValue || searchValue.trim() === "") {
        return allItems;
      }

      // Use the reactive computed filteredItemIds
      const filtered = filteredItemIds.get();
      const out = allItems.filter((item) => filtered.includes(item.getId()));
      return out;
    });

    /*##############################(RENDER TREE)##############################*/
    return (
      <>
        <YStack gap={2}>
          {/*=============================(CONTROLS)=============================*/}
          <XStack
            gap={2}
            style={{
              web: {
                height: "auto",
                alignItems: "center",
              },
            }}
          >
            <Button
              format="outlineMuted"
              size="sm"
              on:tap={() => {
                useTree.isExpanded.set(!useTree.isExpanded.peek());
                if (useTree.isExpanded.peek()) {
                  tree.expandAll();
                } else {
                  tree.collapseAll();
                }
              }}
              title="Expand all folders (Ctrl+Shift+Plus)"
            >
              <Show when={useTree.isExpanded} otherwise={<ArrowBottomIcon />}>
                <ArrowUpIcon />
              </Show>
            </Button>

            {/*================================(SEARCH FIELD)================================*/}
            <XStack>
              <SearchField
                $ref={(el: HTMLInputElement | null) =>
                  tree.registerSearchInputElement?.(el as any)
                }
                value={$(() => useTree.searchValue.get())}
                placeholder="Search hierarchy..."
                className="peer ps-9"
                type="searchfield"
                on:input={(e: any) => {
                  const value =
                    typeof e === "string"
                      ? e
                      : e?.target?.value || e?.currentTarget?.value || "";
                  updateFilteredItems(value);
                }}
                on:blur={(e: any) => {
                  // Prevent clearing search on blur
                  e?.preventDefault?.();
                }}
                cta={{
                  clear: () => {
                    clearSearchAction();
                  },
                }}
              />
            </XStack>
          </XStack>

          {/*================================(TREE WRAPPER)================================*/}
          <TreeWrapper
            indent={indent}
            tree={tree}
            {...tree.getContainerProps("File tree navigation")}
            className="relative overflow-auto flex-1"
          >
            <TreeDragLine tree={tree} />
            {/* Show "No results" message when search has no matches */}
            <Show
              when={$(
                () =>
                  useTree.searchValue.get().length > 0 &&
                  filteredItemIds.get().length === 0
              )}
            >
              <Text
                style={{
                  web: {
                    width: "auto",
                    overflow: "hidden",
                    textWrap: "wrap",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                  },
                }}
              >
                No items found for "{$(() => useTree.searchValue.get())}"
              </Text>
            </Show>

            <TreeAssistiveDescription tree={tree} />
            <List each={visibleItems}>
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
                      <XStack>
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
                            $ref={item.getCheckboxProps().ref}
                          />
                        </Show>

                        <TreeItemLabel item={item}>
                          <XStack gap={4}>
                            {/*********************(Icons)*********************/}
                            <Show when={item.isFolder()}>
                              <Slot
                                style={$(() => {
                                  // Force reactive re-run on tree rebuilds
                                  const _ = tree.items.get();
                                  const expanded = item.isExpanded();
                                  return {
                                    transform: expanded
                                      ? "rotate(0deg)"
                                      : "rotate(-90deg)",
                                    transition: "transform 0.2s ease",
                                  };
                                })}
                              >
                                <CaretDownPrimeIcon
                                  style={item.isExpanded() ? "true" : "false"}
                                  size="6xs"
                                  scale="12xs"
                                />
                              </Slot>
                            </Show>

                            {/* Folder/File Icons */}
                            {/* <Choose
                              cases={[
                                {
                                  when: () =>
                                    item.isFolder() && item.isExpanded(),
                                  children: <FolderNotchOpenIcon size="4xs" />,
                                },
                                {
                                  when: () =>
                                    item.isFolder() && !item.isExpanded(),
                                  children: <FolderNotchIcon size="4xs" />,
                                },
                              ]}
                              otherwise={<FileIcon size="4xs" />}
                            /> */}

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
                              <Slot
                                className={$(() => {
                                  const searchValue = useTree.searchValue.get();
                                  const itemName = item
                                    .getItemName()
                                    .toLowerCase();
                                  const isMatch =
                                    searchValue &&
                                    searchValue.trim() !== "" &&
                                    itemName.includes(
                                      searchValue.toLowerCase()
                                    );

                                  return isMatch ? "bg-yellow-200" : "";
                                })}
                              >
                                {item.getItemName()}
                              </Slot>
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
