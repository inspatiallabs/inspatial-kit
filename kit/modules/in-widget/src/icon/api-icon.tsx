import { IconStyle } from "./style.ts";
import type { IconProps } from "./type.ts";
import { iss } from "@in/style";

//##############################################(COMPONENT)##############################################//

export function APIIcon({
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
        viewBox={`0 0 24 24`}
        fill={format === "fill" ? "currentColor" : "none"}
        className={iss(
          IconStyle.getStyle({ size, format, disabled }),
          className
        )}
        {...props}
      >
        <path
          d="M1.71293 4.83244C0.65472 5.39262 0 6.426 0 7.54289V16.4536C0 17.574 0.65472 18.6074 1.71293 19.1641L2.6874 19.679V14.5574L4.21001 14.8253V20.4828L6.8974 21.9024V2.09764L1.71293 4.83244ZM4.21001 12H2.6874V6.87833L4.21001 6.32162V12Z"
          fill="currentColor"
        />
        <path
          d="M10.2869 0.420137L8.5511 1.33522V22.7474L10.2869 23.6625C10.5876 23.8226 10.9111 23.9304 11.2385 24V16.0844L11.9998 16.2166L15.4485 15.6112V1.33522L13.7127 0.420137C12.6545 -0.140046 11.3451 -0.140046 10.2869 0.420137ZM12.7611 12.0413H11.2385V3.95868L11.9998 3.69077L12.7611 3.95868V12.0413Z"
          fill="currentColor"
        />
        <path
          d="M23.9999 7.54114C23.9999 6.42077 23.3452 5.38739 22.287 4.83069L17.1025 2.09588V5.39783L19.2075 6.13894V17.861L17.1025 18.6021V21.9041L22.287 19.1693C23.3452 18.6091 23.9999 17.5757 23.9999 16.4588V16.1805L21.8949 16.9216V7.08882L23.9999 7.82993V7.54114Z"
          fill="currentColor"
        />
      </svg>
    </>
  );
}
