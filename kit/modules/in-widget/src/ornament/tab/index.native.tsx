import { iss } from "@in/style";
import { TabStyle } from "./style.ts";
import type { TabItemProps, TabProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";

/*##############################(TAB)####################################*/

export function Tab(props: TabProps) {
  /**************************(Props)**************************/
  const {
    className,
    children,
    selected,
    format,
    size,
    radius,
    disabled = false,
    onChange,
    $ref,
    ...rest
  } = props;

  /**************************(Handlers)**************************/
  const handleChange = (value: string) => {
    onChange?.(value);
  };

  /**************************(Render)**************************/

  return (
    <Slot
      className={iss(
        TabStyle.wrapper.getStyle({
          radius,
          disabled,
          className,
          class: className,
          format,
          size,
        })
      )}
      role="tablist"
      aria-orientation="horizontal"
      $ref={$ref}
      {...rest}
    >
      {children?.map((item: TabItemProps, index: number) => {
        const isSelected = selected === item.value;
        const tabId = `tab-${item.value}`;
        const panelId = `tabpanel-${item.value}`;

        return (
          <label
            key={item.value}
            style={{
              web: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              },
            }}
          >
            <input
              type="radio"
              className={iss(TabStyle.input.getStyle())}
              name="inspatial-tab"
              value={item.value}
              checked={isSelected}
              disabled={disabled || item.disabled}
              on:input={() => handleChange(item.value)}
              on:change={() => handleChange(item.value)}
              aria-hidden="true"
              tabIndex={-1}
            />

            <Slot
              className={iss(
                TabStyle.trigger.getStyle({
                  className,
                  format,
                  disabled: disabled || item.disabled,
                })
              )}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isSelected}
              aria-disabled={disabled || item.disabled}
              tabIndex={isSelected ? 0 : -1}
              data-checked={isSelected}
            >
              {/* Trigger visual content */}
              {item.icon && <Slot className="tab-icon">{item.icon}</Slot>}
              {item.label}
            </Slot>
          </label>
        );
      })}
    </Slot>
  );
}
