import { IconStyle, type IconProps } from "./style.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function InSpatialIcon({
  size,
  format,
  className,
  ...props
}: IconProps) {
  // Default to 'lg' size if no size is provided
  const sizeClass = size
    ? size === "sm"
      ? "w-4 h-4"
      : size === "lg"
      ? "w-8 h-8"
      : "w-6 h-6"
    : "w-8 h-8";

  // Use a utility function or a simple template literal to compose classes
  const renderClassName = `stroke-secondary ${sizeClass} ${className}`;
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 19 21`}
        fill={format === "fill" ? "currentColor" : "none"}
        stroke="currentColor"
        className={iss(
          `${IconStyle.getStyle({ size, format })}`,
          renderClassName
        )}
        {...props}
      >
        <path
          d="M17.1906 4.50476L15.9276 3.76935L13.3377 5.28813L11.1634 6.53512L10.6518 6.82289L0.5 12.6902V14.145C0.5 15.1042 1.01159 15.9835 1.84292 16.4631L3.1059 17.1985L13.3377 11.2993V12.6902L4.32093 17.902L8.18981 20.1402C9.02114 20.6198 10.0443 20.6198 10.8757 20.1402L13.3377 18.7173L17.2066 16.4791C18.0379 15.9995 18.5495 15.1202 18.5495 14.161V6.83888C18.5335 5.87965 18.0219 4.98437 17.1906 4.50476Z"
          fill="currentColor"
        />
        <path
          d="M4.24099 3.1297L1.84292 4.52058C1.01159 4.98421 0.5 5.87949 0.5 6.83872V11.2991L9.4528 6.13528L4.24099 3.1297Z"
          fill="currentColor"
        />
        <path
          d="M13.3377 3.88125L14.7286 3.08189L13.3377 2.28254L10.8597 0.85968C10.0284 0.380066 9.0052 0.380066 8.17387 0.85968L5.45605 2.42642L10.6679 5.432L13.3377 3.88125Z"
          fill={format === "fill" ? "currentColor" : "url(#paint0_linear_17999_41146)"}
        />
        <defs>
          <linearGradient
            id="paint0_linear_17999_41146"
            x1="16.1566"
            y1="-4.65624"
            x2="5.07274"
            y2="-1.65441"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#761FEC" />
            <stop offset="1" stop-color="#CE17D6" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
