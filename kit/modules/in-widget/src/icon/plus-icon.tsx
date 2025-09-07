import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function PlusIcon({
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
        viewBox={`0 0 16 16`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled, ...props }),
          className
        )}
        {...props}
      >
        <path
          d="M14.08 9.70621C15.1404 9.70621 16 8.8466 16 7.78621C16 6.72582 15.1404 5.86621 14.08 5.86621H1.92C0.859613 5.86621 0 6.72582 0 7.78621C0 8.8466 0.859613 9.70621 1.92 9.70621H14.08Z"
          fill="currentColor"
        />
        <path
          d="M6.29379 14.08C6.29379 15.1404 7.1534 16 8.21379 16C9.27418 16 10.1338 15.1404 10.1338 14.08V1.92C10.1338 0.859613 9.27418 0 8.21379 0C7.1534 0 6.29379 0.859613 6.29379 1.92V14.08Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
