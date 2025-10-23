import { iss } from "@in/style";
import { CheckboxStyle } from "./style.ts";
import type { CheckboxProps } from "./type.ts";
import { Slot } from "@in/widget/structure";
import { Show } from "@in/widget/control-flow";
import { getChoiceInputIcon } from "../helpers.tsx";

/*##############################(CHECKBOX)####################################*/

export function Checkbox(props: CheckboxProps) {
  /**************************(Props)**************************/
  const {
    className,
    format,
    size,
    radius,
    disabled,
    selected = false,
    icon,
    type = "default",
    $ref,
    ...rest
  } = props;

  const styleProps = {
    format,
    size,
    radius,
    disabled,
    className,
  } as const;

  /**************************(State)**************************/
  const isSelected = selected === true;
  const isIndeterminate = selected === "indeterminate";
  const isToggle = type === "toggle";

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(CheckboxStyle.wrapper.getStyle(styleProps))}>
        <input
          type="checkbox"
          className={iss(CheckboxStyle.input.getStyle(styleProps))}
          checked={isSelected}
          disabled={disabled}
          $ref={$ref}
          {...rest}
        />
        {/* Default Indicator */}
        {/* @ts-ignore */}
        <Show when={!isToggle}>
          <Slot
            className={iss(
              CheckboxStyle.indicator.default.getStyle(styleProps)
            )}
            data-checked={isSelected}
            data-indeterminate={isIndeterminate}
            {...rest}
          >
            {getChoiceInputIcon(icon, isSelected)}
          </Slot>
        </Show>

        {/* Toggle Indicator */}
        {/* @ts-ignore */}
        <Show when={isToggle}>
          <Slot
            className={iss(CheckboxStyle.indicator.toggle.getStyle(styleProps))}
            data-checked={isSelected}
            data-indeterminate={isIndeterminate}
            {...rest}
          >
            {getChoiceInputIcon(icon, true)}
          </Slot>
        </Show>
      </label>
    </>
  );
}
