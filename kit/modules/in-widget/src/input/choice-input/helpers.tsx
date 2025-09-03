import { Icon } from "@in/widget/icon/icon.tsx";
import { PlusPrimeIcon } from "@in/widget/icon/plus-prime-icon.tsx";
import { RoundIcon } from "@in/widget/icon/round-icon.tsx";
import { ArrowsHorizontalLineIcon } from "@in/widget/icon/arrows-horizontal-line-icon.tsx";
import { CheckIcon } from "@in/widget/icon/check-icon.tsx";
import type { ChoiceInputProps } from "./type.ts";

/*#################################(CHOICE INPUT ICON)#################################*/
export function getChoiceInputIcon(
  icon: ChoiceInputProps["icon"],
  isChosen?: boolean
) {
  switch (icon) {
    case "brand":
      return <Icon size="8xs" />;
    case "tick":
      return <CheckIcon size="8xs" />;
    case "ball":
      return (
        <RoundIcon
          size="8xs"
          style={{
            web: {
              fill: isChosen ? "white" : "currentColor",
            },
          }}
        />
      );
    case "cross":
      return <PlusPrimeIcon size="8xs" />;
    case "dash":
      return (
        <ArrowsHorizontalLineIcon
          size="8xs"
          style={{
            web: {
              maxWidth: "10px",
            },
          }}
        />
      );
    default:
      return <Icon size="8xs" />;
  }
}
