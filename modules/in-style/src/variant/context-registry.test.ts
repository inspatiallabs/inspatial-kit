import { test, expect } from "@in/test";
import { createStyle, styleContextRegistry } from "./index.ts";

/**
 * Test suite for the Implicit Context Registry
 * Tests that cross-style composition works without explicit composeStyle
 */

test({
  name: "Context Registry: Cross-references work without composeStyle",
  fn: () => {
    // Given styles with cross-references
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

    // When evaluating styles separately (simulating component usage)
    // First, trigger evaluates
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
  name: "Context Registry: Works with multiple cross-references",
  fn: () => {
    // Given a complex style system
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

    // When evaluating in order
    Child1Style.getStyle({ size: "lg" });
    Child2Style.getStyle({ color: "red" });
    const containerClass = ContainerStyle.getStyle();

    // Then container should have the composition class
    expect(containerClass).toContain("container-special");
  },
});

test({
  name: "Context Registry: Cleans up after evaluation",
  fn: () => {
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

    // When evaluating
    const result1 = TestStyle.getStyle();
    
    // The composition shouldn't match (no "other" style registered)
    expect(result1).toContain("test-base");
    expect(result1).not.toContain("test-composed");

    // And context should be clean for next evaluation
    const result2 = TestStyle.getStyle();
    expect(result2).toContain("test-base");
    expect(result2).not.toContain("test-composed");
  },
});

test({
  name: "Context Registry: Works with nested composition",
  fn: () => {
    // Given styles that reference each other in a chain
    const GrandparentStyle = createStyle({
      name: "grandparent",
      base: "grandparent-base",
      composition: [
        {
          "$parent.state": "active",
          class: "grandparent-active",
        },
      ],
    });

    const ParentStyle = createStyle({
      name: "parent",
      base: "parent-base",
      settings: {
        state: {
          active: "parent-active",
          inactive: "parent-inactive",
        },
      },
      composition: [
        {
          "$child.size": "lg",
          class: "parent-has-large-child",
        },
      ],
    });

    const ChildStyle = createStyle({
      name: "child",
      base: "child-base",
      settings: {
        size: {
          sm: "child-sm",
          lg: "child-lg",
        },
      },
    });

    // When evaluating in order
    ChildStyle.getStyle({ size: "lg" });
    const parentClass = ParentStyle.getStyle({ state: "active" });
    const grandparentClass = GrandparentStyle.getStyle();

    // Then all compositions should work
    expect(parentClass).toContain("parent-has-large-child");
    expect(grandparentClass).toContain("grandparent-active");
  },
});

test({
  name: "Context Registry: Re-evaluation handles cross-references correctly",
  fn: () => {
    // Given a style with cross-references
    const DynamicStyle = createStyle({
      name: "dynamic-wrapper",
      base: "dynamic-base",
      composition: [
        {
          "$dynamic-trigger.active": true,
          style: {
            web: {
              backgroundColor: "green",
            },
          },
        },
      ],
    });

    const TriggerStyle = createStyle({
      name: "dynamic-trigger",
      settings: {
        active: {
          true: "trigger-on",
          false: "trigger-off",
        },
      },
    });

    // When trigger is active
    TriggerStyle.getStyle({ active: true });
    const activeResult = DynamicStyle.getStyle();
    
    // Should include the composition style (as generated class)
    expect(activeResult).toMatch(/in-[a-z0-9]+/); // Generated class for web style

    // Clean up for next test
    styleContextRegistry.clear();

    // When trigger is inactive
    TriggerStyle.getStyle({ active: false });
    const inactiveResult = DynamicStyle.getStyle();
    
    // Should not include the composition style
    expect(inactiveResult).toBe("dynamic-base");
  },
});
