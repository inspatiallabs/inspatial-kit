import { iss } from "@in/style";
import { CheckboxStyle } from "./style.ts";
import type { CheckboxProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";
import { Icon } from "@in/widget/icon/icon.tsx";
import { PlusPrimeIcon } from "@in/widget/icon/plus-prime-icon.tsx";
import { RoundIcon } from "@in/widget/icon/round-icon.tsx";
import { ArrowsHorizontalLineIcon } from "@in/widget/icon/arrows-horizontal-line-icon.tsx";
import { CheckIcon } from "@in/widget/icon/check-icon.tsx";

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
  const isChecked = checked === true;
  const isIndeterminate = checked === "indeterminate";

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(CheckboxStyle.wrapper.getStyle(styleProps))}>
        <input
          type="checkbox"
          className={iss(CheckboxStyle.input.getStyle(styleProps))}
          checked={isChecked}
          disabled={disabled}
          $ref={$ref}
          {...rest}
        />
        <Slot
          className={iss(CheckboxStyle.indicator.getStyle(styleProps))}
          data-checked={isChecked}
          data-indeterminate={isIndeterminate}
        >
          {(() => {
            switch (icon) {
              case "brand":
                return <Icon size="8xs" />;
              case "tick":
                return <CheckIcon size="8xs" />;
              case "ball":
                return (
                  <RoundIcon
                    size="8xs"
                    style={{
                      web: {
                        fill: isChecked ? "white" : "currentColor",
                      },
                    }}
                  />
                );
              case "cross":
                return <PlusPrimeIcon size="8xs" />;
              case "dash":
                return (
                  <ArrowsHorizontalLineIcon
                    size="8xs"
                    style={{
                      web: {
                        maxWidth: "10px",
                      },
                    }}
                  />
                );
              default:
                return <Icon size="8xs" />;
            }
          })()}
        </Slot>
      </label>
    </>
  );
}
