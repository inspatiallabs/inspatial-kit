import { iss } from "@in/style";
import { TabStyle } from "./style.ts";
import type { TabItemProps, TabProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";
import { computeTabValues } from "./helpers.ts";
import { generateUniqueId } from "@in/vader";
import { getChoiceInputIcon } from "@in/widget/input/choice-input/helpers.tsx";

/*##############################(TAB)####################################*/

export function Tab(props: TabProps) {
  /**************************(Props)**************************/
  const {
    className,
    children,
    selected,
    defaultSelected,
    format,
    size,
    radius,
    disabled = false,
    onChange,
    name,
    $ref,
    ...rest
  } = props;

  // Generate a unique name for this Tab instance if not provided
  const tabGroupName = name || generateUniqueId();

  /**************************(Functions)**************************/
  const handleChange = (value: string) => {
    // Support both onChange prop and trigger props
    onChange?.(value);
    // Also trigger on:input and on:change if they exist in rest props
    if (rest["on:input"]) {
      rest["on:input"](value);
    }
    if (rest["on:change"]) {
      rest["on:change"](value);
    }
  };

  const { resolvedItems, computedValues } = computeTabValues(children);

  // Map external (label or value) -> computed value
  function resolveToComputed(val?: string): string | undefined {
    if (!val) return undefined;
    if (computedValues.includes(val)) return val;
    for (let i = 0; i < resolvedItems.length; i++) {
      const it = resolvedItems[i]!;
      if (!it.value && val === it.label) return computedValues[i]!;
    }
    return undefined;
  }

  // Precedence: controlled selected -> defaultSelected -> first tab
  const selectedComputed =
    resolveToComputed(selected) ??
    resolveToComputed(defaultSelected) ??
    (computedValues.length > 0 ? computedValues[0] : undefined);

  /**************************(Render)**************************/

  return (
    <Slot
      className={iss(
        TabStyle.root.getStyle({
          disabled,
          className,
          class: className,
          // @ts-ignore
          format,
          size,
          radius,
          ...rest,
        })
      )}
      role="tablist"
      aria-orientation="horizontal"
      $ref={$ref}
      {...rest}
    >
      {resolvedItems?.map((item: TabItemProps, index: number) => {
        const computedValue = computedValues[index]!;
        const isSelected = selectedComputed === computedValue;
        const tabId = `tab-${computedValue}`;
        const panelId = `tabpanel-${computedValue}`;

        return (
          <label
            className={iss(
              // @ts-ignore
              TabStyle.wrapper.getStyle({ className, class: className }),
              (item as any)?.class,
              (item as any)?.className
            )}
            key={computedValue}
            // @ts-ignore
            style={(item as any)?.style}
          >
            <input
              type="radio"
              className={iss(TabStyle.input.getStyle())}
              name={tabGroupName}
              value={computedValue}
              checked={isSelected}
              defaultChecked={
                selected == null && defaultSelected === computedValue
              }
              disabled={disabled || item.disabled}
              // @ts-ignore
              on:input={() => handleChange(item.value ?? item.label)}
              on:change={() => handleChange(item.value ?? item.label)}
              aria-hidden="true"
              tabIndex={-1}
            />

            <Slot
              className={iss(
                TabStyle.trigger.getStyle({
                  className,
                  class: className,
                  format,
                  radius,
                  size,
                  scale: item.scale,
                  disabled: disabled || item.disabled,
                }),
                (item as any)?.class,
                (item as any)?.className
              )}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isSelected}
              aria-disabled={disabled || item.disabled}
              tabIndex={isSelected ? 0 : -1}
              data-checked={isSelected}
              // @ts-ignore
              style={(item as any)?.style}
            >
              {/* Trigger visual content */}
              {item.icon && (
                // @ts-ignore
                <Slot
                  className={iss(
                    // @ts-ignore
                    TabStyle.icon.getStyle({ className, class: className })
                  )}
                >
                  {getChoiceInputIcon(item.icon)}
                </Slot>
              )}
              {item.label}
            </Slot>
          </label>
        );
      })}
    </Slot>
  );
}
