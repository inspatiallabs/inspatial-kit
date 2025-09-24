// Import types from the standalone types file
import type * as RuntimeTypes from "./types.ts";

/*################################(JSX/Runtime Global Declarations)################################*/
// This file creates global declarations by importing from the standalone types
// JSR-compatible: No direct global type modifications, just re-exports
/*########################################################################################*/

// Re-export types for explicit importing
export type { RuntimeTypes };

// Create global declarations using type aliases (JSR-compatible approach)
export {};