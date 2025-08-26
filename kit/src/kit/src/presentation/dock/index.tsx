import { Slot } from "../../structure/slot/index.tsx";
import { $, createState } from "@in/teract/state";
import { iss } from "@in/style/index.ts";
import { XPrimeIcon } from "../../icon/x-prime-icon.tsx";
import { BubbleGridIcon } from "../../icon/bubble-grid-icon.tsx";
import { PresentationRegistry } from "../registry.ts";
import {
  DockStyle,
  DockItemsStyle,
  DockItemStyle,
  DockIconStyle,
  DockLabelStyle,
  DockMinimizedShellStyle,
} from "./style.ts";
import type {
  DockProps,
  DockItemConfig,
  DockItemsProps,
  DockItemProps,
  DockIconProps,
  DockLabelProps,
} from "./type.ts";

/*#################################(INTERNAL COMPONENTS)#################################*/

function DockItems({
  children,
  className,
  axis = "x",
  ...rest
}: DockItemsProps) {
  return (
    <>
      <Slot
        className={iss(DockItemsStyle.getStyle({ axis }), className)}
        {...rest}
      >
        {children}
      </Slot>
    </>
  );
}

function DockItem({ children, className, ...rest }: DockItemProps) {
  return (
    <Slot className={iss(DockItemStyle.getStyle({}), className)} {...rest}>
      {children}
    </Slot>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  return (
    <Slot className={iss(DockIconStyle.getStyle({}), className)} {...rest}>
      {children}
    </Slot>
  );
}

function DockLabel({
  children,
  className,
  showOnHover = true,
  ...rest
}: DockLabelProps) {
  return (
    <Slot
      className={iss(DockLabelStyle.getStyle({ showOnHover }), className)}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*#################################(DOCK)#################################*/

export function Dock(props: DockProps) {
  const {
    id,
    axis = "x",
    direction = "bottom",
    minimized = false,
    toggle,
    open,
    defaultOpen = false,
    className,
    children,
    ...rest
  } = props;

  // Get presentation signal
  const sig = PresentationRegistry.getSignal(id);

  // Set initial state
  if (open !== undefined) {
    if (typeof open === "boolean") {
      sig.value = open;
    } else if (open && typeof (open as any).get === "function") {
      sig.value = !!(open as any).get();
    }
  } else if (defaultOpen === true) {
    sig.value = true;
  }

  // Internal minimized state
  const minimizedState = createState.in({
    id: `dock-${id}-minimized`,
    initialState: {
      isMinimized: minimized,
    },
    action: {
      toggle: { key: "isMinimized", fn: (v: boolean) => !v },
      minimize: { key: "isMinimized", fn: () => true },
      expand: { key: "isMinimized", fn: () => false },
    },
  });

  const handleToggle = () => minimizedState.action.toggle();
  const handleClose = () => PresentationRegistry.setOpen(id, false);

  // Create computed presentation
  const DockPresentation = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    const isMinimized = minimizedState.isMinimized.get();
    const items = children?.items || [];
    const toggleType = toggle?.type || "Minimize";
    const toggleDisplay = toggle?.display === false; // default false

    // Build toggle item
    const toggleItem = toggleDisplay
      ? children?.customToggle || (
          <DockItem
            on:tap={toggleType === "Close" ? handleClose : handleToggle}
            className={axis === "x" ? "ml-2" : "mt-2"}
          >
            <DockIcon>
              <XPrimeIcon className="transition-transform duration-300 fill-red-500" />
            </DockIcon>
            <DockLabel>{isMinimized ? "Open" : toggleType}</DockLabel>
          </DockItem>
        )
      : null;

    // Build minimized view
    const minimizedView =
      isMinimized && toggleType === "Minimize" ? (
        <Slot
          className={DockMinimizedShellStyle.getStyle({})}
          on:tap={handleToggle}
        >
          <BubbleGridIcon className="flex h-auto w-auto items-center justify-center m-1.5 fill-white" />
        </Slot>
      ) : null;

    // Position classes (absolute) separate from animation classes handled by style settings
    const positionClasses = {
      top: "fixed top-4 left-1/2 -translate-x-1/2",
      bottom: "fixed bottom-4 left-1/2 -translate-x-1/2",
      left: "fixed left-4 top-1/2 -translate-y-1/2",
      right: "fixed right-4 top-1/2 -translate-y-1/2",
    } as const;

    // Determine if vertical layout
    const isVertical = direction === "left" || direction === "right";
    const layoutAxis = isVertical ? "y" : axis;

    return (
      <Slot
        className={iss(
          positionClasses[direction as keyof typeof positionClasses],
          DockStyle.getStyle({
            axis: layoutAxis,
            direction,
            padded: !isMinimized,
          }),
          className
        )}
        data-in-presentation
        data-in-presentation-dock
        data-state={isOpen ? "open" : "closed"}
        {...rest}
      >
        {!isMinimized && items.length > 0 && (
          <DockItems axis={layoutAxis}>
            {items.map((item: DockItemConfig, idx: number) => {
              // Extract all trigger props from item.on
              const triggerProps: any = {};
              if (item.on) {
                Object.entries(item.on).forEach(([key, value]) => {
                  if (key.startsWith("on:")) {
                    triggerProps[key] = value;
                  }
                });
              }

              return (
                <DockItem
                  key={item.key || idx}
                  {...triggerProps}
                  className={item.className}
                >
                  <DockIcon>{item.icon}</DockIcon>
                  <DockLabel>{item.label}</DockLabel>
                </DockItem>
              );
            })}
          </DockItems>
        )}
        {minimizedView}
        {toggleItem}
      </Slot>
    );
  });

  return DockPresentation;
}
