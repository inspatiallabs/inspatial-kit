import {
  createTreeCore,
  type TreeConfig,
  type TreeState,
} from "./src/index.ts";
import { createSignal, $, nextTick } from "@in/teract/signal";

/*##############################(CREATE TREE)##############################*/
export const createTree = <T>(config: TreeConfig<T>) => {
  const tree = createSignal(createTreeCore(config));
  const state = createSignal<Partial<TreeState<T>>>(tree.peek().getState());

  tree.peek().setConfig((prev: TreeConfig<T>) => ({
    ...prev,
    ...config,
    state: {
      ...state.peek(),
      ...config.state,
    },
    setState: (updater: any) => {
      const nextState =
        typeof updater === "function" ? updater(state.peek()) : updater;
      state.set(nextState);
      config.setState?.(nextState);

      // Trigger rebuild for certain state changes
      if (
        nextState.renamingItem !== state.peek().renamingItem ||
        nextState.search !== state.peek().search ||
        JSON.stringify(nextState.expandedItems) !==
          JSON.stringify(state.peek().expandedItems)
      ) {
        nextTick(() => tree.peek().rebuildTree());
      }
    },
  }));

  // Ensure items are built before first render, and once more on next tick to
  // align with DOM-trigger lifecycle in InSpatial
  tree.peek().rebuildTree();
  nextTick(() => tree.peek().rebuildTree());

  // Create a version counter that increments when tree rebuilds
  const treeVersion = createSignal(0);

  // Override rebuildTree to increment version
  const originalRebuildTree = tree.peek().rebuildTree;
  tree.peek().rebuildTree = () => {
    originalRebuildTree();
    treeVersion.set(treeVersion.peek() + 1);
  };

  // Expose reactive items list that tracks tree version changes
  const items = $(() => {
    // Track the version signal - will re-run when tree rebuilds
    const version = treeVersion.get();

    const treeItems = tree.peek().getItems();
    return treeItems;
  });
  (tree.peek() as any).items = items;

  return tree.peek();
};
