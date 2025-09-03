import { iss } from "@in/style";
import { SwitchStyle } from "./style.ts";
import type { SwitchProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";

/*##############################(SWITCH)####################################*/

export function Switch(props: SwitchProps) {
  /**************************(Props)**************************/
  const {
    className,
    size,
    radius,
    disabled,
    checked = false,
    defaultChecked,
    onChange,
    $ref,
    ...rest
  } = props;

  const styleProps = {
    size,
    radius,
    disabled,
    className,
  } as const;

  /**************************(State)**************************/
  const isChecked = checked === true;

  /**************************(Handlers)**************************/
  const handleChange = (event: any) => {
    const newChecked = event?.target?.checked ?? !isChecked;
    onChange?.(newChecked);
  };

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(SwitchStyle.wrapper.getStyle(styleProps))}>
        <input
          type="checkbox"
          className={iss(SwitchStyle.input.getStyle(styleProps))}
          checked={isChecked}
          disabled={disabled}
          defaultChecked={defaultChecked}
          on:input={handleChange}
          on:change={handleChange}
          $ref={$ref}
          {...rest}
        />
        <Slot
          className={iss(SwitchStyle.track.getStyle(styleProps))}
          data-checked={isChecked}
        >
          <Slot
            className={iss(SwitchStyle.handle.getStyle(styleProps))}
            data-checked={isChecked}
          />
        </Slot>
      </label>
    </>
  );
}
