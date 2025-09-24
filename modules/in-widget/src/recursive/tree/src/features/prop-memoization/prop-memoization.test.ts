import { describe, expect, it, mockFn } from "vitest";
import { TestTree } from "../../test-utils/test-tree.ts";
import { propMemoizationFeature } from "./feature.ts";
import { FeatureImplementation } from "../../types/core.ts";

const itemHandler = mockFn();
const treeHandler = mockFn();
const createItemValue = mockFn();
const createTreeValue = mockFn();

const customFeature: FeatureImplementation = {
  itemInstance: {
    getProps: ({ prev }) => ({
      ...prev?.(),
      customValue: createItemValue(),
      onCustomEvent: () => itemHandler(),
    }),
  },
  treeInstance: {
    getContainerProps: ({ prev }, treeLabel) => ({
      ...prev?.(treeLabel),
      customValue: createTreeValue(),
      onCustomEvent: () => treeHandler(),
    }),
  },
};

const factory = TestTree.default({}).withFeatures(
  customFeature,
  propMemoizationFeature
);

describe("core-feature/prop-memoization", () => {
  it("memoizes props", async () => {
    const tree = await factory.suits.sync().tree.createTestCaseTree();
    createTreeValue.mockReturnValue(123);
    expect(tree.instance.getContainerProps().onCustomEvent).toBe(
      tree.instance.getContainerProps().onCustomEvent
    );
    expect(tree.instance.getContainerProps().customValue).toBe(123);
    expect(tree.instance.getContainerProps().customValue).toBe(123);
  });
  factory.forSuits((tree) => {
    describe("tree props", () => {
      it("memoizes props", async () => {
        createTreeValue.mockReturnValue(123);
        expect(tree.instance.getContainerProps().onCustomEvent).toBe(
          tree.instance.getContainerProps().onCustomEvent
        );
        expect(tree.instance.getContainerProps().customValue).toBe(123);
        expect(tree.instance.getContainerProps().customValue).toBe(123);
      });

      it("doesnt return stale values", async () => {
        createTreeValue.mockReturnValueOnce(123);
        createTreeValue.mockReturnValueOnce(456);
        expect(tree.instance.getContainerProps().customValue).toBe(123);
        expect(tree.instance.getContainerProps().customValue).toBe(456);
      });

      it("propagates calls properly", async () => {
        tree.instance.getContainerProps().onCustomEvent();
        tree.instance.getContainerProps().onCustomEvent();
        expect(treeHandler).toHaveBeenCalledTimes(2);
      });
    });
  });
});
