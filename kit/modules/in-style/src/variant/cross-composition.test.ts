import { test, expect } from "@in/test";
import { createStyle, composeStyle } from "./index.ts";

/**
 * Test suite for cross-style composition feature
 * Tests the ability for one style's composition to reference another style's settings
 */

/*##############################################(CROSS-STYLE-COMPOSITION)##############################################*/

test({
  name: "Cross-style composition: handle reacts to track size",
  fn: () => {
    // Given a track style with size settings
    const trackStyle = createStyle({
      base: "track-base",
      settings: {
        size: {
          sm: "track-sm",
          lg: "track-lg",
        },
      },
      defaultSettings: {
        size: "lg",
      },
    });

    // And a handle style that references track's size
    const handleStyle = createStyle({
      base: "handle-base",
      composition: [
        {
          "$track.size": "sm",
          class: "handle-adjusted-for-sm",
        },
        {
          "$track.size": "lg",
          class: "handle-adjusted-for-lg",
        },
      ],
    });

    // Tag them with names for cross-reference
    (trackStyle.getStyle as any).__styleName = "track";
    (handleStyle.getStyle as any).__styleName = "handle";

    // When composing them together
    const composed = composeStyle(trackStyle.getStyle, handleStyle.getStyle);

    // Test with size="sm"
    const smallResult = composed({ size: "sm" });
    expect(smallResult).toContain("track-sm");
    expect(smallResult).toContain("handle-base");
    expect(smallResult).toContain("handle-adjusted-for-sm");
    expect(smallResult).not.toContain("handle-adjusted-for-lg");

    // Test with size="lg"
    const largeResult = composed({ size: "lg" });
    expect(largeResult).toContain("track-lg");
    expect(largeResult).toContain("handle-base");
    expect(largeResult).toContain("handle-adjusted-for-lg");
    expect(largeResult).not.toContain("handle-adjusted-for-sm");
  },
});

test({
  name: "Cross-style composition: multiple cross-references",
  fn: () => {
    // Given three independent styles
    const themeStyle = createStyle({
      settings: {
        mode: {
          light: "theme-light",
          dark: "theme-dark",
        },
      },
    });

    const sizeStyle = createStyle({
      settings: {
        density: {
          compact: "size-compact",
          normal: "size-normal",
          relaxed: "size-relaxed",
        },
      },
    });

    const buttonStyle = createStyle({
      base: "button-base",
      composition: [
        {
          // Reference both theme and size
          "$theme.mode": "dark",
          "$size.density": "compact",
          class: "button-dark-compact",
        },
        {
          "$theme.mode": "light",
          "$size.density": "relaxed",
          class: "button-light-relaxed",
        },
      ],
    });

    // Tag them with names
    (themeStyle.getStyle as any).__styleName = "theme";
    (sizeStyle.getStyle as any).__styleName = "size";
    (buttonStyle.getStyle as any).__styleName = "button";

    // When composing all three
    const composed = composeStyle(
      themeStyle.getStyle,
      sizeStyle.getStyle,
      buttonStyle.getStyle
    );

    // Test dark + compact combination
    const darkCompact = composed({ mode: "dark", density: "compact" });
    expect(darkCompact).toContain("theme-dark");
    expect(darkCompact).toContain("size-compact");
    expect(darkCompact).toContain("button-dark-compact");
    expect(darkCompact).not.toContain("button-light-relaxed");

    // Test light + relaxed combination
    const lightRelaxed = composed({ mode: "light", density: "relaxed" });
    expect(lightRelaxed).toContain("theme-light");
    expect(lightRelaxed).toContain("size-relaxed");
    expect(lightRelaxed).toContain("button-light-relaxed");
    expect(lightRelaxed).not.toContain("button-dark-compact");
  },
});

test({
  name: "Cross-style composition: works with style objects",
  fn: () => {
    // Given styles with web platform styles
    const containerStyle = createStyle({
      settings: {
        layout: {
          flex: { web: { display: "flex" } },
          grid: { web: { display: "grid" } },
        },
      },
    });

    const childStyle = createStyle({
      base: "child-base",
      composition: [
        {
          "$container.layout": "flex",
          style: {
            web: {
              alignSelf: "center",
              marginLeft: "auto",
            },
          },
        },
        {
          "$container.layout": "grid",
          style: {
            web: {
              gridColumn: "span 2",
              justifySelf: "center",
            },
          },
        },
      ],
    });

    // Tag them
    (containerStyle.getStyle as any).__styleName = "container";
    (childStyle.getStyle as any).__styleName = "child";

    // When composing
    const composed = composeStyle(
      containerStyle.getStyle,
      childStyle.getStyle
    );

    // Test with flex layout
    const flexResult = composed({ layout: "flex" });
    expect(flexResult).toContain("child-base");
    // The style object should be converted to a class
    expect(flexResult).toMatch(/in-[a-z0-9]+/); // Generated class name

    // Test with grid layout
    const gridResult = composed({ layout: "grid" });
    expect(gridResult).toContain("child-base");
    expect(gridResult).toMatch(/in-[a-z0-9]+/); // Different generated class
  },
});

test({
  name: "Cross-style composition: respects defaults",
  fn: () => {
    // Given styles with defaults
    const parentStyle = createStyle({
      settings: {
        size: {
          sm: "parent-sm",
          lg: "parent-lg",
        },
      },
      defaultSettings: {
        size: "sm", // Default to small
      },
    });

    const childStyle = createStyle({
      base: "child-base",
      composition: [
        {
          "$parent.size": "sm",
          class: "child-when-parent-sm",
        },
      ],
    });

    // Tag them
    (parentStyle.getStyle as any).__styleName = "parent";
    (childStyle.getStyle as any).__styleName = "child";

    // When composing without explicit props
    const composed = composeStyle(parentStyle.getStyle, childStyle.getStyle);
    const defaultResult = composed({}); // No props, should use defaults

    // Then it should use parent's default and trigger composition
    expect(defaultResult).toContain("parent-sm"); // Default size
    expect(defaultResult).toContain("child-when-parent-sm"); // Composition triggered
  },
});

test({
  name: "Cross-style composition: regular composition still works",
  fn: () => {
    // Given a style with both regular and cross-composition
    const mixedStyle = createStyle({
      base: "mixed-base",
      settings: {
        variant: {
          primary: "variant-primary",
          secondary: "variant-secondary",
        },
      },
      composition: [
        {
          // Regular composition
          variant: "primary",
          class: "regular-composition-primary",
        },
        {
          // Cross-style composition
          "$other.size": "lg",
          class: "cross-composition-lg",
        },
      ],
    });

    const otherStyle = createStyle({
      settings: {
        size: {
          sm: "other-sm",
          lg: "other-lg",
        },
      },
    });

    // Tag them
    (mixedStyle.getStyle as any).__styleName = "mixed";
    (otherStyle.getStyle as any).__styleName = "other";

    // When composing
    const composed = composeStyle(mixedStyle.getStyle, otherStyle.getStyle);

    // Test that both types of composition work
    const result = composed({ variant: "primary", size: "lg" });
    expect(result).toContain("variant-primary");
    expect(result).toContain("regular-composition-primary"); // Regular composition
    expect(result).toContain("cross-composition-lg"); // Cross composition
  },
});

test({
  name: "Cross-style composition: non-existent reference is ignored",
  fn: () => {
    // Given a style that references a non-existent style
    const orphanStyle = createStyle({
      base: "orphan-base",
      composition: [
        {
          "$nonexistent.prop": "value",
          class: "should-not-appear",
        },
      ],
    });

    (orphanStyle.getStyle as any).__styleName = "orphan";

    // When using it alone
    const result = orphanStyle.getStyle({});

    // Then the cross-composition should be ignored
    expect(result).toContain("orphan-base");
    expect(result).not.toContain("should-not-appear");

    // And when composed with another style that doesn't match
    const otherStyle = createStyle({
      settings: {
        foo: {
          bar: "other-bar",
        },
      },
    });
    (otherStyle.getStyle as any).__styleName = "other";

    const composed = composeStyle(orphanStyle.getStyle, otherStyle.getStyle);
    const composedResult = composed({ foo: "bar" });

    // Still shouldn't trigger the composition
    expect(composedResult).toContain("orphan-base");
    expect(composedResult).not.toContain("should-not-appear");
  },
});
