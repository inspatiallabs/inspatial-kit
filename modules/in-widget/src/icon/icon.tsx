import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function Icon({
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
        viewBox={`0 0 19 21`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled, ...props }),
          className
        )}
        {...props}
      >
        <path
          d="M16.6906 4.00479L15.4276 3.26938L12.8377 4.78816L10.6634 6.03515L10.1518 6.32292L0 12.1902V13.645C0 14.6043 0.511588 15.4836 1.34292 15.9632L2.6059 16.6986L12.8377 10.7993V12.1902L3.82093 17.402L7.68981 19.6402C8.52114 20.1198 9.54432 20.1198 10.3757 19.6402L12.8377 18.2174L16.7066 15.9792C17.5379 15.4995 18.0495 14.6202 18.0495 13.661V6.33891C18.0335 5.37968 17.5219 4.4844 16.6906 4.00479Z"
          fill="currentColor"
        />
        <path
          d="M3.74099 2.62973L1.34292 4.02061C0.511588 4.48424 0 5.37952 0 6.33875V10.7992L8.9528 5.63531L3.74099 2.62973Z"
          fill="currentColor"
        />
        <path
          d="M12.8377 3.38128L14.2286 2.58192L12.8377 1.78257L10.3597 0.359711C9.52838 -0.119904 8.5052 -0.119904 7.67387 0.359711L4.95605 1.92645L10.1679 4.93203L12.8377 3.38128Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
