import { TextInputStyle } from "../style.ts";
import { iss } from "@in/style/index.ts";
import type { SearchFieldProps } from "./type.ts";
import { $ } from "../../../../../in-teract/index.ts";
import { Show } from "@in/widget/control-flow/index.ts";
import { XPrimeIcon } from "@in/widget/icon/x-prime-icon.tsx";
import { Button } from "@in/widget/ornament/index.ts";
import { XStack } from "@in/widget/structure/index.ts";

/*################################(SEARCHFIELD CLEAR ACTION)################################*/

function SearchFieldClearAction(props: SearchFieldProps) {
  return (
    <>
      <Button
        format="surface"
        size="sm"
        on:tap={() => props?.cta?.clear?.()}
        title="Clear search"
      >
        <XPrimeIcon size="4xs" />
      </Button>
    </>
  );
}

/*################################(SEARCHFIELD)################################*/

/*################################(SEARCHFIELD)################################*/
export function SearchField(props: SearchFieldProps) {
  /***************************(Props)***************************/

  const {
    format,
    state,
    size,
    value,
    className,
    required,
    placeholder,
    disabled,
    $ref,
    cta,
    ...rest
  } = props;

  const styleProps = {
    format,
    state: disabled ? "disabled" : state,
    size,
    className,
  } as const;

  /***************************(Render)***************************/
  return (
    <>
      <XStack>
        {/*=============================(INPUT)=============================*/}
        <input
          type="search"
          value={value}
          required={required || false}
          placeholder={placeholder || "Search..."}
          className={iss(TextInputStyle.getStyle({ ...styleProps }))}
          disabled={disabled || false}
          $ref={$ref}
          {...rest}
        />

        {/*==========================(CLEAR ACTION)==========================*/}
        <Show
          when={$(() => {
            const raw = props?.value as any;
            const current = typeof raw === "string" ? raw : raw?.get?.() ?? "";
            return current.length > 0 && !!cta?.clear;
          })}
        >
          <SearchFieldClearAction {...props} />
        </Show>
      </XStack>
    </>
  );
}
