import type { NumberFieldProps } from "../type.ts";
import { iss } from "@in/style";
import { XStack } from "@in/widget/structure/stack/index.ts";
import { Button, type ButtonProps } from "@in/widget/ornament/button/index.ts";
import { NumberFieldStyle } from "./style.ts";

/*################################(NUMBERFIELD ACTION)################################*/

export function NumberFieldAction(props: ButtonProps) {
  /***************************(Props)***************************/

  const { ...rest } = props;

  /***************************(Render)***************************/
  return (
    <Button
      className={iss(
        NumberFieldStyle.action.getStyle({
          className: props.className,
          format: props.format,
          size: props.size,
          disabled: props.disabled,
          ...rest,
        })
      )}
      title="Unit"
      {...rest}
    >
      PT
    </Button>
  );
}

/*################################(NUMBERFIELD)################################*/
export function NumberField(props: NumberFieldProps) {
  /***************************(Props)***************************/

  const { id, required, placeholder, disabled, $ref, ...rest } = props;

  /***************************(Render)***************************/
  return (
    <XStack
      className={iss(
        NumberFieldStyle.wrapper.getStyle({
          className: props.className,
          format: props.format,
          radius: props.radius,
          size: props.size,
          disabled,
          ...rest,
        })
      )}
    >
      <input
        id={id}
        type="number"
        required={required || false}
        placeholder={placeholder || "Number Value..."}
        className={iss(
          NumberFieldStyle.field.getStyle({
            className: props.className,
            format: props.format,
            radius: props.radius,
            size: props.size,
            disabled,
            ...rest,
          })
        )}
        disabled={disabled || false}
        $ref={$ref}
        {...rest}
      />
      <NumberFieldAction {...props} />
    </XStack>
  );
}
