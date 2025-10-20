import { iss } from "@in/style";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import * as Icons from "@in/widget/icon/index.ts";
import type { IconProps } from "./type.ts";
import { pascalize } from "@in/vader";
import { BrandIcon } from "./brand-icon.tsx";

//##############################################(UTILS)##############################################//
function toPascalCase(input: string): string {
  const cleaned = String(input).replace(/icon$/i, "").trim();
  const pas = pascalize(cleaned);
  return pas ? `${pas}Icon` : "Icon";
}

function isIconExport(
  entry: [string, any]
): entry is [string, (p: any) => any] {
  const [name, value] = entry;
  // Exclude Icon itself to avoid recursive instantiation in cases
  if (name === "Icon") return false;
  return /Icon$/.test(name) && typeof value === "function";
}

function buildCases(normalized: string, passProps: any) {
  const normLower = normalized.toLowerCase();
  return Object.entries(Icons)
    .filter(isIconExport)
    .map(([name, Comp]) => ({
      when: name.toLowerCase() === normLower,
      children: <Comp {...passProps} />,
    }));
}

//##############################################(COMPONENT)##############################################//
export function Icon(props: IconProps) {
  const { variant, className, class: cls, ...rest } = props;

  const normalized =
    typeof variant === "string" ? toPascalCase(variant) : "Icon";
  const passProps = { className, class: cls, ...rest };

  const cases = buildCases(normalized, passProps);

  return (
    <Choose
      cases={[
        ...cases,
        {
          when: true,
          children: <BrandIcon {...passProps} />,
        },
      ]}
      className={iss({ className, class: cls })}
    />
  );
}

//##############################################(LIST UTILITY)##############################################//
export function listIconVariants(): string[] {
  return Object.keys(Icons).filter((k) => /Icon$/.test(k) && k !== "Icon");
}
