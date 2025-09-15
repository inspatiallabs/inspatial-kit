export type TreeDataLoader<T> =
  | {
      getItem: (itemId: string) => T | Promise<T>;
      getChildren: (itemId: string) => string[] | Promise<string[]>;
    }
  | {
      getItem: (itemId: string) => T | Promise<T>;
      getChildrenWithData: (
        itemId: string,
      ) => { id: string; data: T }[] | Promise<{ id: string; data: T }[]>;
    };

export type SyncDataLoaderFeatureDef<T> = {
  state: {};
  config: {
    rootItemId: string;
    dataLoader: TreeDataLoader<T>;
  };
  treeInstance: {
    retrieveItemData: (itemId: string) => T;

    /** Retrieve children Ids. If an async data loader is used, skipFetch is set to true, and children have not been retrieved
     * yet for this item, this will initiate fetching the children, and return an empty array. Once the children have loaded,
     * a rerender will be triggered.
     * @param skipFetch - Defaults to false.
     */
    retrieveChildrenIds: (itemId: string, skipFetch?: boolean) => string[];
  };
  itemInstance: {
    isLoading: () => boolean;
  };
  hotkeys: never;
};
