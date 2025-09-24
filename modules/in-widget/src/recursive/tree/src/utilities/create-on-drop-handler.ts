import type { ItemInstance } from "../types/core.ts";
import type { DragTarget } from "../features/drag-and-drop/type.ts";
import { removeItemsFromParents } from "./remove-items-from-parents.ts";
import { insertItemsAtTarget } from "./insert-items-at-target.ts";

export const createOnDropHandler =
  <T>(
    onChangeChildren: (item: ItemInstance<T>, newChildren: string[]) => void
  ) =>
  async (items: ItemInstance<T>[], target: DragTarget<T>) => {
    const itemIds = items.map((item) => item.getId());
    await removeItemsFromParents(items, onChangeChildren);
    await insertItemsAtTarget(itemIds, target, onChangeChildren);
  };
