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
    checked = false,
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
  const isChosen = checked === true;
  const isIndeterminate = checked === "indeterminate";

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(CheckboxStyle.wrapper.getStyle(styleProps))}>
        <input
          type="checkbox"
          className={iss(CheckboxStyle.input.getStyle(styleProps))}
          checked={isChosen}
          disabled={disabled}
          $ref={$ref}
          {...rest}
        />
        <Slot
          className={iss(CheckboxStyle.indicator.getStyle(styleProps))}
          data-checked={isChosen}
          data-indeterminate={isIndeterminate}
        >
          {getChoiceInputIcon(icon, isChosen)}
        </Slot>
      </label>
    </>
  );
}
