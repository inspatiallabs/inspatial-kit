import { iss } from "@in/style";
import { CheckboxStyle } from "./style.ts";
import type { CheckboxProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";
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
        <Slot
          className={iss(CheckboxStyle.indicator.getStyle(styleProps))}
          data-checked={isSelected}
          data-indeterminate={isIndeterminate}
        >
          {getChoiceInputIcon(icon, isSelected)}
        </Slot>
      </label>
    </>
  );
}
