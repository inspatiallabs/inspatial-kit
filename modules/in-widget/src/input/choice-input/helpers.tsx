import { Icon } from "@in/widget/icon/component.tsx";
import type { ChoiceInputProps } from "./type.ts";
import type { IconVariant } from "@in/widget/icon/icon-variants.generated.d.ts";

/*#################################(CHOICE INPUT ICON)#################################*/
export function getChoiceInputIcon(
  icon: ChoiceInputProps["icon"],
  isChosen?: boolean
) {
  // If icon is not a string (i.e., it's a JSX element), return it directly
  if (typeof icon !== "string" && icon != null) {
    return icon;
  }

  return (
    <Icon
      variant={icon as IconVariant}
      size="8xs"
      style={{
        web: {
          fill: isChosen ? "white" : "currentColor",
        },
      }}
    />
  );
}
