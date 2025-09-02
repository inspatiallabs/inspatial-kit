import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function ArrowsHorizontalLineIcon({
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
        viewBox={`0 0 28 4`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled }),
          className
        )}
        {...props}
      >
        <path
          d="M0 1.9998C0 1.33706 0.447715 0.799805 1 0.799805H27C27.5523 0.799805 28 1.33706 28 1.9998C28 2.66255 27.5523 3.1998 27 3.1998H1C0.447715 3.1998 0 2.66255 0 1.9998Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
