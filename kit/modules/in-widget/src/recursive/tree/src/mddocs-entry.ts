import type { MainFeatureDef } from "./features/main/type.ts";
import type { DragAndDropFeatureDef } from "./features/drag-and-drop/type.ts";
import type { AsyncDataLoaderFeatureDef } from "./features/async-data-loader/type.ts";
import type { ExpandAllFeatureDef } from "./features/expand-all/type.ts";
import type { HotkeysCoreFeatureDef } from "./features/hotkeys-core/type.ts";
import type { RenamingFeatureDef } from "./features/renaming/type.ts";
import type { SearchFeatureDef } from "./features/search/type.ts";
import type { SelectionFeatureDef } from "./features/selection/type.ts";
import type { SyncDataLoaderFeatureDef } from "./features/sync-data-loader/type.ts";
import type { TreeFeatureDef } from "./features/tree/type.ts";
import type { PropMemoizationFeatureDef } from "./features/prop-memoization/type.ts";
import type { KeyboardDragAndDropFeatureDef } from "./features/keyboard-drag-and-drop/type.ts";
import type { CheckboxesFeatureDef } from "./features/checkboxes/type.ts";

export * from "./index.ts";

//     /** @interface */
//     export type XXXFeatureConfig<T> = XFeatureDef<T>["config"];
//     /** @interface */
//     export type XXXFeatureState<T> = XFeatureDef<T>["state"];
//     /** @interface */
//     export type XXXFeatureTreeInstance<T> = XFeatureDef<T>["treeInstance"];
//     /** @interface */
//     export type XXXFeatureItemInstance<T> = XFeatureDef<T>["itemInstance"];
//     export type XXXFeatureHotkeys<T> = XFeatureDef<T>["hotkeys"];

/** @interface */
export type AsyncDataLoaderFeatureConfig<T> =
  AsyncDataLoaderFeatureDef<T>["config"];
/** @interface */
export type AsyncDataLoaderFeatureState<T> =
  AsyncDataLoaderFeatureDef<T>["state"];
/** @interface */
export type AsyncDataLoaderFeatureTreeInstance<T> =
  AsyncDataLoaderFeatureDef<T>["treeInstance"];
/** @interface */
export type AsyncDataLoaderFeatureItemInstance<T> =
  AsyncDataLoaderFeatureDef<T>["itemInstance"];
export type AsyncDataLoaderFeatureHotkeys<T> =
  AsyncDataLoaderFeatureDef<T>["hotkeys"];

/** @interface */
export type DragAndDropFeatureConfig<T> = DragAndDropFeatureDef<T>["config"];
/** @interface */
export type DragAndDropFeatureState<T> = DragAndDropFeatureDef<T>["state"];
/** @interface */
export type DragAndDropFeatureTreeInstance<T> =
  DragAndDropFeatureDef<T>["treeInstance"];
/** @interface */
export type DragAndDropFeatureItemInstance<T> =
  DragAndDropFeatureDef<T>["itemInstance"];
export type DragAndDropFeatureHotkeys<T> = DragAndDropFeatureDef<T>["hotkeys"];

/** @interface */
export type KeyboardDragAndDropFeatureConfig<T> =
  KeyboardDragAndDropFeatureDef<T>["config"];
/** @interface */
export type KeyboardDragAndDropFeatureState<T> =
  KeyboardDragAndDropFeatureDef<T>["state"];
/** @interface */
export type KeyboardDragAndDropFeatureTreeInstance<T> =
  KeyboardDragAndDropFeatureDef<T>["treeInstance"];
/** @interface */
export type KeyboardDragAndDropFeatureItemInstance<T> =
  KeyboardDragAndDropFeatureDef<T>["itemInstance"];
export type KeyboardDragAndDropFeatureHotkeys<T> =
  KeyboardDragAndDropFeatureDef<T>["hotkeys"];

/** @interface */
export type ExpandAllFeatureConfig = ExpandAllFeatureDef["config"];
/** @interface */
export type ExpandAllFeatureState = ExpandAllFeatureDef["state"];
/** @interface */
export type ExpandAllFeatureTreeInstance = ExpandAllFeatureDef["treeInstance"];
/** @interface */
export type ExpandAllFeatureItemInstance = ExpandAllFeatureDef["itemInstance"];
export type ExpandAllFeatureHotkeys = ExpandAllFeatureDef["hotkeys"];

/** @interface */
export type HotkeysCoreFeatureConfig<T> = HotkeysCoreFeatureDef<T>["config"];
/** @interface */
export type HotkeysCoreFeatureState<T> = HotkeysCoreFeatureDef<T>["state"];
/** @interface */
export type HotkeysCoreFeatureTreeInstance<T> =
  HotkeysCoreFeatureDef<T>["treeInstance"];
/** @interface */
export type HotkeysCoreFeatureItemInstance<T> =
  HotkeysCoreFeatureDef<T>["itemInstance"];
export type HotkeysCoreFeatureHotkeys<T> = HotkeysCoreFeatureDef<T>["hotkeys"];

/** @interface */
export type MainFeatureConfig = MainFeatureDef["config"];
/** @interface */
export type MainFeatureState = MainFeatureDef["state"];
/** @interface */
export type MainFeatureTreeInstance = MainFeatureDef["treeInstance"];
/** @interface */
export type MainFeatureItemInstance = MainFeatureDef["itemInstance"];
export type MainFeatureHotkeys = MainFeatureDef["hotkeys"];

/** @interface */
export type PropMemoizationConfig = PropMemoizationFeatureDef["config"];
/** @interface */
export type PropMemoizationState = PropMemoizationFeatureDef["state"];
/** @interface */
export type PropMemoizationTreeInstance =
  PropMemoizationFeatureDef["treeInstance"];
/** @interface */
export type PropMemoizationItemInstance =
  PropMemoizationFeatureDef["itemInstance"];
export type PropMemoizationHotkeys = PropMemoizationFeatureDef["hotkeys"];

/** @interface */
export type RenamingFeatureConfig<T> = RenamingFeatureDef<T>["config"];
/** @interface */
export type RenamingFeatureState<T> = RenamingFeatureDef<T>["state"];
/** @interface */
export type RenamingFeatureTreeInstance<T> =
  RenamingFeatureDef<T>["treeInstance"];
/** @interface */
export type RenamingFeatureItemInstance<T> =
  RenamingFeatureDef<T>["itemInstance"];
export type RenamingFeatureHotkeys<T> = RenamingFeatureDef<T>["hotkeys"];

/** @interface */
export type SearchFeatureConfig<T> = SearchFeatureDef<T>["config"];
/** @interface */
export type SearchFeatureState<T> = SearchFeatureDef<T>["state"];
/** @interface */
export type SearchFeatureTreeInstance<T> = SearchFeatureDef<T>["treeInstance"];
/** @interface */
export type SearchFeatureItemInstance<T> = SearchFeatureDef<T>["itemInstance"];
export type SearchFeatureHotkeys<T> = SearchFeatureDef<T>["hotkeys"];

/** @interface */
export type SelectionFeatureConfig<T> = SelectionFeatureDef<T>["config"];
/** @interface */
export type SelectionFeatureState<T> = SelectionFeatureDef<T>["state"];
/** @interface */
export type SelectionFeatureTreeInstance<T> =
  SelectionFeatureDef<T>["treeInstance"];
/** @interface */
export type SelectionFeatureItemInstance<T> =
  SelectionFeatureDef<T>["itemInstance"];
export type SelectionFeatureHotkeys<T> = SelectionFeatureDef<T>["hotkeys"];

/** @interface */
export type SyncDataLoaderFeatureConfig<T> =
  SyncDataLoaderFeatureDef<T>["config"];
/** @interface */
export type SyncDataLoaderFeatureState<T> =
  SyncDataLoaderFeatureDef<T>["state"];
/** @interface */
export type SyncDataLoaderFeatureTreeInstance<T> =
  SyncDataLoaderFeatureDef<T>["treeInstance"];
/** @interface */
export type SyncDataLoaderFeatureItemInstance<T> =
  SyncDataLoaderFeatureDef<T>["itemInstance"];
export type SyncDataLoaderFeatureHotkeys<T> =
  SyncDataLoaderFeatureDef<T>["hotkeys"];

/** @interface */
export type TreeFeatureConfig<T> = TreeFeatureDef<T>["config"];
/** @interface */
export type TreeFeatureState<T> = TreeFeatureDef<T>["state"];
/** @interface */
export type TreeFeatureTreeInstance<T> = TreeFeatureDef<T>["treeInstance"];
/** @interface */
export type TreeFeatureItemInstance<T> = TreeFeatureDef<T>["itemInstance"];
export type TreeFeatureHotkeys<T> = TreeFeatureDef<T>["hotkeys"];

/** @interface */
export type CheckboxesFeatureConfig<T> = CheckboxesFeatureDef<T>["config"];
/** @interface */
export type CheckboxesFeatureState<T> = CheckboxesFeatureDef<T>["state"];
/** @interface */
export type CheckboxesFeatureTreeInstance<T> =
  CheckboxesFeatureDef<T>["treeInstance"];
/** @interface */
export type CheckboxesFeatureItemInstance<T> =
  CheckboxesFeatureDef<T>["itemInstance"];
export type CheckboxesFeatureHotkeys<T> = CheckboxesFeatureDef<T>["hotkeys"];
