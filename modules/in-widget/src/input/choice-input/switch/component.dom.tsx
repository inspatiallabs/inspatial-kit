import { iss } from "@in/style";
import { SwitchStyle } from "./style.ts";
import type { SwitchProps } from "./type.ts";
import { Slot } from "../../../structure/index.ts";
import { getChoiceInputIcon } from "../helpers.tsx";

/*##############################(SWITCH)####################################*/

export function Switch(props: SwitchProps) {
  /**************************(Props)**************************/
  const {
    className,
    class: cls,
    style,
    size,
    radius,
    disabled,
    selected = false,
    defaultSelected,
    onChange,
    icon,
    $ref,
    children,
    ...rest
  } = props;

  // Track gets size, radius, disabled - handle only gets disabled
  const trackProps = { size, radius, disabled } as const;
  const handleProps = { disabled } as const;
  const wrapperProps = { disabled, className, class: cls } as const;

  /**************************(State)**************************/
  
  const isSelected = selected === true;

  /**************************(Handlers)**************************/

  const handleChange = (event: any) => {
    const newSelected = event?.target?.checked ?? !isSelected;
    onChange?.(newSelected);
  };

  /**************************(Render)**************************/

  return (
    <>
      <label
        className={iss(SwitchStyle.wrapper.getStyle(wrapperProps))}
        style={style}
      >
        <input
          type="checkbox"
          className={iss(SwitchStyle.input.getStyle({}))}
          checked={isSelected}
          disabled={disabled}
          defaultChecked={defaultSelected}
          on:input={handleChange}
          on:change={handleChange}
          $ref={$ref}
          {...rest}
        />
        {(() => {
          const {
            className: trackClassName,
            class: trackClass,
            style: trackStyle,
            ...trackRest
          } = children?.track ?? ({} as any);
          const {
            className: handleClassName,
            class: handleClass,
            style: handleStyle,
            ...handleRest
          } = children?.handle ?? ({} as any);
          const {
            className: iconClassName,
            class: iconClass,
            style: iconStyle,
            ...iconRest
          } = children?.icon ?? ({} as any);

          return (
            <Slot
              className={iss(
                SwitchStyle.track.getStyle({
                  ...trackProps,
                  className: trackClassName,
                  class: trackClass,
                })
              )}
              data-checked={isSelected}
              style={trackStyle}
              {...trackRest}
            >
              <Slot
                className={iss(
                  SwitchStyle.handle.getStyle({
                    ...trackProps,
                    ...handleProps,
                    className: handleClassName,
                    class: handleClass,
                  })
                )}
                data-checked={isSelected}
                style={handleStyle}
                {...handleRest}
              >
                <Slot
                  className={iss(
                    SwitchStyle.icon.getStyle({
                      className: iconClassName,
                      class: iconClass,
                    })
                  )}
                  style={iconStyle}
                  {...iconRest}
                >
                  {getChoiceInputIcon(icon, isSelected)}
                </Slot>
              </Slot>
            </Slot>
          );
        })()}
      </label>
    </>
  );
}
