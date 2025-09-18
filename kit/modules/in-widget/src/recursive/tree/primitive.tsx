import { Slot } from "@in/widget/structure/index.ts";
import { Button } from "@in/widget/ornament/index.ts";
import { iss, type ISSProps } from "@in/style";
import type { TreeItemLabelProps, TreeItemProps, TreeProps } from "./type.ts";

/*##############################(TREE ITEM)##############################*/

export function TreeItem<T>({
  item,
  asChild,
  className,
  children,
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

  const Comp = asChild ? Slot : Button;
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
      handler(e);
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
    <Slot
      data-slot="tree-item"
      style={{
        web: mergedStyle,
      }}
      className={iss(
        "z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...rest}
    >
      <Comp
        {...rest}
        {...(itemPropsSafe as any)}
        format="ghost"
        data-slot="tree-item"
        style={{
          web: mergedStyle,
        }}
        className={iss(
          "z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
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
          typeof item.isMatchingSearch === "function"
            ? item.isMatchingSearch() || false
            : undefined
        }
        aria-expanded={item.isExpanded()}
      >
        {children}
      </Comp>
    </Slot>
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
      className={iss(
        "in-focus-visible:ring-ring/50 bg-(--background) hover:bg-(--brand) in-data-[selected=true]:bg-(--brand) in-data-[selected=true]:text-(--brand) in-data-[drag-target=true]:bg-(--brand) flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-red-400/30! [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
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
      className={iss(
        "bg-(--primary) before:bg-(--background) before:border-(--primary) absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:rounded-full before:border-2",
        className
      )}
      {...rest}
    />
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
      className={iss("flex flex-col", className)}
      style={propStyle}
      {...rest}
    >
      {props.children}
    </Slot>
  );
}
