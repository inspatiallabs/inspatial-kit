import type { ItemInstance, TreeInstance } from "./src/index.ts";

/*##############################(TREE CONTEXT VALUE TYPE)##############################*/
export interface TreeContextValue<T = unknown> {
  indent: number;
  currentItem?: ItemInstance<T>;
  tree?: TreeInstance<T>;
}

/*##############################(TREE ITEM PROPS TYPE)##############################*/
export type TreeItemProps<T = unknown> = JSX.SharedProps & {
  item: ItemInstance<T>;
  indent?: number;
  asChild?: boolean;
};

/*##############################(TREE ITEM LABEL PROPS TYPE)##############################*/
export type TreeItemLabelProps<T = unknown> = JSX.SharedProps & {
  item?: ItemInstance<T>;
};

/*##############################(TREE PROPS TYPE)##############################*/
export type TreeProps<T = unknown> = JSX.SharedProps & {
  indent?: number;
  tree?: TreeInstance<T>;
};
