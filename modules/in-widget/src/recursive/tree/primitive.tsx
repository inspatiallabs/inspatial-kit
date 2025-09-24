import { Slot, XStack } from "@in/widget/structure/index.ts";
import { iss, type ISSProps } from "@in/style";
import type { TreeItemLabelProps, TreeItemProps, TreeProps } from "./type.ts";
import { TreeStyle } from "./style.ts";
import {
  type DndState,
  type HotkeysConfig,
  type TreeInstance,
  AssistiveDndState,
} from "./src/index.ts";
import { $ } from "@in/teract/state";
import type { JSX } from "@in/runtime/types";

/*##############################(TREE ITEM)##############################*/

export function TreeItem<T>({
  item,
  asChild,
  className,
  children,
  disabled,
  indent = 10,
  ...props
}: Omit<TreeItemProps, "indent">) {
  const { style: propStyle, ...rest } = props;

  const level = item.getItemMeta().level ?? 0;

  const paddingLeftPx = level * Number(indent);

  const mergedStyle = {
    ...propStyle,
    paddingLeft: `${paddingLeftPx}px`,
  } as ISSProps;

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {};

  // Extract event handlers that need special handling
  const {
    onClick: itemOnClick,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    ...itemPropsSafe
  } = (itemProps as Record<string, unknown>) ?? {};

  const handleItemTap = (e?: any) => {
    if (typeof itemOnClick !== "function") return;

    // Create a normalized event object with safe defaults
    const normalized = {
      ctrlKey: e?.ctrlKey ?? false,
      shiftKey: e?.shiftKey ?? false,
      metaKey: e?.metaKey ?? false,
      altKey: e?.altKey ?? false,
      preventDefault: e?.preventDefault ? () => e.preventDefault() : () => {},
      stopPropagation: e?.stopPropagation
        ? () => e.stopPropagation()
        : () => {},
      ...(e || {}),
    };

    itemOnClick(normalized);
  };

  // Create safe wrapper for drag events
  const createDragHandler = (handler: any) => {
    if (typeof handler !== "function") return undefined;
    return (e?: any) => {
      if (!e) return;
      handler(e)
    };
  };

  // Build drag event props only if handlers exist
  const dragProps = {
    ...(onDragStart
      ? { ["on:dragstart"]: createDragHandler(onDragStart) }
      : {}),
    ...(onDragEnd ? { ["on:dragend"]: createDragHandler(onDragEnd) } : {}),
    ...(onDragEnter
      ? { ["on:dragenter"]: createDragHandler(onDragEnter) }
      : {}),
    ...(onDragLeave
      ? { ["on:dragleave"]: createDragHandler(onDragLeave) }
      : {}),
    ...(onDragOver ? { ["on:dragover"]: createDragHandler(onDragOver) } : {}),
    ...(onDrop ? { ["on:drop"]: createDragHandler(onDrop) } : {}),
  };

  return (
    <XStack
      data-slot="tree-item"
      style={{
        web: mergedStyle,
      }}
      className={iss(TreeStyle.item.getStyle({ className, disabled, ...rest }))}
      {...rest}
    >
      <Slot
        {...rest}
        {...(itemPropsSafe as any)}
        format="ghost"
        data-slot="tree-item"
        style={{
          web: mergedStyle,
        }}
        className={$(() => {
          const _ = (item.getTree() as any)?.items?.get?.();
          const classes = [TreeStyle.item.getStyle({ className, disabled, ...rest })];
          if (typeof item.isSelected === "function" && item.isSelected()) classes.push("tree-item-selected");
          if (typeof item.isDragTarget === "function" && item.isDragTarget()) classes.push("tree-item-drag-target");
          if (typeof item.isDraggingOver === "function" && item.isDraggingOver()) classes.push("tree-item-drag-over");
          if (typeof (item as any).isMatchingSearch === "function" && (item as any).isMatchingSearch()) classes.push("tree-item-search-match");
          return iss(classes);
        })}
        {...({ ["on:tap"]: handleItemTap, ["on:click"]: handleItemTap } as any)}
        {...(dragProps as any)}
        data-focus={
          typeof item.isFocused === "function"
            ? item.isFocused() || false
            : undefined
        }
        data-folder={
          typeof item.isFolder === "function"
            ? item.isFolder() || false
            : undefined
        }
        data-selected={
          typeof item.isSelected === "function"
            ? item.isSelected() || false
            : undefined
        }
        data-drag-target={
          typeof item.isDragTarget === "function"
            ? item.isDragTarget() || false
            : undefined
        }
        data-search-match={
          typeof (item as any).isMatchingSearch === "function"
            ? (item as any).isMatchingSearch() || false
            : undefined
        }
        aria-expanded={item.isExpanded()}
      >
        {children}
      </Slot>
    </XStack>
  );
}

/*##############################(TREE ITEM LABEL)##############################*/

// Store click time outside component to persist between renders
const clickTimeMap = new Map<string, number>();

export function TreeItemLabel<T = any>({
  item: propItem,
  children,
  className,
  ...props
}: TreeItemLabelProps<T>) {
  const item = propItem;

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context");
    return null;
  }

  // Track double-click for rename
  const itemId = item.getId?.() || "unknown";
  const handleLabelClick = (e?: any) => {
    const now = Date.now();
    const lastClickTime = clickTimeMap.get(itemId) || 0;

    if (now - lastClickTime < 500 && typeof item.startRenaming === "function") {
      // Double-click detected - start renaming
      e?.stopPropagation?.();
      e?.preventDefault?.();
      item.startRenaming();
      clickTimeMap.delete(itemId); // Reset after successful double-click
    } else {
      clickTimeMap.set(itemId, now);
    }
  };


  return (
    <Slot
      data-slot="tree-item-label"
      className={TreeStyle.label.getStyle({ className, ...props })}
      on:tap={handleLabelClick}
      {...props}
    >
      {children ||
        (typeof item.getItemName === "function" ? item.getItemName() : null)}
    </Slot>
  );
}

/*##############################(TREE DRAG LINE)##############################*/
export function TreeDragLine({ className, ...rest }: JSX.SharedProps) {
  const tree = (rest as any)?.tree;

  if (!tree || typeof tree.getDragLineStyle !== "function") {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method"
    );
    return null;
  }

  const dragLine = tree.getDragLineStyle();
  return (
    <Slot
      style={dragLine}
      className={iss(TreeStyle.dragLine.getStyle({ className, ...rest }))}
      {...rest}
    />
  );
}

/*##############################(TREE ASSISTIVE DESCRIPTION)##############################*/
/*========================(Get Default Label)========================*/
const getDefaultLabel = <T,>(
  dnd: DndState<T> | null | undefined,
  assistiveState: AssistiveDndState,
  hotkeys: HotkeysConfig<T>
) => {
  if (!hotkeys.startDrag) return "";
  const itemNames =
    dnd?.draggedItems?.map((item) => item.getItemName()).join(", ") ?? "";
  const position = !dnd?.dragTarget
    ? "None"
    : "childIndex" in dnd.dragTarget
    ? `${dnd.dragTarget.childIndex} of ${
        dnd.dragTarget.item.getChildren().length
      } in ${dnd.dragTarget.item.getItemName()}`
    : `in ${dnd.dragTarget.item.getItemName()}`;
  const navGuide =
    `Press ${hotkeys.dragUp?.hotkey} and ${hotkeys.dragDown?.hotkey} to move up or down, ` +
    `${hotkeys.completeDrag?.hotkey} to drop, ${hotkeys.cancelDrag?.hotkey} to abort.`;
  switch (assistiveState) {
    case AssistiveDndState.Started:
      return itemNames
        ? `Dragging ${itemNames}. Current position: ${position}. ${navGuide}`
        : `Current position: ${position}. ${navGuide}`;
    case AssistiveDndState.Dragging:
      return itemNames ? `${itemNames}, ${position}` : position;
    case AssistiveDndState.Completed:
      return `Drag completed. Press ${hotkeys.startDrag?.hotkey} to move selected items`;
    case AssistiveDndState.Aborted:
      return `Drag cancelled. Press ${hotkeys.startDrag?.hotkey} to move selected items`;
    case AssistiveDndState.None:
    default:
      return `Press ${hotkeys.startDrag?.hotkey} to move selected items`;
  }
};

/*========================(Tree Assistive Description)========================*/
export function TreeAssistiveDescription<T>({
  tree,
  getLabel = getDefaultLabel,
  className,
  ...props
}: {
  tree: TreeInstance<T>;
  getLabel?: typeof getDefaultLabel;
} & JSX.SharedProps) {
  const state = tree.getState();
  return (
    <Slot
      aria-live="assertive"
      className={iss(
        TreeStyle.assistiveDescription.getStyle({ className, ...props })
      )}
      {...props}
    >
      {getLabel(
        state.dnd,
        state.assistiveDndState ?? AssistiveDndState.None,
        tree.getHotkeyPresets()
      )}
    </Slot>
  );
}

/*##############################(TREE WRAPPER)##############################*/

export function TreeWrapper({
  indent = 20,
  tree,
  className,
  ...props
}: TreeProps) {
  const containerProps =
    tree && typeof tree.getContainerProps === "function"
      ? tree.getContainerProps()
      : {};
  const mergedProps = { ...props, ...containerProps } as Record<string, any>;

  const { style: propStyle, ...rest } = mergedProps as any;

  return (
    <Slot
      data-slot="tree"
      className={iss(TreeStyle.wrapper.getStyle({ className, ...rest }))}
      style={propStyle}
      {...rest}
    >
      {props.children}
    </Slot>
  );
}
