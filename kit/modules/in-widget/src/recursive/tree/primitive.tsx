import { Slot } from "@in/widget/structure/index.ts";
import { Button } from "@in/widget/ornament/index.ts";
import { iss, type ISSProps } from "@in/style";
import { CaretDownPrimeIcon } from "@in/widget/icon/caret-down-prime-icon.tsx";
import type { TreeItemLabelProps, TreeItemProps, TreeProps } from "./type.ts";

/*##############################(TREE ITEM)##############################*/

export function TreeItem<T>({
  item,
  asChild,
  className,
  children,
  indent = 10,
  ...props
}: Omit<TreeItemProps<T>, "indent">) {
  const { style: propStyle, ...rest } = props;

  const level = item.getItemMeta().level ?? 0;

  const paddingLeftPx = level * Number(indent);

  const mergedStyle = {
    ...propStyle,
    paddingLeft: `${paddingLeftPx}px`,
  } as ISSProps;

  const Comp = asChild ? Slot : Button;
  const itemProps = typeof item.getProps === "function" ? item.getProps() : {};
  const { onClick: itemOnClick, ...itemPropsSafe } =
    (itemProps as Record<string, unknown>) ?? {};

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
        {...({ ["on:tap"]: itemOnClick, ["on:click"]: itemOnClick } as any)}
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

  return (
    <Slot
      data-slot="tree-item-label"
      className={iss(
        "in-focus-visible:ring-ring/50 bg-(--background) hover:bg-(--brand) in-data-[selected=true]:bg-(--brand) in-data-[selected=true]:text-(--brand) in-data-[drag-target=true]:bg-(--brand) flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-400/20! [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {item.isFolder() && (
        <CaretDownPrimeIcon
          className="text-(--muted) size-4 in-aria-[expanded=false]:-rotate-90"
          size={"5xs"}
          scale="12xs"
        />
      )}
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
  const mergedProps = { ...props, ...containerProps };

  const { style: propStyle, ...rest } = mergedProps;

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
