import type { ChoiceInputProps } from "@in/widget/input/choice-input/type.ts";
import type { ItemInstance, TreeInstance } from "./src/index.ts";
import type { StyleProps } from "@in/style/index.ts";
import type { TreeStyle } from "./style.ts";
import type { JSX } from "@in/runtime";

/*##############################(TREE ITEM PROPS TYPE)##############################*/

export type TreeItemProps<T = any> = JSX.SharedProps &
  StyleProps<typeof TreeStyle.item> & {
    item: ItemInstance<T>;
    indent?: number;
    asChild?: boolean;
    // icon?: ChoiceInputProps["icon"];
  };

export interface TreeAnchorProps {
  name?: string;
  children?: string[];
}

/*##############################(TREE ITEM LABEL PROPS TYPE)##############################*/
export type TreeItemLabelProps<T = unknown> = JSX.SharedProps & {
  item?: ItemInstance<T>;
};

/*##############################(TREE PROPS TYPE)##############################*/
export type TreeProps<T = unknown> = JSX.SharedProps & {
  indent?: number;
  tree?: TreeInstance<T>;

  // children?: {
  //   item: TreeItemProps;
  // };
};
