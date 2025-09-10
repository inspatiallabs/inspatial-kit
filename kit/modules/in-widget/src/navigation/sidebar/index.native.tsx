import { Slot } from "@in/widget/structure/slot/index.tsx";
import { iss } from "@in/style";
import { CaretRightPrimeIcon } from "@in/widget/icon/caret-right-prime-icon.tsx";
import { useSidebar } from "./state.ts";
import { SidebarStyle } from "./style.ts";
import { $ } from "@in/teract/signal/index.ts";
import { Show } from "@in/widget/control-flow/show/index.ts";
import { useActiveRoute } from "./helpers.ts";
import { Link } from "@in/widget/navigation/link/index.ts";
import type {
  SidebarProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarToggleProps,
  SidebarSectionProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarPluckProps,
} from "./type.ts";
import { XStack } from "@in/widget/structure/index.ts";

/*################################(Active Indicator)################################*/

function SidebarPluck(props: SidebarPluckProps) {
  const { className, ...rest } = props;
  return (
    <Slot
      className={iss(SidebarStyle.pluck.getStyle({ className }))}
      {...rest}
    />
  );
}

/*################################(Toggle Button)################################*/

export function SidebarToggle(props: SidebarToggleProps) {
  const { minimized, onToggle, icon, className: _className, ...rest } = props;

  return (
    <Slot
      className={SidebarStyle.toggle.getStyle({
        format: useSidebar.isMinimized.get() ? "minimized" : "expanded",
      })}
      on:tap={() => {
        useSidebar.action.setMinimized(!useSidebar.isMinimized.get());
        onToggle?.();
      }}
      {...rest}
    >
      <Slot className={SidebarStyle.toggle.getStyle({ format: "inner" })}>
        <Slot
          style={$(() => ({
            transform: useSidebar.isMinimized.get()
              ? "rotate(0deg)"
              : "rotate(180deg)",
            transition: "transform 0.3s ease",
          }))}
        >
          {icon?.collapse || (
            <CaretRightPrimeIcon className="stroke-(--primary)" />
          )}
        </Slot>
      </Slot>
    </Slot>
  );
}

/*################################(Header)################################*/

export function SidebarHeader(props: SidebarHeaderProps) {
  const { children, className, ...rest } = props;
  return (
    <Slot
      className={iss(SidebarStyle.header.getStyle({ className }))}
      {...rest}
    >
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

/*################################(Section)################################*/

export function SidebarSection(props: SidebarSectionProps) {
  const { title, children, className, ...rest } = props;

  return (
    <Slot
      className={iss(
        SidebarStyle.section.getStyle({
          className,
        })
      )}
      {...rest}
    >
      <Show when={title && !useSidebar.isMinimized.get()}>{title}</Show>
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

  // Determine item type and behavior
  const isNavigation = !!to;
  const isSelection = selected !== undefined || name !== undefined;
  const isManual = !!onClick && !isNavigation && !isSelection;

  // Route-based active state for navigation items (reactive)
  const routeActive = isNavigation
    ? $(() => useActiveRoute(to, activeMatch, isActive))
    : $(() => false);

  // Selection state for radio items
  const selectionActive = isSelection
    ? selected ?? defaultSelected ?? false
    : false;

  // Final active state
  const isItemActive = $(() => routeActive.get() || selectionActive);

  const isExpanded = $(() => !useSidebar.isMinimized.get());

  // Sidebar item content
  const itemContent = (
    <>
      {icon && <Slot className="flex-shrink-0">{icon}</Slot>}
      <Show when={isExpanded}>
        <Slot>{children}</Slot>
      </Show>
    </>
  );

  const itemClassName = $(() =>
    iss(
      SidebarStyle.item.getStyle({
        className,
        active: isItemActive.get(),
      }),
      isItemActive.get() ? "sidebar-item-active" : "sidebar-item-inactive"
    )
  );

  // Render function that updates reactively
  const renderItem = $(() => {
    const currentClassName = itemClassName.get();

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
          className={currentClassName}
          {...rest}
        >
          {itemContent}
        </Link>
      );
    }

    // For non-navigation items, use XStack with manual handlers
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

    return (
      <XStack className={currentClassName} on:tap={handleClick} {...rest}>
        {itemContent}
      </XStack>
    );
  });

  return renderItem;
}

/*################################(Collapsible Group)################################*/

// We will use this for the complex tree structure
export function SidebarGroup(props: SidebarGroupProps) {
  const { children, className, ...rest } = props;
  return (
    <Slot className={SidebarStyle.group.getStyle({ className })} {...rest}>
      {children}
    </Slot>
  );
}

/*################################(Main Sidebar Component)################################*/

export function Sidebar(props: SidebarProps) {
  const {
    className,
    minimized: controlledMinimized,
    defaultMinimized: _defaultMinimized = false,
    onMinimizeChange,
    children,
    showToggle = true,
    size,
    minimizedSize = "sm",
    expandedSize = "xl",
    scale,
    variant,
    ...rest
  } = props;

  // Get current state from global sidebar state
  const currentMinimized = useSidebar.isMinimized;

  // Initialize state if needed
  if (
    controlledMinimized !== undefined &&
    controlledMinimized !== currentMinimized.get()
  ) {
    useSidebar.action.setMinimized(controlledMinimized);
  }

  const minimized = controlledMinimized ?? currentMinimized.get();

  // Create reactive className using computed signal

  return (
    <Slot
      className={$(() =>
        iss(
          SidebarStyle.wrapper.getStyle({
            className,
            size:
              size ||
              (useSidebar.isMinimized.get() ? minimizedSize : expandedSize),
            scale,
          }),
          useSidebar.isMinimized.get()
            ? "sidebar-minimized"
            : "sidebar-expanded"
        )
      )}
      {...rest}
    >
      {children}

      {/* Toggle Button */}
      <Show when={showToggle}>
        <SidebarToggle />
      </Show>
    </Slot>
  );
}
