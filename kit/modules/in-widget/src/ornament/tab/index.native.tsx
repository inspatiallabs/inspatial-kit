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

  // Pre-evaluate trigger style to register context BEFORE wrapper evaluates
  // This ensures cross-style composition works
  if (format) {
    TabStyle.trigger.getStyle({ format });
  }

  return (
    <Slot
      className={iss(
        TabStyle.wrapper.getStyle({
          disabled,
          className,
        })
      )}
      role="tablist"
      $ref={$ref}
      {...rest}
    >
      {children?.map((item: TabItemProps) => {
        const isSelected = selected === item.value;

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
              {...rest}
            />

            <Slot
              className={iss(
                TabStyle.trigger.getStyle({
                  className,
                  format,
                  disabled: disabled || item.disabled,
                })
              )}
              data-checked={isSelected}
              {...rest}
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
