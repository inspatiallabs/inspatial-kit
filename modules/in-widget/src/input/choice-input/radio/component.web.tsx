import { iss } from "@in/style";
import { RadioStyle } from "./style.ts";
import type { RadioProps } from "./type.ts";
import { Slot } from "@in/widget/structure";
import { getChoiceInputIcon } from "../helpers.tsx";

/*##############################(CHECKBOX)####################################*/

export function Radio(props: RadioProps) {
  /**************************(Props)**************************/
  const {
    className,
    class: cls,
    format,
    size,
    radius,
    disabled,
    selected = false,
    defaultSelected,
    name,
    value,
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
    class: cls,
  } as const;

  /**************************(State)**************************/

  const isSelected = selected === true;

  /**************************(Render)**************************/
  return (
    <>
      <label
        className={iss(RadioStyle.wrapper.getStyle(styleProps))}
        aria-checked={isSelected}
      >
        <input
          type="radio"
          // @ts-ignore
          className={iss(RadioStyle.input.getStyle(styleProps))}
          checked={isSelected}
          defaultChecked={defaultSelected}
          name={name}
          value={value as any}
          disabled={disabled}
          $ref={$ref}
          {...rest}
        />
        <Slot
          className={iss(RadioStyle.indicator.getStyle(styleProps))}
          data-checked={isSelected}
        >
          {getChoiceInputIcon(icon)}
        </Slot>
      </label>
    </>
  );
}
