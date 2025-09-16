import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function FolderNotchIcon({
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
          d="M27 8.5H16.5L13.1663 6C12.733 5.67641 12.207 5.50107 11.6663 5.5H5C4.33696 5.5 3.70107 5.76339 3.23223 6.23223C2.76339 6.70107 2.5 7.33696 2.5 8V25C2.5 25.663 2.76339 26.2989 3.23223 26.7678C3.70107 27.2366 4.33696 27.5 5 27.5H27C27.663 27.5 28.2989 27.2366 28.7678 26.7678C29.2366 26.2989 29.5 25.663 29.5 25V11C29.5 10.337 29.2366 9.70107 28.7678 9.23223C28.2989 8.76339 27.663 8.5 27 8.5ZM5.5 8.5H11.5L13.5 10L11.5 11.5H5.5V8.5ZM26.5 24.5H5.5V14.5H11.6663C12.207 14.4989 12.733 14.3236 13.1663 14L16.5 11.5H26.5V24.5Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
