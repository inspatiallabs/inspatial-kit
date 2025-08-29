import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function PlusPrimeIcon({
  size,
  format,
  disabled,
  className,
  ...props
}: IconProps) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 32 32`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled }),
          className
        )}
        {...props}
      >
        <path
          d="M26.9567 13.5095H19.5321C18.9561 13.5095 18.4896 13.043 18.4896 12.4671V5.04242C18.4896 4.46648 18.0232 4 17.4472 4H14.551C13.9751 4 13.5086 4.46648 13.5086 5.04242V12.4671C13.5086 13.043 13.0421 13.5095 12.4662 13.5095H5.04242C4.46648 13.5095 4 13.976 4 14.5519V17.4481C4 18.024 4.46648 18.4905 5.04242 18.4905H12.4671C13.043 18.4905 13.5095 18.957 13.5095 19.5329V26.9576C13.5095 27.5335 13.976 28 14.5519 28H17.4481C18.024 28 18.4905 27.5335 18.4905 26.9576V19.5329C18.4905 18.957 18.957 18.4905 19.5329 18.4905H26.9576C27.5335 18.4905 28 18.024 28 17.4481V14.5519C28 13.976 27.5335 13.5095 26.9576 13.5095H26.9567Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
