import { Slot } from "../../structure/slot/index.tsx";
import { iss } from "@in/style";
import { NotchStyle, type NotchProps } from "./style.ts";

//##############################################(COMPONENT)##############################################//
export function Notch(props: NotchProps) {
  //*************************************(Props)*************************************//
  const {
    children,
    className,
    $ref,
    fill = "var(--surface)",
    stroke = "var(--muted)",
    fillOpacity = "0.95",
    variant,
    direction = "down",
    strokeWidth = "2",
    ...rest
  } = props;

  // Normalize for comparisons so variant/direction props are case-insensitive
  const v = (variant || "sharp").toLowerCase();
  const dir = (direction || "down").toLowerCase();

  //*************************************(Render)*************************************//

  return (
    <>
      <Slot
        className={iss(NotchStyle.getStyle({}), variant, direction, className)}
        $ref={$ref}
        {...rest}
      >
        {v === "sharp" && (dir === "left" || dir === "right") ? (
          <svg
            width={`${
              (((globalThis as any) || {}).innerWidth ?? 1920) <= 1920
                ? "50"
                : "75"
            }`}
            height="605"
            viewBox="0 0 75 605"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
          >
            <g filter="url(#filter0_bd_10538_54975)">
              <path
                d="M11.6148 43.1157L77 0L77 600L10.2835 542.726C5.2063 538.366 2 529.467 2 519.734L2 67.1155C2 56.4761 5.8222 46.9353 11.6148 43.1157Z"
                fill="var(--surface)"
                fill-opacity="0.95"
              />
              <path
                d="M11.89 43.5331L76.5 0.928625L76.5 598.912L10.6092 542.346C5.68546 538.119 2.5 529.39 2.5 519.734L2.5 67.1155C2.5 61.853 3.44568 56.8718 5.09931 52.7441C6.75542 48.6102 9.10624 45.3687 11.89 43.5331Z"
                stroke="url(#paint0_linear_10538_54975)"
                stroke-opacity="0.5"
              />
              <path
                d="M11.89 43.5331L76.5 0.928625L76.5 598.912L10.6092 542.346C5.68546 538.119 2.5 529.39 2.5 519.734L2.5 67.1155C2.5 61.853 3.44568 56.8718 5.09931 52.7441C6.75542 48.6102 9.10624 45.3687 11.89 43.5331Z"
                stroke="url(#paint1_linear_10538_54975)"
                stroke-opacity="0.5"
              />
            </g>
            <defs>
              <filter
                id="filter0_bd_10538_54975"
                x="-63"
                y="-65"
                width="205"
                height="730"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="32.5" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_10538_54975"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="1"
                  operator="dilate"
                  in="SourceAlpha"
                  result="effect2_dropShadow_10538_54975"
                />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_backgroundBlur_10538_54975"
                  result="effect2_dropShadow_10538_54975"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_10538_54975"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_10538_54975"
                x1="60.9286"
                y1="68.182"
                x2="13.6685"
                y2="80.2506"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.01632" stop-color="white" stop-opacity="0.25" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_10538_54975"
                x1="11.8214"
                y1="521.223"
                x2="34.9932"
                y2="498.811"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0.3" />
                <stop offset="1" stop-color="white" stop-opacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        ) : null}

        {v === "sharp" && (dir === "down" || dir === "up") ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="250"
            height="75"
            viewBox="0 0 250 75"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            className={iss(
              `flex absolute left-0 top-0 w-full max-h-[50px] `,
              className
            )}
            {...rest}
          >
            <path
              d="M25.1508 65.3852L0 0H350L316.59 66.7165C314.047 71.7937 308.856 75 303.178 75H39.1507C32.9444 75 27.3789 71.1778 25.1508 65.3852Z"
              fill={fill}
              fillOpacity={fillOpacity}
              className="absolute -translate-x-[45px]"
            />
          </svg>
        ) : null}

        {/* Children/Content  - replace with inspatial slot*/}
        <section className="flex absolute flex-col h-full w-auto max-w-[50px] items-center justify-center">
          <div className="flex flex-col w-full h-full max-h-[475px] justify-center items-center gap-[25px]">
            {children}
          </div>
        </section>
      </Slot>
    </>
  );
}
