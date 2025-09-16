import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function FileIcon({
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
          IconStyle.getStyle({ size, format, disabled, ...props }),
          className
        )}
        {...props}
      >
        <path
          d="M27.0613 9.94L20.0613 2.94C19.9219 2.80052 19.7565 2.68987 19.5744 2.61437C19.3923 2.53887 19.1971 2.50001 19 2.5H7C6.33696 2.5 5.70107 2.76339 5.23223 3.23223C4.76339 3.70107 4.5 4.33696 4.5 5V27C4.5 27.663 4.76339 28.2989 5.23223 28.7678C5.70107 29.2366 6.33696 29.5 7 29.5H25C25.663 29.5 26.2989 29.2366 26.7678 28.7678C27.2366 28.2989 27.5 27.663 27.5 27V11C27.5 10.6025 27.3422 10.2212 27.0613 9.94ZM20 7.125L22.875 10H20V7.125ZM7.5 26.5V5.5H17V11.5C17 11.8978 17.158 12.2794 17.4393 12.5607C17.7206 12.842 18.1022 13 18.5 13H24.5V26.5H7.5Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
