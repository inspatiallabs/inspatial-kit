import { ButtonStyle } from "./style.ts";
import type { ButtonProps } from "./type.ts";
import { Slot } from "@in/widget/structure/slot/index.ts";
import { LoadingIcon } from "@in/widget/icon/loading-icon.tsx";

/************************************************************************************
 * ================================================================================================
 *
 * Component: Button
 *
 * ================={Description}=================
 *
 * The Button component is used to trigger an action or event.
 *
 * ================={Props}=================
 *
 * @variant {string} - Type of button component. {"primaryButton" | "barrowButton" | "iconButton"}
 *
 * @format {string} - Format of the button component.
 *
 * @size - Size of the button component.
 *
 * @radius {string} - Radius of the button component.
 *
 * @theme {string} - Theme of the button component.
 *
 * @axis {string} - Axis of the button component.
 *
 * @disabled {boolean} - Disabled state of the button component.
 *
 * @iconOnly {boolean} - Icon only state of the button component.
 *
 *
 * ================={Example}=================
 *
 * ```jsx
 * <Button variant="base" format="base" size="base" mode="light" axis="x">
 *   Text
 * </Button>
 * ```
 *
 * ================================================================================================
 */

//*************************************(COMPONENT)*************************************//
export function Button(props: ButtonProps) {
  /**************************************************(VARIANT PROP)**************************************************/
  const { $ref, className, asChild, format, size, ...rest } = props;

  /*******************(slot)******************/

  const Component = asChild ? Slot : "button";

  //*************************************(RETURN)*************************************//

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
