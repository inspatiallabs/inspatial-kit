import { iss } from "@in/style";
import type { SearchFieldProps } from "../type.ts";
import { $ } from "@in/teract/state";
import { Show } from "@in/widget/control-flow/index.ts";
import { Button } from "@in/widget/ornament/index.ts";
import { XStack } from "@in/widget/structure/index.ts";
import { Icon } from "@in/widget/icon";
import { SearchFieldStyle } from "./style.ts";

/*################################(SEARCHFIELD CLEAR ACTION)################################*/

function SearchFieldClearAction(props: SearchFieldProps) {
  /***************************(Props)***************************/
  const { ...rest } = props;

  return (
    <Button
      className={iss(
        SearchFieldStyle.action.getStyle({
          className: props.className,
          format: props.format,
          size: props.size,
          disabled: props.disabled,
        })
      )}
      on:tap={() => props?.cta?.clear?.()}
      title="Clear search"
      {...rest}
    >
      <Icon variant="XPrimeIcon" size="4xs" />
    </Button>
  );
}

/*################################(SEARCHFIELD)################################*/
export function SearchField(props: SearchFieldProps) {
  /***************************(Props)***************************/

  const {
    value,
    className,
    required,
    placeholder,
    disabled,
    $ref,
    cta,
    ...rest
  } = props;

  /***************************(Render)***************************/
  return (
    <XStack
      className={iss(
        SearchFieldStyle.wrapper.getStyle({
          className,
          format: props.format,
          radius: props.radius,
          size: props.size,
          disabled: disabled,
          ...rest,
        })
      )}
    >
      {/*=============================(INPUT)=============================*/}
      <input
        type="search"
        value={value}
        required={required || false}
        placeholder={placeholder || "Search..."}
        className={iss(
          SearchFieldStyle.field.getStyle({
            className,
            format: props.format,
            radius: props.radius,
            size: props.size,
            disabled: disabled,
            ...rest,
          })
        )}
        disabled={disabled}
        $ref={$ref}
        {...rest}
      />

      {/*==========================(CLEAR ACTION)==========================*/}
      <Show
        when={$(() => {
          const raw = props?.value;
          const current = typeof raw === "string" ? raw : raw?.get?.() ?? "";
          return current.length > 0 && !!cta?.clear;
        })}
      >
        <SearchFieldClearAction {...props} />
      </Show>
    </XStack>
  );
}
