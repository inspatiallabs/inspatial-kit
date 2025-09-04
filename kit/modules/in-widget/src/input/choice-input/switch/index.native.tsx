import { iss, composeStyle } from "@in/style";
import { SwitchStyle } from "./style.ts";
import type { SwitchProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";
import { getChoiceInputIcon } from "../helpers.tsx";

/*##############################(SWITCH)####################################*/

// Create composed style for cross-references to work
const composedSwitchStyle = composeStyle(
  SwitchStyle.track.getStyle,
  SwitchStyle.handle.getStyle
);

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
    icon,
    $ref,
    children,
    ...rest
  } = props;

  // Track gets size, radius, disabled - handle only gets disabled
  const trackProps = { size, radius, disabled } as const;
  const handleProps = { disabled } as const;
  const wrapperProps = { disabled, className } as const;

  /**************************(State)**************************/
  const isChosen = checked === true;

  /**************************(Handlers)**************************/
  const handleChange = (event: any) => {
    const newChecked = event?.target?.checked ?? !isChosen;
    onChange?.(newChecked);
  };

  /**************************(Render)**************************/

  return (
    <>
      <label className={iss(SwitchStyle.wrapper.getStyle(wrapperProps))}>
        <input
          type="checkbox"
          className={iss(SwitchStyle.input.getStyle({}))}
          checked={isChosen}
          disabled={disabled}
          defaultChecked={defaultChecked}
          on:input={handleChange}
          on:change={handleChange}
          $ref={$ref}
          {...rest}
        />
        {(() => {
          const { className: trackClassName, ...trackRest } = children?.track ?? {};
          const { className: handleClassName, ...handleRest } = children?.handle ?? {};
          const { className: iconClassName, ...iconRest } = children?.icon ?? {};

          return (
            <Slot
              className={iss(
                SwitchStyle.track.getStyle({
                  ...trackProps,
                  className: trackClassName,
                })
              )}
              data-checked={isChosen}
              {...trackRest}
            >
              <Slot
                className={iss(
                  composedSwitchStyle({
                    ...trackProps,
                    ...handleProps,
                    className: handleClassName,
                  })
                )}
                data-checked={isChosen}
                {...handleRest}
              >
                <Slot
                  className={iss(
                    SwitchStyle.icon.getStyle({ className: iconClassName })
                  )}
                  {...iconRest}
                >
                  {getChoiceInputIcon(icon, isChosen)}
                </Slot>
              </Slot>
            </Slot>
          );
        })()}
      </label>
    </>
  );
}
