import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function RoundIcon({
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
          d="M28 15.5C28 22.1274 22.6274 27.5 16 27.5C9.37258 27.5 4 22.1274 4 15.5C4 8.87258 9.37258 3.5 16 3.5C22.6274 3.5 28 8.87258 28 15.5Z"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </>
  );
}
