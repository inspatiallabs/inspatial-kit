import { iss } from "@in/style";
import { RadioStyle } from "./style.ts";
import type { RadioProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";
import { getChoiceInputIcon } from "../helpers.tsx";

/*##############################(CHECKBOX)####################################*/

export function Radio(props: RadioProps) {
  /**************************(Props)**************************/
  const {
    className,
    format,
    size,
    radius,
    disabled,
    checked = false,
    defaultChecked,
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
  } as const;

  /**************************(State)**************************/
  const isChosen = checked === true;

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(RadioStyle.wrapper.getStyle(styleProps))} aria-checked={isChosen}>
        <input
          type="radio"
          className={iss(RadioStyle.input.getStyle(styleProps))}
          checked={isChosen}
          defaultChecked={defaultChecked}
          name={name}
          value={value as any}
          disabled={disabled}
          $ref={$ref}
          {...rest}
        />
        <Slot
          className={iss(RadioStyle.indicator.getStyle(styleProps))}
          data-checked={isChosen}
        >
          {getChoiceInputIcon(icon, isChosen)}
        </Slot>
      </label>
    </>
  );
}
