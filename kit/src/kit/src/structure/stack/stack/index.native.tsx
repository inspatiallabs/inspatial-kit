import { iss } from "@in/style";
import { StackStyle, type StackProps } from "./style.ts";

/*#####################################(Render)#####################################*/

export function Stack(props: StackProps) {
  const { children, className, $ref, variant, disabled, gap, ...rest } = props;

  return (
    <>
      <div
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
      </div>
    </>
  );
}
