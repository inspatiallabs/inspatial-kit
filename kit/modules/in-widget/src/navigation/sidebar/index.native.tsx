import { Slot } from "@in/widget/structure/slot/index.tsx";
import { iss } from "@in/style";
import { CaretRightPrimeIcon } from "@in/widget/icon/caret-right-prime-icon.tsx";
import { useSidebar } from "./state.ts";
import { SidebarStyle } from "./style.ts";
import { $ } from "@in/teract/signal/index.ts";
import { Show } from "@in/widget/control-flow/show/index.ts";
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
  const { icon, children, className, format, onClick } = props;

  const isExpanded = $(() => !useSidebar.isMinimized.get());

  return (
    <XStack
      className={SidebarStyle.item.getStyle({ className })}
      on:tap={onClick}
    >
      {icon && <Slot className="flex-shrink-0">{icon}</Slot>}
      <Show when={isExpanded}>
        <Slot>{children}</Slot>
      </Show>
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
            size: useSidebar.isMinimized.get() ? "md" : "xl",
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
