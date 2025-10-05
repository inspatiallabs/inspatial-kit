import { Slot } from "@in/widget/structure/slot/component.tsx";
import { iss } from "@in/style";
import { CaretRightPrimeIcon } from "@in/widget/icon/caret-right-prime-icon.tsx";
import { useSidebar } from "./state.ts";
import { SidebarStyle } from "./style.ts";
import { $ } from "@in/teract/signal";
import { Show } from "@in/widget/control-flow/show/index.ts";
import { getActiveRoute } from "./helpers.ts";
import { Link } from "@in/widget/navigation/link/index.ts";
import type {
  SidebarProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarToggleProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarIndicatorProps,
} from "./type.ts";
import { XStack, YStack } from "@in/widget/structure/index.ts";
import { generateUniqueId } from "@in/vader";
import { createState } from "@in/teract/state";
import type { JSX } from "@in/runtime/types";
import { ensureArray } from "@in/vader";

/*################################(STATE)################################*/

const { isMinimized, action } = useSidebar;

/*################################(Active Indicator)################################*/

function SidebarIndicator(props: SidebarIndicatorProps) {
  const { className, class: cls, ...rest } = props;
  return (
    <Slot
      className={iss(SidebarStyle.indicator.getStyle({ className }))}
      {...rest}
    />
  );
}

/*################################(Toggle Button)################################*/

export function SidebarToggle(props: SidebarToggleProps) {
  const {
    minimized,
    onToggle,
    icon,
    className,
    class: cls,
    format,
    position,
    size,
    scale,
    radius,
    disabled,
    ...rest
  } = props;

  return (
    <Slot
      className={SidebarStyle.toggle.getStyle({
        className,
        format: minimized ?? isMinimized.get() ? "minimized" : "expanded",
      })}
      on:tap={() => {
        if (onToggle) {
          onToggle();
        } else {
          action.setMinimized(!isMinimized.get());
        }
      }}
      {...rest}
    >
      <Slot
        style={$(() => ({
          transform:
            minimized ?? isMinimized.get() ? "rotate(0deg)" : "rotate(180deg)",
          transition: "transform 0.3s ease",
        }))}
      >
        {icon?.collapse || (
          <CaretRightPrimeIcon
            className={SidebarStyle.toggle.getStyle({
              className,
              class: cls,
              position,
              size,
              scale,
              radius,
              disabled,
              format,
            })}
          />
        )}
      </Slot>
    </Slot>
  );
}

/*################################(Header)################################*/

export function SidebarHeader(props: SidebarHeaderProps) {
  const { children, className, logo, title, ...rest } = props;
  return (
    <Slot
      className={iss(SidebarStyle.header.getStyle({ className, ...rest }))}
      {...rest}
    >
      {logo && <Slot>{logo}</Slot>}
      {title && <Slot className="sidebar-header-title">{title}</Slot>}
      {children}
    </Slot>
  );
}

/*################################(Footer)################################*/

export function SidebarFooter(props: SidebarFooterProps) {
  const { children, className, ...rest } = props;

  return (
    <Slot
      className={iss(SidebarStyle.footer.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*################################(Menu Item)################################*/

export function SidebarItem(props: SidebarItemProps) {
  const {
    icon,
    children,
    className,
    routeView,
    // Link props
    to,
    params,
    query,
    replace,
    prefetch,
    protect,
    activeMatch = "exact",
    isActive,
    // Radio props
    selected,
    defaultSelected,
    name,
    value,
    // Manual props
    onClick,
    onChange,
    ...rest
  } = props;

  // Determine item type and behavior (explicit routeView with soft fallback)
  const isNavigation = routeView === "MPV" || (routeView == null && !!to);
  const isSelection =
    routeView === "SPV" || (routeView == null && name !== undefined);
  const isManual = !!onClick && !isNavigation && !isSelection;

  // Route-based active state for navigation items (reactive)
  const routeActive = isNavigation
    ? $(() => {
        const current = useSidebar.activeRoute.get();
        if (current) {
          if (activeMatch === "custom" && isActive) return !!isActive(current);
          if (activeMatch === "prefix")
            return typeof to === "string" && current.startsWith(to);
          return typeof to === "string" && current === to;
        }
        return getActiveRoute(to as any, activeMatch as any, isActive as any);
      })
    : $(() => false);

  // Selection state for radio items (reactive)
  const selectionActive = isSelection
    ? $(() => {
        // Handle reactive signals
        if (
          typeof selected === "object" &&
          selected &&
          typeof (selected as any).get === "function"
        ) {
          return (selected as any).get();
        }
        return selected ?? defaultSelected ?? false;
      })
    : $(() => false);

  // Final active state (navigation or selection)
  const isItemActive = $(() =>
    isNavigation
      ? routeActive.get()
      : isSelection
      ? (selectionActive.get() as any)
      : false
  );

  // Sidebar item content
  const itemContent = (
    <>
      <Show when={isItemActive}>
        <SidebarIndicator
          className={SidebarStyle.indicator.getStyle({ className })}
        />
      </Show>
      {icon && (
        <Slot className={SidebarStyle.icon.getStyle({ className })}>
          {icon}
        </Slot>
      )}
      <Slot className="sidebar-item-title">{children}</Slot>
    </>
  );

  const itemClassName = $(() => {
    const activeForNav = isNavigation ? routeActive.get() : false;
    return iss(
      SidebarStyle.item.getStyle({
        className,
        active: activeForNav,
      }),
      activeForNav ? "sidebar-item-active" : "sidebar-item-inactive"
    );
  });

  // Keep a stable ref to the shell element to gate keyboard handling by focus
  let shellRef: JSX.SharedProps["$ref"] | null = null;

  // Click handler for non-navigation items (defined outside reactive context)
  function handleClick() {
    if (isSelection && name && value !== undefined) {
      // Radio selection handler
      const newValue = !selected;
      onChange?.(value);

      // Tab/Radio pattern support
      if (rest["on:input"] && typeof rest["on:input"] === "function") {
        rest["on:input"](value);
      }
      if (rest["on:change"] && typeof rest["on:change"] === "function") {
        rest["on:change"](value);
      }

      // Emit radio selection event
      const event = new CustomEvent("sidebar-radio-change", {
        detail: { name, value, selected: newValue },
      });
      globalThis.dispatchEvent?.(event);
    } else if (onClick) {
      // Manual click handler
      onClick();
    }
  }

  // For navigation items, use Link component internally
  if (isNavigation) {
    return (
      <Link
        to={to}
        params={params}
        query={query}
        replace={replace}
        prefetch={prefetch}
        protect={protect}
        className={itemClassName.get()}
        {...rest}
      >
        {itemContent}
      </Link>
    );
  }

  // For non-navigation items, use a stable shell XStack and swap inner content with Choose
  if (isSelection) {
    return (
      <XStack
        className={itemClassName.get()}
        tabIndex={-1}
        data-radio-name={name}
        data-radio-value={value}
        $ref={(el: any) => (shellRef = el)}
        on:change={() => {
          if (isSelection && name && value !== undefined) {
            onChange?.(value);
            if (rest["on:input"] && typeof rest["on:input"] === "function") {
              (rest["on:input"] as any)(value);
            }
            if (rest["on:change"] && typeof rest["on:change"] === "function") {
              (rest["on:change"] as any)(value);
            }
          }
        }}
        {...rest}
      >
        <label style={{ display: "contents" }}>
          <input
            type="radio"
            name={name}
            value={value as any}
            checked={$(() => selectionActive.get())}
            aria-hidden="true"
            style={{
              web: {
                position: "absolute",
                inset: 0,
                opacity: 0,
              },
            }}
          />
          {itemContent}
        </label>
      </XStack>
    );
  }

  // For manual items (non-radio, non-navigation)
  return (
    <XStack className={itemClassName.get()} on:tap={handleClick} {...rest}>
      {itemContent}
    </XStack>
  );
}

/*################################(Collapsible Group)################################*/

// We will use this for the complex tree structure
export function SidebarGroup(props: SidebarGroupProps) {
  const {
    children,
    className,
    disabled,
    title,
    icon,
    defaultExpanded = false,
    expanded,
    onExpandChange,
    ...rest
  } = props;

  const groupToggleStyle = SidebarStyle.toggle.getStyle({
    format: "base",
    position: "inline",
    size: "2xs",
    radius: "full",
  });

  const useGroup = createState({ isHovered: false, expanded: defaultExpanded });
  const isGroupExpanded = $(() =>
    expanded !== undefined ? expanded : useGroup.expanded.get()
  );

  return (
    <Slot
      className={$(() =>
        iss(
          SidebarStyle.group.container.getStyle({ className, disabled }),
          "sidebar-group", // IMPORTANT: For the group header to be active when any child item is active
          isGroupExpanded.get()
            ? "sidebar-group-expanded"
            : "sidebar-group-collapsed"
        )
      )}
      {...rest}
    >
      {(title || icon) && (
        <XStack
          className={SidebarStyle.group.header.head.getStyle({ className })}
          on:mouseenter={() => useGroup.isHovered.set(true)}
          on:mouseleave={() => useGroup.isHovered.set(false)}
          on:tap={() => {
            if (expanded !== undefined) {
              onExpandChange?.(!expanded);
            } else {
              useGroup.expanded.set(!useGroup.expanded.get());
              onExpandChange?.(useGroup.expanded.get());
            }
          }}
        >
          <SidebarIndicator
            className={iss(
              SidebarStyle.indicator.getStyle({ className }),
              "sidebar-indicator"
            )}
          />
          {icon && (
            <Slot className={SidebarStyle.icon.getStyle({ className })}>
              {icon}
            </Slot>
          )}
          {title && (
            <XStack
              className={SidebarStyle.group.header.title.getStyle({
                className,
              })}
            >
              {title}
              <Show
                when={$(
                  () => useGroup.isHovered.get() || isGroupExpanded.get()
                )}
              >
                <Slot
                  style={$(() => ({
                    transform: isGroupExpanded.get()
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }))}
                >
                  <CaretRightPrimeIcon className={groupToggleStyle} />
                </Slot>
              </Show>
            </XStack>
          )}
        </XStack>
      )}
      <Show when={isGroupExpanded}>
        <YStack className={SidebarStyle.group.children.getStyle({ className })}>
          {children}
        </YStack>
      </Show>
    </Slot>
  );
}

/*################################(Main Sidebar Component)################################*/

export function Sidebar(props: SidebarProps) {
  const {
    id,
    className,
    minimized: controlledMinimized,
    defaultMinimized: _defaultMinimized = false,
    onMinimizeChange,
    children,
    showToggle = false,
    size,
    minimizedSize = "sm",
    expandedSize = "xl",
    scale,
    variant,
    ...rest
  } = props;

  // Instance id for per-sidebar state
  const instanceId = id ?? generateUniqueId();

  // Per-instance minimized signal (controlled > storeById > default)
  const minimizedForInstance = $(() => {
    if (controlledMinimized !== undefined) return controlledMinimized;
    const byId = useSidebar.minimizedById.get()[instanceId];
    return byId ?? _defaultMinimized;
  });

  // Initialize state if needed
  if (controlledMinimized !== undefined) {
    // Keep store in sync for this instance when controlled
    useSidebar.action.setMinimizedForId({
      id: instanceId,
      minimized: controlledMinimized,
    });
  }

  // Create reactive className using computed signal

  // Hover state to reveal toggle only when hovering the sidebar container
  const hover = createState({ over: false });

  // Children tree: map object shape into nodes
  const childrenAsAny = children as any;
  const isChildrenTree =
    childrenAsAny &&
    typeof childrenAsAny === "object" &&
    !Array.isArray(childrenAsAny) &&
    ("header" in childrenAsAny ||
      "group" in childrenAsAny ||
      "item" in childrenAsAny ||
      "footer" in childrenAsAny ||
      // "toggle" in childrenAsAny ||
      // "indicator" in childrenAsAny)
      true) &&
    !("$$typeof" in childrenAsAny) &&
    !("type" in childrenAsAny) &&
    !("props" in childrenAsAny);

  const treeHeaders = isChildrenTree
    ? ensureArray<SidebarHeaderProps>(childrenAsAny.header)
    : [];
  const treeGroups = isChildrenTree
    ? ensureArray<SidebarGroupProps>(childrenAsAny.group)
    : [];
  const treeItems = isChildrenTree
    ? ensureArray<SidebarItemProps>(childrenAsAny.item)
    : [];
  const treeFooters = isChildrenTree
    ? ensureArray<SidebarFooterProps>(childrenAsAny.footer)
    : [];

  const mappedChildren = isChildrenTree ? (
    <>
      {treeHeaders.map((h, i) => (
        <SidebarHeader key={(h as any).key ?? i} {...(h as any)} />
      ))}
      {treeGroups.map((g, i) => (
        <SidebarGroup key={(g as any).id ?? i} {...(g as any)} />
      ))}
      {treeItems.map((it, i) => (
        <SidebarItem key={(it as any).key ?? i} {...(it as any)} />
      ))}
      {treeFooters.map((f, i) => (
        <SidebarFooter key={(f as any).key ?? i} {...(f as any)} />
      ))}
    </>
  ) : (
    (undefined as any)
  );

  return (
    <Slot
      data-inmotion="fade-r duration-500 once"
      id={instanceId}
      className={$(() =>
        iss(
          minimizedForInstance.get() ? "sidebar-minimized" : "sidebar-expanded",
          SidebarStyle.wrapper.getStyle({
            className,
            size:
              size ??
              (minimizedForInstance.get() ? minimizedSize : expandedSize),
            scale,
          })
        )
      )}
      on:mouseenter={() => hover.over.set(true)}
      on:mouseleave={() => hover.over.set(false)}
      {...rest}
    >
      {isChildrenTree ? mappedChildren : children}

      {/* Toggle Button: always visible when minimized; hover-only when expanded */}
      <Show
        when={$(
          () => showToggle && (minimizedForInstance.get() || hover.over.get())
        )}
      >
        <SidebarToggle
          data-inmotion="fade-l duration-500 once"
          minimized={minimizedForInstance.get()}
          onToggle={() => useSidebar.action.toggleMinimizedForId(instanceId)}
        />
      </Show>
    </Slot>
  );
}
