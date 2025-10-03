import type { BlockProps } from "./type.ts";
import { BlockI } from "./i/index.ts";
import { BlockII } from "./ii/index.ts";
import { BlockIII } from "./iii/index.ts";
import { Choose } from "@in/widget/control-flow/choose/index.ts";

/*################################(BLOCK)################################*/
export function Block(props: BlockProps) {
  /***************************(Props)***************************/

  const { format, variant, className, ...rest } = props;

  /***************************(Render)***************************/
  return (
    <Choose
      cases={[
        {
          when: format === "i",
          children: (
            <BlockI children={variant} className={className} {...rest} />
          ),
        },
        {
          when: format === "ii",
          children: (
            <BlockII children={variant} className={className} {...rest} />
          ),
        },
        {
          when: format === "iii",
          children: (
            <BlockIII children={variant} className={className} {...rest} />
          ),
        },
      ]}
    />
  );
}
