import { Slot } from "@in/widget/structure/slot/index.tsx";
import { PresentationToggleStyle } from "./style.ts";
import { XPrimeIcon } from "@in/widget/icon/x-prime-icon.tsx";
import { MinimizeIcon } from "@in/widget/icon/minimize-icon.tsx";
import { MaximizeIcon } from "@in/widget/icon/maximize-icon.tsx";
import type { PresentationToggleConfig } from "../type.ts";

export function getPresentationToggleIcon(
  kind: "minimize" | "maximize" | "close",
  icons?: PresentationToggleConfig["icon"]
): JSX.Element | null {
  if (kind === "minimize")
    return icons?.minimize ?? <MinimizeIcon format="fill" />;
  if (kind === "maximize")
    return icons?.maximize ?? <MaximizeIcon format="fill" />;
  return icons?.close ?? <XPrimeIcon format="fill" />;
}

export function renderPresentationToggles(opts: {
  id: string;
  config?: PresentationToggleConfig;
  axis?: "x" | "y";
  capabilities?: { supportsMinimize?: boolean };
  handlers: {
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
  };
}): { startItems: JSX.Element[]; endItems: JSX.Element[] } {
  const {
    config,
    axis = "x",
    capabilities = { supportsMinimize: false },
    handlers,
  } = opts;

  const modesRaw = config?.modes ?? [
    capabilities.supportsMinimize ? "minimize" : "close",
  ];
  const modes =
    modesRaw === "none"
      ? []
      : (modesRaw as ("minimize" | "close" | "maximize")[]);
  const placement = config?.placement ?? "end";
  const layout = config?.layout ?? "inline";
  const icons = config?.icon ?? {};
  const labelMode = config?.label ?? "auto";
  const extraOn = config?.on ?? {};

  function ToggleItem(
    kind: "minimize" | "close" | "maximize",
    key: string
  ): JSX.Element {
    const onTap =
      kind === "close"
        ? handlers.onClose
        : kind === "maximize"
        ? handlers.onMaximize || (() => {})
        : handlers.onMinimize;
    const iconNode = getPresentationToggleIcon(kind, icons);
    const label =
      kind === "minimize"
        ? "Minimize"
        : kind === "maximize"
        ? "Maximize"
        : "Close";
    const showLabel = labelMode !== "never";
    const extra = (extraOn as any)[kind] || {};
    return (
      <>
        <Slot
          key={key}
          className={PresentationToggleStyle.item.getStyle({})}
          on:tap={onTap}
          {...extra}
        >
          <Slot className={PresentationToggleStyle.icon.getStyle({})}>
            {iconNode}
          </Slot>
          {showLabel && (
            <Slot className={PresentationToggleStyle.label.getStyle({})}>
              {label}
            </Slot>
          )}
        </Slot>
      </>
    );
  }

  const filtered = modes.filter((m) =>
    m === "minimize" ? !!capabilities.supportsMinimize : true
  );

  const startModes =
    layout === "split"
      ? filtered.slice(0, 1)
      : placement === "start"
      ? filtered
      : [];
  const endModes =
    layout === "split"
      ? filtered.slice(1)
      : placement === "end"
      ? filtered
      : [];

  return {
    startItems: startModes.map((m, i) => ToggleItem(m, `__pt-s-${i}`)),
    endItems: endModes.map((m, i) => ToggleItem(m, `__pt-e-${i}`)),
  };
}
