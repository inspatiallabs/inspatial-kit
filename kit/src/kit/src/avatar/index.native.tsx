import { iss } from "@in/style";
import { AvatarStyle } from "./style.ts";
import type { AvatarProps } from "./type.ts";

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
    <div
      className="absolute -right-0.5 -bottom-0.5 rounded-full bg-(--brand)"
      style={{ web: { width: 12, height: 12, border: "2px solid var(--surface)" } } as any}
    />
    </>
  ) : null;

  const statusDot = (
    <div
      className="absolute right-0 top-0 rounded-full"
      style={{
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
      } as any}
    />
  );

  const overlay = realtime && position
    ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            web: {
              outline: "1px dashed color-mix(in oklab, var(--brand) 60%, transparent)",
              outlineOffset: 2,
            },
          } as any}
        />
      )
    : null;

  const castStyle = colorCast
    ? { web: { background: colorCast } }
    : undefined;

  return (
    <div className={iss("relative inline-flex", classes)} $ref={$ref} {...rest}>
      {format === "photo" && src ? (
        <img
          src={src}
          alt={initials || "avatar"}
          className="w-full h-full object-cover rounded-full"
          style={castStyle as any}
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center select-none"
          style={castStyle as any}
        >
          {format === "initials" ? (
            <span className="text-xs text-(--primary)">{initials || "?"}</span>
          ) : (
            <span className="text-xs text-(--primary)">🙂</span>
          )}
        </div>
      )}
      {statusDot}
      {badge}
      {overlay}
    </div>
  );
}


