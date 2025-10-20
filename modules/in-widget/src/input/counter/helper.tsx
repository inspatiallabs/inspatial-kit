import { Icon, type IconProps } from "@in/widget/icon";

/*####################################(ICON HELPER)####################################*/
export function getCounterIcon(
  icon: any,
  fallbackVariant: IconProps["variant"]
) {
  if (icon == null) return <Icon variant={fallbackVariant} />;
  if (typeof icon === "string") return <Icon variant={icon} />;
  if (typeof icon === "object" && typeof icon.variant === "string") {
    return <Icon variant={icon.variant} {...icon} />;
  }
  // Treat any other non-string truthy value as JSX node (custom icon component)
  return icon as any;
}
