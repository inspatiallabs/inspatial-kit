import { test, expect } from "@in/test";
import { createStyle } from "./index.ts";
import { signalStyleContextRegistry } from "./signal-context.ts";

/**
 * Test suite for automatic cross-style composition
 * Tests that styles with cross-references work without manual composeStyle
 */

test({
  name: "Auto-composition: Cross-references work without composeStyle",
  fn: () => {
    // Clear any previous state
    signalStyleContextRegistry.clear();
    
    // Given styles with cross-references
    const TriggerStyle = createStyle({
      name: "test-trigger",
      base: "trigger-base",
      settings: {
        format: {
          active: "trigger-active",
          inactive: "trigger-inactive",
        },
      },
      defaultSettings: {
        format: "inactive",
      },
    });

    const WrapperStyle = createStyle({
      name: "test-wrapper",
      base: "wrapper-base",
      composition: [
        {
          "$test-trigger.format": "active",
          class: "wrapper-when-trigger-active",
        },
      ],
    });
    
    // When evaluating styles separately (without composeStyle)
    // First, trigger evaluates and registers its context
    const triggerClass = TriggerStyle.getStyle({ format: "active" });
    
    // Then wrapper evaluates and should see trigger's context
    const wrapperClass = WrapperStyle.getStyle();

    // Then wrapper should have the composition class
    expect(wrapperClass).toContain("wrapper-base");
    expect(wrapperClass).toContain("wrapper-when-trigger-active");
    
    // And trigger should have its classes
    expect(triggerClass).toContain("trigger-base");
    expect(triggerClass).toContain("trigger-active");
  },
});

test({
  name: "Auto-composition: Tab-like cross-references",
  fn: () => {
    // Clear any previous state
    signalStyleContextRegistry.clear();
    
    // Given Tab-like styles
    const TabTriggerStyle = createStyle({
      name: "tab-trigger",
      base: "tab-trigger-base",
      settings: {
        format: {
          segmented: "format-segmented",
          underline: "format-underline",
        },
      },
      defaultSettings: {
        format: "segmented",
      },
    });

    const TabWrapperStyle = createStyle({
      name: "tab-wrapper",
      base: "tab-wrapper-base",
      composition: [
        {
          "$tab-trigger.format": "segmented",
          style: {
            web: {
              backgroundColor: "green",
            },
          },
        },
        {
          "$tab-trigger.format": "underline",
          style: {
            web: {
              backgroundColor: "transparent",
            },
          },
        },
      ],
    });
    
    // When trigger format is segmented
    TabTriggerStyle.getStyle({ format: "segmented" });
    const segmentedWrapper = TabWrapperStyle.getStyle();
    
    // Should include green background (as generated class)
    expect(segmentedWrapper).toContain("tab-wrapper-base");
    expect(segmentedWrapper).toMatch(/in-[a-z0-9]+/); // Generated class for web style
    
    // Clear for next test
    signalStyleContextRegistry.clear();
    
    // When trigger format is underline
    TabTriggerStyle.getStyle({ format: "underline" });
    const underlineWrapper = TabWrapperStyle.getStyle();
    
    // Should include transparent background (as generated class)
    expect(underlineWrapper).toContain("tab-wrapper-base");
    expect(underlineWrapper).toMatch(/in-[a-z0-9]+/); // Different generated class
  },
});

test({
  name: "Auto-composition: Dependency tracking",
  fn: () => {
    // Clear any previous state
    signalStyleContextRegistry.clear();
    
    // Given styles with cross-references
    const StyleA = createStyle({
      name: "style-a",
      base: "a-base",
      settings: {
        mode: {
          light: "a-light",
          dark: "a-dark",
        },
      },
    });

    const StyleB = createStyle({
      name: "style-b",
      base: "b-base",
      composition: [
        {
          "$style-a.mode": "dark",
          class: "b-when-a-dark",
        },
      ],
    });
    
    // Check that dependencies are tracked
    expect(signalStyleContextRegistry.hasCrossReferences("style-b")).toBe(true);
    expect(signalStyleContextRegistry.getDependencies("style-b").has("style-a")).toBe(true);
  },
});

test({
  name: "Auto-composition: Multiple cross-references",
  fn: () => {
    // Clear any previous state
    signalStyleContextRegistry.clear();
    
    // Given multiple styles with cross-references
    const Child1Style = createStyle({
      name: "child1",
      settings: {
        size: {
          sm: "child1-sm",
          lg: "child1-lg",
        },
      },
    });

    const Child2Style = createStyle({
      name: "child2",
      settings: {
        color: {
          blue: "child2-blue",
          red: "child2-red",
        },
      },
    });

    const ContainerStyle = createStyle({
      name: "container",
      base: "container-base",
      composition: [
        {
          "$child1.size": "lg",
          "$child2.color": "red",
          class: "container-special",
        },
      ],
    });
    
    // When evaluating in order
    Child1Style.getStyle({ size: "lg" });
    Child2Style.getStyle({ color: "red" });
    const containerClass = ContainerStyle.getStyle();

    // Then container should have the composition class
    expect(containerClass).toContain("container-base");
    expect(containerClass).toContain("container-special");
  },
});

test({
  name: "Auto-composition: Context cleanup after evaluation",
  fn: async () => {
    // Clear any previous state
    signalStyleContextRegistry.clear();
    
    // Given a style with cross-references
    const TestStyle = createStyle({
      name: "cleanup-test",
      base: "test-base",
      composition: [
        {
          "$other.prop": "value",
          class: "test-composed",
        },
      ],
    });

    // When evaluating without the referenced style
    const result1 = TestStyle.getStyle();
    
    // The composition shouldn't match (no "other" style registered)
    expect(result1).toContain("test-base");
    expect(result1).not.toContain("test-composed");
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Context should be clean for next evaluation
    expect(signalStyleContextRegistry.isActive()).toBe(false);
    expect(signalStyleContextRegistry.getAllContexts().size).toBe(0);
  },
});
