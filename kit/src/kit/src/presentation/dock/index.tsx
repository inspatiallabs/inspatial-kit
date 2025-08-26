import { Slot } from "../../structure/slot/index.tsx";
import { $, createState } from "@in/teract/state";
import { Show } from "../../control-flow/show/index.ts";
import { iss } from "@in/style/index.ts";
import { XPrimeIcon } from "../../icon/x-prime-icon.tsx";
import { BubbleGridIcon } from "../../icon/bubble-grid-icon.tsx";
import { PresentationRegistry } from "../registry.ts";
import { DockStyle } from "./style.ts";
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
    <Slot className={iss(DockStyle.item.getStyle({}), className)} {...rest}>
      {children}
    </Slot>
  );
}

/*#################################(DOCK ICON)#################################*/
function DockIcon({ children, className, ...rest }: DockIconProps) {
  return (
    <Slot className={iss(DockStyle.icon.getStyle({}), className)} {...rest}>
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
      className={iss(DockStyle.label.getStyle({ showOnHover }), className)}
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
    overlayFormat = "none",
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
    const togglePlacement = toggle?.placement ?? "end"; // start | end
    const toggleLayout = toggle?.layout ?? "inline"; // inline | split
    const toggleIcons = toggle?.icon ?? {};
    const toggleLabelMode = toggle?.label ?? "auto"; // auto | always | never
    const toggleOn = toggle?.on ?? {};

    function renderToggle(kind: "minimize" | "close", key: string) {
      const extraTriggers = toggleOn[kind] || {};
      const onTap = kind === "close" ? handleClose : handleToggle;
      const iconNode =
        kind === "minimize"
          ? toggleIcons.minimize ?? <BubbleGridIcon format="fill" />
          : toggleIcons.close ?? <XPrimeIcon format="fill" />;
      const showLabel = toggleLabelMode !== "never";
      const label = kind === "minimize" ? "Minimize" : "Close";
      return (
        <DockItem key={key} on:tap={onTap} {...extraTriggers}>
          <DockIcon>{iconNode}</DockIcon>
          {showLabel && <DockLabel>{label}</DockLabel>}
        </DockItem>
      );
    }

    // Decide placement for inline vs split
    const startModes =
      toggleLayout === "split"
        ? toggleModes.slice(0, 1)
        : togglePlacement === "start"
        ? toggleModes
        : [];
    const endModes =
      toggleLayout === "split"
        ? toggleModes.slice(1)
        : togglePlacement === "end"
        ? toggleModes
        : [];
    const startToggleItems = startModes.map((k, i) =>
      renderToggle(k, `__t-s-${i}`)
    );
    const endToggleItems = endModes.map((k, i) =>
      renderToggle(k, `__t-e-${i}`)
    );

    // No separate minimized view needed - handled inline in render

    // Determine if vertical layout
    const isVertical = direction === "left" || direction === "right";
    const layoutAxis = isVertical ? "y" : axis;

    /*********************************(Render)*********************************/
    return (
      <>
        {closeOnScrim && overlayFormat !== "none" && (
          <Slot
            // overlay
            data-in-presentation-overlay
            data-state={isOpen ? "open" : "closed"}
            className={DockStyle.overlay.getStyle({ overlayFormat })}
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
                    <BubbleGridIcon format="fill" />
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
