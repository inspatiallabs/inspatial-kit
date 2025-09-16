import type { ChoiceInputProps } from "@in/widget/input/choice-input/type.ts";
import type { ItemInstance, TreeInstance } from "./src/index.ts";

/*##############################(TREE ITEM PROPS TYPE)##############################*/

export type TreeItemProps<T = any> = JSX.SharedProps & {
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
