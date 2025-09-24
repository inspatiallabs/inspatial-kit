import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function ClockIcon({
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
        viewBox={`0 0 25 24`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled, ...props }),
          className
        )}
        {...props}
      >
        <path
          d="M12.5 22.75C6.57 22.75 1.75 17.93 1.75 12C1.75 6.07 6.57 1.25 12.5 1.25C18.43 1.25 23.25 6.07 23.25 12C23.25 17.93 18.43 22.75 12.5 22.75ZM12.5 2.75C7.4 2.75 3.25 6.9 3.25 12C3.25 17.1 7.4 21.25 12.5 21.25C17.6 21.25 21.75 17.1 21.75 12C21.75 6.9 17.6 2.75 12.5 2.75Z"
          fill="currentColor"
        />
        <path
          d="M16.2101 15.93C16.0801 15.93 15.9501 15.9 15.8301 15.82L12.7301 13.97C11.9601 13.51 11.3901 12.5 11.3901 11.61V7.51001C11.3901 7.10001 11.7301 6.76001 12.1401 6.76001C12.5501 6.76001 12.8901 7.10001 12.8901 7.51001V11.61C12.8901 11.97 13.1901 12.5 13.5001 12.68L16.6001 14.53C16.9601 14.74 17.0701 15.2 16.8601 15.56C16.7101 15.8 16.4601 15.93 16.2101 15.93Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
