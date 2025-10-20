import { ButtonStyle } from "./style.ts";
import type { ButtonProps } from "./type.ts";
import { Slot } from "@in/widget/structure/slot/index.ts";
import { LoadingIcon } from "@in/widget/icon/loading-icon.tsx";

/*##################################(BUTTON COMPONENT)##################################*/

export function Button(props: ButtonProps) {
  /*******************(Props)******************/

  const { $ref, className, asChild, format, size, ...rest } = props;

  /*******************(Slot)******************/

  const Component = asChild ? Slot : "button";

  /*******************(Render)******************/
  return (
    <>
      <Component
        className={ButtonStyle.wrapper.getStyle({
          format,
          size,
          className,
          ...rest,
        })}
        disabled={rest.disabled || rest.isLoading}
        $ref={$ref}
        {...rest}
      >
        {rest.isLoading ? (
          <Slot className={ButtonStyle.loader.getStyle()}>
            <LoadingIcon />

            <Slot className="sr-only">
              {rest.loadingText ? rest.loadingText : "Loading"}
            </Slot>
            {rest.loadingText ? rest.loadingText : rest.children}
          </Slot>
        ) : (
          rest.children
        )}
      </Component>
    </>
  );
}
