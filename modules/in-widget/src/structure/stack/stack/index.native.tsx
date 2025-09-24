import { iss } from "@in/style";
import { StackStyle } from "./style.ts";
import { Slot } from "../../slot/index.tsx";
import type { StackProps } from "./type.ts";

/*#####################################(COMPONENT)#####################################*/

export function Stack(props: StackProps) {
  /***********************************(Props)*******************************************/

  const { children, className, $ref, variant, disabled, gap, ...rest } = props;

  /***********************************(Render)*******************************************/

  return (
    <>
      <Slot
        className={iss(
          `${StackStyle.getStyle({
            variant,
            ...rest,
          })}`,
          className
        )}
        disabled={disabled}
        $ref={$ref}
        style={{
          web: {
            gap: gap,
            flexWrap: (props as any).wrap,
            justifyContent: (props as any).justify,
            alignItems: (props as any).align,
            // Defensive: ensure correct direction even if CSS class is unavailable
            flexDirection:
              variant === "yStack"
                ? "column"
                : variant === "zStack"
                ? "row-reverse"
                : "row",
          },
        }}
        {...rest}
      >
        {children}
      </Slot>
    </>
  );
}
