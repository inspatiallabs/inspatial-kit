import { Slot } from "@in/widget/structure/slot/component.tsx";
import { $, createState } from "@in/teract/state";
import { Show } from "../../control-flow/show/index.ts";
import { iss } from "@in/style";
import { PresentationRegistry } from "../registry.ts";
import { DockStyle } from "./style.ts";
import {
  renderPresentationToggles,
  getPresentationToggleIcon,
} from "../toggle/index.tsx";
import type {
  DockProps,
  DockItemConfig,
  DockItemsProps,
  DockItemProps,
  DockIconProps,
  DockLabelProps,
} from "./type.ts";

/*#################################(DOCK ITEMS)#################################*/

function DockItems({
  children,
  className,
  axis = "x",
  ...rest
}: DockItemsProps) {
  return (
    <>
      <Slot
        className={iss(DockStyle.items.getStyle({ axis, className }))}
        {...rest}
      >
        {children}
      </Slot>
    </>
  );
}

/*#################################(DOCK ITEM)#################################*/
function DockItem({ children, className, ...rest }: DockItemProps) {
  return (
    <Slot className={iss(DockStyle.item.getStyle({ className }))} {...rest}>
      {children}
    </Slot>
  );
}

/*#################################(DOCK ICON)#################################*/
function DockIcon({ children, className, ...rest }: DockIconProps) {
  return (
    <Slot className={iss(DockStyle.icon.getStyle({ className }))} {...rest}>
      {children}
    </Slot>
  );
}

/*#################################(DOCK LABEL)#################################*/
function DockLabel({
  children,
  className,
  showOnHover = true,
  ...rest
}: DockLabelProps) {
  return (
    <Slot
      className={iss(DockStyle.label.getStyle({ showOnHover, className }))}
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
    closeOnEsc = false,
    closeOnScrim = false,
    backdrop = "none",
    open,
    defaultOpen = false,
    className,
    children,
    ...rest
  } = props as any;

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

  // Internal minimized state (explicit @state/ pattern)
  const minimizedState = createState.in({
    id: `in-dock-${id}-minimized`,
    initialState: {
      isMinimized: minimized,
    },
    action: {
      toggle: { key: "isMinimized", fn: (v: boolean) => !v },
      minimize: { key: "isMinimized", fn: () => true },
      expand: { key: "isMinimized", fn: () => false },
    },
  });

  const handleToggle = () => {
    minimizedState.action.toggle();
  };
  const handleClose = () => PresentationRegistry.setOpen(id, false);

  // Create computed presentation - reactive to open and minimized state
  const DockPresentation = $(() => {
    const isOpen = sig.get();
    if (!isOpen) return null;

    // Reactive access
    const isMinimized = minimizedState.isMinimized.get();
    const items = (children as any)?.items || [];

    // Normalize toggle config (API B)
    const toggleModes = (() => {
      const modes = toggle?.modes ?? ["minimize"]; // default
      if (modes === "none") return [] as ("minimize" | "close")[];
      return modes as ("minimize" | "close")[];
    })();

    // Render presentation toggles
    const { startItems: startToggleItems, endItems: endToggleItems } =
      renderPresentationToggles({
        id,
        config: toggle,
        axis: axis,
        capabilities: { supportsMinimize: true },
        handlers: { onMinimize: handleToggle, onClose: handleClose },
      });

    // Determine if vertical layout
    const isVertical = direction === "left" || direction === "right";
    const layoutAxis = isVertical ? "y" : axis;

    /*********************************(Render)*********************************/
    return (
      <>
        {closeOnScrim && backdrop !== "none" && (
          <Slot
            // overlay
            data-in-presentation-overlay
            data-state={isOpen ? "open" : "closed"}
            className={DockStyle.overlay.getStyle({ backdrop })}
            on:tap={() => PresentationRegistry.setOpen(id, false)}
          />
        )}
        <Slot
          // wrapper container (fixed positioning)
          className={DockStyle.wrapper.getStyle()}
          on:escape={() =>
            closeOnEsc && PresentationRegistry.setOpen(id, false)
          }
        >
          <Slot
            // Dock View
            role="toolbar"
            aria-label="Dock"
            data-in-presentation
            data-in-presentation-dock
            data-in-presentation-snap-points="false"
            data-state={isOpen ? "open" : "closed"}
            className={iss(
              DockStyle.view.getStyle({
                axis: layoutAxis,
                padded: !isMinimized,
                direction,
              }),
              className
            )}
            {...rest}
          >
            <Show
              when={() =>
                minimizedState.isMinimized.get() &&
                toggleModes.includes("minimize")
              }
              // deno-lint-ignore jsx-no-children-prop
              children={() => (
                // Show only minimized bubble when minimized
                <DockItem on:tap={handleToggle}>
                  <DockIcon>
                    {getPresentationToggleIcon("maximize", toggle?.icon)}
                  </DockIcon>
                  <DockLabel>Expand</DockLabel>
                </DockItem>
              )}
              otherwise={() => (
                // Show full dock items when not minimized
                <DockItems axis={layoutAxis}>
                  {startToggleItems}
                  {items.map((item: DockItemConfig, idx: number) => {
                    // Extract all trigger props from item.on
                    const triggerProps: any = {};
                    if (item.on) {
                      Object.entries(item.on as any).forEach(([key, value]) => {
                        if (key.startsWith("on:")) {
                          triggerProps[key] = value;
                        }
                      });
                    }

                    return (
                      <DockItem
                        key={item.key || idx}
                        {...triggerProps}
                        className={item.className as any}
                      >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label as any}</DockLabel>
                      </DockItem>
                    );
                  })}
                  {endToggleItems}
                </DockItems>
              )}
            />
          </Slot>
        </Slot>
      </>
    );
  });

  return DockPresentation;
}
