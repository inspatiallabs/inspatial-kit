import { Slot } from "@in/widget/structure/slot/index.tsx";
import { iss } from "@in/style";
import { CaretRightPrimeIcon } from "@in/widget/icon/caret-right-prime-icon.tsx";
import { useSidebar } from "./state.ts";
import { SidebarStyle } from "./style.ts";
import { $ } from "@in/teract/signal/index.ts";
import { Show } from "@in/widget/control-flow/show/index.ts";
import { getActiveRoute } from "./helpers.ts";
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
    ? $(() => getActiveRoute(to, activeMatch, isActive))
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

  // Final active state (navigation drives active here; radio uses peer-checked CSS)
  const isItemActive = $(() => (isNavigation ? routeActive.get() : false));

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
