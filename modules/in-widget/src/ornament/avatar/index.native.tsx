import { iss } from "@in/style";
import { AvatarStyle } from "./style.ts";
import type { AvatarProps } from "./type.ts";
import { Image } from "@in/widget/media/image/index.ts";
import { Slot } from "@in/widget/structure/slot/index.tsx";
import { XStack } from "@in/widget/structure/stack/index.tsx";
import type { JSX } from "@in/runtime/types";

export function Avatar(props: AvatarProps) {
  const {
    className,
    size = "md",
    status = "offline",
    colorCast,
    format = "initials",
    initials,
    src,
    hasAIBadge,
    realtime,
    position,
    $ref,
    ...rest
  } = props as any;

  const classes = AvatarStyle.getStyle({ size, status, className });

  const badge = hasAIBadge ? (
    <>
      <Slot
        className="absolute -right-0.5 -bottom-0.5 rounded-full bg-(--brand)"
        style={
          {
            web: { width: 12, height: 12, border: "2px solid var(--surface)" },
          } as any
        }
      />
    </>
  ) : null;

  const statusDot = (
    <Slot
      className="absolute right-0 top-0 rounded-full"
      style={
        {
          web: {
            width: 10,
            height: 10,
            backgroundColor:
              status === "live"
                ? "#22c55e"
                : status === "connecting"
                ? "#eab308"
                : status === "error"
                ? "#ef4444"
                : "#9ca3af",
            border: "2px solid var(--surface)",
          },
        } as any
      }
    />
  );

  const overlay =
    realtime && position ? (
      <Slot
        className="absolute inset-0 pointer-events-none"
        style={
          {
            web: {
              outline:
                "1px dashed color-mix(in oklab, var(--brand) 60%, transparent)",
              outlineOffset: 2,
            },
          } as JSX.UniversalStyleProps
        }
      />
    ) : null;

  const castStyle = colorCast ? { web: { background: colorCast } } : undefined;

  return (
    <Slot
      className={iss("relative inline-flex", classes)}
      $ref={$ref}
      {...rest}
    >
      {format === "photo" && src ? (
        <Image
          src={src}
          alt={initials || "avatar"}
          className="w-full h-full object-cover rounded-full"
          style={castStyle as any}
        />
      ) : (
        <XStack
          className="w-full h-full rounded-full flex items-center justify-center select-none"
          style={castStyle as any}
        >
          {format === "initials" ? (
            <Slot className="text-xs text-(--primary)">{initials || "?"}</Slot>
          ) : (
            <Slot className="text-xs text-(--primary)">🙂</Slot>
          )}
        </XStack>
      )}
      {statusDot}
      {badge}
      {overlay}
    </Slot>
  );
}
