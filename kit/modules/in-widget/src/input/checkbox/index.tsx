import { iss } from "@in/style";
import { CheckboxStyle } from "./style.ts";
import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
  CheckboxProps,
} from "./type.ts";
import { Slot } from "@in/widget/structure";

/*##############################(ROOT)####################################*/

export function CheckboxRoot({
  className,
  format,
  $ref,
  checked,
  ...rest
}: CheckboxRootProps) {
  return (
    <>
      <input
        type="checkbox"
        className={iss(CheckboxStyle.root.getStyle({ format, className }))}
        $ref={$ref}
        checked={checked}
        {...rest}
      />
    </>
  );
}

/*##############################(INDICATOR)####################################*/
export function CheckboxIndicator({
  className,
  format,
  $ref,
  checked,
  ...rest
}: CheckboxIndicatorProps) {
  return (
    <Slot
      className={iss(CheckboxStyle.indicator.getStyle({ format, className }))}
      $ref={$ref}
      checked={checked}
      {...rest}
    />
  );
}

/*##############################(CHECKBOX)####################################*/
export function Checkbox({
  className,
  format,
  $ref,
  checked,
  ...rest
}: CheckboxProps) {
  /************************(render)************************/
  return (
    <CheckboxRoot
      $ref={$ref}
      checked={checked}
      className={iss(CheckboxStyle.wrapper.getStyle({ format, className }))}
      {...rest}
    >
      <CheckboxIndicator $ref={$ref} checked={checked} {...rest}>
        {checked === "indeterminate" ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              x1="4"
              x2="12"
              y1="8"
              y2="8"
            ></line>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2 5.59998L6.79999 9.99998L4.79999 7.99998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        )}
      </CheckboxIndicator>
    </CheckboxRoot>
  );
}
