import { test, expect } from "@in/test";
import { createStyle } from "./index.ts";
import { globalStyleRegistry } from "./global-registry.ts";

/**
 * Test suite for fully automatic cross-style composition
 * Tests that styles with cross-references work without ANY manual intervention
 */

test({
  name: "Automatic composition: No manual pre-evaluation needed",
  fn: () => {
    // Clear any previous state
    globalStyleRegistry.clear();
    
    // Given Tab-like styles with names
    const TabTriggerStyle = createStyle({
      name: "tab-trigger-auto",
      base: "trigger-base",
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
      name: "tab-wrapper-auto",
      base: "wrapper-base",
      composition: [
        {
          "$tab-trigger-auto.format": "segmented",
          class: "wrapper-segmented",
        },
        {
          "$tab-trigger-auto.format": "underline",
          class: "wrapper-underline",
        },
      ],
    });
    
    // When wrapper is evaluated WITH trigger props (no pre-evaluation!)
    const wrapperClass = TabWrapperStyle.getStyle({ 
      format: "segmented" // Pass trigger props directly
    });
    
    // Then it should have the correct composition
    expect(wrapperClass).toContain("wrapper-base");
    expect(wrapperClass).toContain("wrapper-segmented");
    
    // Test with different format
    const underlineWrapper = TabWrapperStyle.getStyle({ 
      format: "underline" 
    });
    
    expect(underlineWrapper).toContain("wrapper-base");
    expect(underlineWrapper).toContain("wrapper-underline");
  },
});

test({
  name: "Automatic composition: Complex multi-level dependencies",
  fn: () => {
    // Clear any previous state
    globalStyleRegistry.clear();
    
    // Given a chain of dependencies
    const StyleA = createStyle({
      name: "style-a",
      settings: {
        theme: {
          light: "theme-light",
          dark: "theme-dark",
        },
      },
    });

    const StyleB = createStyle({
      name: "style-b",
      settings: {
        size: {
          sm: "size-sm",
          lg: "size-lg",
        },
      },
      composition: [
        {
          "$style-a.theme": "dark",
          class: "b-dark-mode",
        },
      ],
    });

    const StyleC = createStyle({
      name: "style-c",
      base: "c-base",
      composition: [
        {
          "$style-a.theme": "dark",
          "$style-b.size": "lg",
          class: "c-dark-large",
        },
      ],
    });
    
    // When StyleC is evaluated with all necessary props
    const result = StyleC.getStyle({
      theme: "dark",
      size: "lg",
    });
    
    // Then it should have composed all dependencies automatically
    expect(result).toContain("c-base");
    expect(result).toContain("c-dark-large");
  },
});

test({
  name: "Automatic composition: Tab component scenario",
  fn: () => {
    // Clear any previous state
    globalStyleRegistry.clear();
    
    // Simulate actual Tab styles
    const TabTrigger = createStyle({
      name: "tab-trigger",
      base: "tab-trigger-base",
      settings: {
        format: {
          segmented: "bg-white rounded-lg",
          underline: "bg-transparent border-b",
        },
        size: {
          sm: "text-sm px-2",
          md: "text-base px-4",
          lg: "text-lg px-6",
        },
      },
      defaultSettings: {
        format: "segmented",
        size: "md",
      },
    });

    const TabWrapper = createStyle({
      name: "tab-wrapper",
      base: "flex items-center",
      settings: {
        radius: {
          none: "rounded-none",
          sm: "rounded-sm",
          md: "rounded-md",
          lg: "rounded-lg",
        },
      },
      composition: [
        {
          "$tab-trigger.format": "segmented",
          style: {
            web: {
              backgroundColor: "var(--background)",
              padding: "4px",
            },
          },
        },
        {
          "$tab-trigger.format": "underline",
          style: {
            web: {
              backgroundColor: "transparent",
              borderBottom: "1px solid var(--border)",
            },
          },
        },
      ],
    });
    
    // In the Tab component, we just call getStyle directly
    // No manual pre-evaluation needed!
    const wrapperClass = TabWrapper.getStyle({
      radius: "md",
      format: "segmented", // Pass trigger format directly
      size: "md", // Pass trigger size directly
    });
    
    // Verify composition worked
    expect(wrapperClass).toContain("flex items-center");
    expect(wrapperClass).toContain("rounded-md");
    expect(wrapperClass).toMatch(/in-[a-z0-9]+/); // Generated class for web style
    
    // Test with underline format
    const underlineWrapper = TabWrapper.getStyle({
      radius: "lg",
      format: "underline",
    });
    
    expect(underlineWrapper).toContain("flex items-center");
    expect(underlineWrapper).toContain("rounded-lg");
    expect(underlineWrapper).toMatch(/in-[a-z0-9]+/); // Different generated class
  },
});

test({
  name: "Automatic composition: Registry tracks dependencies correctly",
  fn: () => {
    // Clear any previous state
    globalStyleRegistry.clear();
    
    // Create styles with dependencies
    const Base = createStyle({
      name: "base-style",
      settings: {
        mode: { light: "light", dark: "dark" },
      },
    });

    const Dependent = createStyle({
      name: "dependent-style",
      composition: [
        { "$base-style.mode": "dark", class: "dep-dark" },
      ],
    });
    
    // Check registry tracked the dependency
    const entry = globalStyleRegistry.get("dependent-style");
    expect(entry).toBeDefined();
    expect(entry?.dependencies?.has("base-style")).toBe(true);
    
    // Check we can find dependents
    const dependents = globalStyleRegistry.getDependents("base-style");
    expect(dependents.has("dependent-style")).toBe(true);
  },
});
