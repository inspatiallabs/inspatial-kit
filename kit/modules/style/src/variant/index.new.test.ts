import { test, expect } from "@in/test";
import { 
  createStyle, 
  iss, 
  style, 
  composeStyle, 
  type StyleProps 
} from "./index.ts";

/**
 * Test suite for the streamlined InSpatial Style System API
 */

/*##############################################(API-CONSISTENCY)##############################################*/

test({
  name: "createStyle() with options returns a consistent API shape",
  fn: () => {
    // When creating a style system with options
    const system = createStyle({
      hooks: {
        onComplete: (className) => className
      }
    });
    
    // Then it should have a consistent API shape
    expect(typeof system.getStyle).toBe("function");
    expect(typeof system.style).toBe("function");
    expect(typeof system.composeStyle).toBe("function");
    expect(typeof system.iss).toBe("function");
  }
});

test({
  name: "createStyle() with direct config returns a consistent API shape",
  fn: () => {
    // When creating a style with direct config
    const buttonStyle = createStyle({
      base: "rounded",
      settings: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-200"
        }
      }
    });
    
    // Then it should have a consistent API shape
    expect(typeof buttonStyle.getStyle).toBe("function");
    expect(typeof buttonStyle.style).toBe("function");
    expect(typeof buttonStyle.composeStyle).toBe("function");
    expect(typeof buttonStyle.iss).toBe("function");
    
    // And should have the config
    expect(buttonStyle.config).toBeDefined();
    expect(buttonStyle.config?.base).toBe("rounded");
  }
});

/*##############################################(API-FUNCTIONALITY)##############################################*/

test({
  name: "getStyle() handles all style features",
  fn: () => {
    // Given a complex style
    const buttonStyle = createStyle({
      base: "rounded",
      settings: {
        size: {
          sm: "text-sm py-1 px-2",
          md: "text-base py-2 px-4",
          lg: "text-lg py-3 px-6"
        },
        intent: {
          primary: "bg-blue-500 text-white",
          secondary: "bg-gray-200 text-gray-800"
        },
        disabled: {
          true: "opacity-50 cursor-not-allowed",
          false: "cursor-pointer"
        }
      },
      defaultSettings: {
        size: "md",
        intent: "primary",
        disabled: false
      },
      composition: [
        {
          intent: "primary",
          size: "sm",
          class: "font-bold"
        }
      ]
    });
    
    // When applying with different props
    const defaultButton = buttonStyle.getStyle();
    const primarySmall = buttonStyle.getStyle({ intent: "primary", size: "sm" });
    const secondaryDisabled = buttonStyle.getStyle({
      intent: "secondary", 
      disabled: true,
      className: "custom-class"
    });
    
    // Then it should correctly apply all style features
    
    // Default settings
    expect(defaultButton).toContain("rounded");
    expect(defaultButton).toContain("bg-blue-500");
    expect(defaultButton).toContain("text-base");
    expect(defaultButton).toContain("cursor-pointer");
    
    // Explicit settings with compound style
    expect(primarySmall).toContain("text-sm");
    expect(primarySmall).toContain("bg-blue-500");
    expect(primarySmall).toContain("font-bold"); // From composition
    
    // Mixed settings with className
    expect(secondaryDisabled).toContain("bg-gray-200");
    expect(secondaryDisabled).toContain("opacity-50");
    expect(secondaryDisabled).toContain("custom-class");
  }
});

/*##############################################(TYPE-EXTRACTION)##############################################*/

test({
  name: "StyleProps works with getStyle",
  fn: () => {
    // Given a button style
    const buttonStyle = createStyle({
      settings: {
        size: {
          sm: "text-sm",
          lg: "text-lg"
        },
        intent: {
          primary: "bg-blue-500",
          danger: "bg-red-500"
        }
      }
    });
    
    // TypeScript type extraction (compile-time check)
    // type ButtonProps = StyleProps<typeof buttonStyle.getStyle>;
    
    // Runtime verification with record
    const props: Record<string, unknown> = {
      size: "sm",
      intent: "primary"
    };
    
    // Method should work with the props
    const result = buttonStyle.getStyle(props as any);
    
    expect(result).toContain("text-sm");
    expect(result).toContain("bg-blue-500");
  }
});

test({
  name: "StyleProps works with direct style functions",
  fn: () => {
    // Given a direct style function
    const button = style({
      settings: {
        size: {
          sm: "text-sm",
          lg: "text-lg"
        }
      }
    });
    
    // TypeScript type extraction (compile-time check)
    // type ButtonProps = StyleProps<typeof button>;
    
    // Runtime verification
    const props = { size: "lg" as const };
    const result = button(props);
    
    expect(result).toContain("text-lg");
  }
});

/*##############################################(FACTORY-PATTERN)##############################################*/

test({
  name: "createStyle() can be used as a factory for creating consistent styles",
  fn: () => {
    // Given a custom style system
    const mySystem = createStyle({
      hooks: {
        onComplete: (className) => `prefix-${className}`
      }
    });
    
    // When creating styles with it
    const button = mySystem.style({
      base: "rounded",
      settings: {
        color: {
          blue: "bg-blue-500",
          red: "bg-red-500"
        }
      }
    });
    
    // Then the styles should work with the hooks applied
    const blueButton = button({ color: "blue" });
    expect(blueButton).toBe("rounded prefix-bg-blue-500");
  }
});

/*##############################################(GLOBAL-EXPORTS)##############################################*/

test({
  name: "Global exports (iss, style, composeStyle) work as expected",
  fn: () => {
    // Given direct usage of iss
    const issResult = iss("text-red-500", "bg-blue-200");
    
    // Then it should work as expected
    expect(issResult).toContain("text-red-500");
    expect(issResult).toContain("bg-blue-200");
    
    // Given direct usage of style
    const button = style({
      base: "rounded",
      settings: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-gray-200"
        }
      }
    });
    
    // Then it should work as expected
    const primaryButton = button({ intent: "primary" });
    expect(primaryButton).toContain("rounded");
    expect(primaryButton).toContain("bg-blue-500");
    
    // Given direct usage of composeStyle
    const sizeStyle = style({
      settings: {
        size: {
          sm: "text-sm",
          lg: "text-lg"
        }
      }
    });
    
    const colorStyle = style({
      settings: {
        color: {
          blue: "bg-blue-500",
          red: "bg-red-500"
        }
      }
    });
    
    const composed = composeStyle(sizeStyle, colorStyle);
    
    // Then it should work as expected
    const result = composed({ size: "lg" as const, color: "red" as const });
    expect(result).toContain("text-lg");
    expect(result).toContain("bg-red-500");
  }
}); 