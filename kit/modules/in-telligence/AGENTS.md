# IMPORTANT

IMPORTANT - Before any implementation always fully explore and understand the context of the existing codebase.

IMPORTANT - Never write code immediately on every propmt always deeply understand what's currently happening first.

IMPORTANT - Spend a minimum of 1 minutes up to a max of 10 minutes to deeply reason about how a world-class engineer would approach solving the problem.

IMPORTANT - Generate ideas, critique them, refine your thinking, and then propose an excellent final plan. I'll approve or request changes before implentation.

IMPORTANT - Always understand the environment you are operating in to reduce risk of hallucination if you do not understand ask before making any implmentation.

# PATTERNS

/\*\*

- # Class Naming Pattern
- - Append "Class" to all class names
- - Use PascalCase for the base name
- Example: UserClass, AuthenticationClass, HttpClientClass
  \*/
  class UserClass {
  private name: string;

constructor(name: string) {
this.name = name;
}

getName(): string {
return this.name;
}
}

/\*\*

- # Type Naming Pattern
- - Append "Props" to all types (including interfaces, type aliases, etc.)
- - Use PascalCase for the base name
- Example: UserProps, ConfigProps, ResponseProps
  \*/
  type UserProps = {
  id: number;
  name: string;
  email: string;
  };

interface ConfigProps {
apiUrl: string;
timeout: number;
}

// ======================================================
// API DESIGN PATTERNS
// ======================================================

/\*\*

- # InSpatial Type Pattern
- 1.  Define schema with InSpatial Type for runtime validation
- - Use "In" prefix + Name + "Type" suffix
- - Always define in index.ts
-
- 2.  Extract TypeScript type for static type checking
- - Use Name + "Type" suffix
    \*/

// Step 1: Define with InSpatial Type for runtime validation
const InUserType = type({
id: "string",
name: "string",
email: "string"
});

// Step 2: Extract TypeScript type for static checking
type UserType = typeof InUserType.infer;

/\*\*

- # Function Naming Pattern
- - Use camelCase for function names
- - Verb + Noun structure for clarity
- - Include return type annotations
    \*/
    function getUserById(id: number): UserType {
    // Implementation...
    return { id, name: "John Doe", email: "john@example.com" };
    }

// ======================================================
// ADVANCED PATTERNS
// ======================================================

/\*\*

- # Generic Type Pattern
- - Append "Type" to generic type names
- - Use descriptive T-prefixed names for type parameters
    \*/
    type ResponseType<TData> = {
    data: TData;
    status: number;
    message: string;
    };

/\*\*

- # Union Type Pattern
- - Append "Type" to union type names
- - Use descriptive names that represent the union concepts
    \*/
    type StatusType = "pending" | "active" | "completed" | "failed";

/\*\*

- # Enum Pattern
- - Append "Enum" to enum names
- - Use PascalCase for enum values
    \*/
    enum StatusEnum {
    Pending = "PENDING",
    Active = "ACTIVE",
    Completed = "COMPLETED",
    Failed = "FAILED",
    }

// ======================================================
// VALIDATION PATTERNS
// ======================================================

/\*\*

- # Validation Pattern
- - Prefix validators with "validate"
- - Return boolean or throw specific error
    \*/
    function validateUserType(user: unknown): user is UserType {
    const validator = InUserType.validate(user);
    return validator.success;
    }

/\*\*

- # Assertion Pattern
- - Prefix assertions with "assert"
- - Throw specific, descriptive errors
    \*/
    function assertUserType(user: unknown): asserts user is UserType {
    const validation = InUserType.validate(user);
    if (!validation.success) {
    throw new Error(`Invalid user: ${validation.error}`);
    }
    }

// ======================================================
// MODULE ORGANIZATION PATTERN
// ======================================================

/\*\*

- # Barrel Export Pattern
- - Use index.ts files to re-export components
- - Group related functionality
-
- Example structure:
- /users
- /models
-     - UserType.ts
-     - index.ts (exports all types)
- /services
-     - UserServiceClass.ts
-     - index.ts (exports all services)
- - index.ts (re-exports from models and services)
    \*/

// In /users/index.ts:
// export _ from './models';
// export _ from './services';

// ======================================================
// ERROR HANDLING PATTERN
// ======================================================

/\*\*

- # Error Class Pattern
- - Append "Error" to error class names
- - Extend Error class
- - Include meaningful error codes
    \*/
    class ValidationErrorClass extends Error {
    code: string;

constructor(message: string, code: string) {
super(message);
this.name = 'ValidationErrorClass';
this.code = code;
}
}

# Linting

@context {
"type": "linting_rules",
"purpose": "deno_development",
"format_version": "1.0.0",
"runtime": "deno",
"language": "typescript",
"last_updated": "2025-04-25"
}

## Import Requirements

@rules [
{
"id": "enforce_ts_extensions",
"severity": "error",
"description": "Always use .ts extensions in imports (e.g., import { foo } from './module.ts')"
},
{
"id": "no-sloppy-imports",
"severity": "error",
"description": "Enforce specifying explicit references to paths in module specifiers"
},
{
"id": "verbatim-module-syntax",
"severity": "error",
"description": "Enforce type imports to be declared as type imports"
}
]

## Type Safety

@rules [
{
"id": "eqeqeq",
"severity": "error",
"description": "Enforce type-safe equality operators === and !== instead of == and !="
},
{
"id": "explicit-function-return-type",
"severity": "error",
"description": "Require all functions to have explicit return types"
},
{
"id": "explicit-module-boundary-types",
"severity": "error",
"description": "Require all module exports to have fully typed declarations"
},
{
"id": "no-explicit-any",
"severity": "error",
"description": "Disallow use of the any type"
},
{
"id": "no-inferrable-types",
"severity": "warning",
"description": "Disallow easily inferrable types"
},
{
"id": "no-slow-types",
"severity": "error",
"description": "Enforce using types that are explicit or can be simply inferred"
},
{
"id": "no-non-null-assertion",
"severity": "error",
"description": "Disallow non-null assertions using the ! postfix operator"
},
{
"id": "no-non-null-asserted-optional-chain",
"severity": "error",
"description": "Disallow non-null assertions after an optional chain expression"
},
{
"id": "prefer-as-const",
"severity": "warning",
"description": "Recommend using const assertion (as const) over explicitly specifying literal types"
}
]

## Variable Declarations

@rules [
{
"id": "no-var",
"severity": "error",
"description": "Enforce the use of block scoped variables (const and let) over var"
},
{
"id": "prefer-const",
"severity": "warning",
"description": "Recommend declaring variables with const over let"
},
{
"id": "no-const-assign",
"severity": "error",
"description": "Disallow modifying variables declared as const"
},
{
"id": "no-array-constructor",
"severity": "warning",
"description": "Enforce conventional usage of array construction"
},
{
"id": "single-var-declarator",
"severity": "warning",
"description": "Disallow multiple variable definitions in the same declaration statement"
}
]

## Control Flow and Loop Best Practices

@rules [
{
"id": "for-direction",
"severity": "error",
"description": "Require for loop control variables to increment in the correct direction"
},
{
"id": "guard-for-in",
"severity": "warning",
"description": "Require for-in loops to include an if statement"
},
{
"id": "no-await-in-loop",
"severity": "warning",
"description": "Disallow await in a for loop body"
},
{
"id": "no-fallthrough",
"severity": "error",
"description": "Disallow the implicit fallthrough of case statements"
},
{
"id": "no-case-declarations",
"severity": "error",
"description": "Require lexical declarations in switch case to be scoped with brackets"
}
]

## Function and Class Rules

@rules [
{
"id": "getter-return",
"severity": "error",
"description": "Require all property getter functions to return a value"
},
{
"id": "no-setter-return",
"severity": "error",
"description": "Disallow returning values from setters"
},
{
"id": "no-sync-fn-in-async-fn",
"severity": "warning",
"description": "Disallow sync function inside async function"
},
{
"id": "require-await",
"severity": "warning",
"description": "Require await in async functions"
},
{
"id": "require-yield",
"severity": "error",
"description": "Require yield in generator functions"
},
{
"id": "no-async-promise-executor",
"severity": "error",
"description": "Disallow async promise executor functions"
},
{
"id": "no-misused-new",
"severity": "error",
"description": "Disallow defining constructors for interfaces or new for classes"
},
{
"id": "no-dupe-args",
"severity": "error",
"description": "Disallow using an argument name more than once in a function signature"
},
{
"id": "no-dupe-class-members",
"severity": "error",
"description": "Disallow using a class member function name more than once"
}
]

## Error Handling and Best Practices

@rules [
{
"id": "no-debugger",
"severity": "error",
"description": "Disallow the use of debugger statement"
},
{
"id": "no-eval",
"severity": "error",
"description": "Disallow the use of eval"
},
{
"id": "no-console",
"severity": "warning",
"description": "Disallow the use of console global"
},
{
"id": "no-empty",
"severity": "warning",
"description": "Disallow empty block statements"
},
{
"id": "no-empty-pattern",
"severity": "error",
"description": "Disallow empty patterns in destructuring"
},
{
"id": "no-empty-character-class",
"severity": "error",
"description": "Disallow empty character class in regular expressions"
},
{
"id": "no-empty-enum",
"severity": "error",
"description": "Disallow empty enums"
},
{
"id": "no-empty-interface",
"severity": "warning",
"description": "Disallow empty interfaces"
},
{
"id": "no-extra-boolean-cast",
"severity": "warning",
"description": "Disallow unnecessary boolean casts"
},
{
"id": "no-extra-non-null-assertion",
"severity": "error",
"description": "Disallow unnecessary non-null assertions"
},
{
"id": "no-unused-labels",
"severity": "warning",
"description": "Disallow unused labels"
},
{
"id": "no-unused-vars",
"severity": "error",
"description": "Enforce all variables are used at least once"
}
]

## Regular Expression Rules

@rules [
{
"id": "no-control-regex",
"severity": "error",
"description": "Disallow the use of ASCII control characters in regular expressions"
},
{
"id": "no-regex-spaces",
"severity": "warning",
"description": "Disallow multiple spaces in regular expression literals"
},
{
"id": "no-invalid-regexp",
"severity": "error",
"description": "Disallow invalid regular expressions in RegExp constructors"
}
]

## Comparison and Logical Operations

@rules [
{
"id": "no-compare-neg-zero",
"severity": "error",
"description": "Disallow comparing against negative zero (-0)"
},
{
"id": "no-self-compare",
"severity": "warning",
"description": "Disallow comparisons where both sides are exactly the same"
},
{
"id": "use-isnan",
"severity": "error",
"description": "Disallow comparisons to NaN (use isNaN() instead)"
},
{
"id": "no-constant-condition",
"severity": "warning",
"description": "Disallow the use of constant expressions in conditional tests"
},
{
"id": "no-dupe-else-if",
"severity": "error",
"description": "Disallow using the same condition twice in an if/else if statement"
},
{
"id": "no-unsafe-negation",
"severity": "error",
"description": "Disallow unsafe negation operations"
}
]

## Error Prevention

@rules [
{
"id": "no-cond-assign",
"severity": "error",
"description": "Disallow assignment in conditional statements"
},
{
"id": "no-ex-assign",
"severity": "error",
"description": "Disallow reassignment of exception parameters"
},
{
"id": "no-import-assign",
"severity": "error",
"description": "Disallow reassignment of imported module bindings"
},
{
"id": "no-redeclare",
"severity": "error",
"description": "Disallow redeclaration of variables, functions, parameters"
},
{
"id": "no-self-assign",
"severity": "warning",
"description": "Disallow self assignments"
},
{
"id": "no-unreachable",
"severity": "error",
"description": "Disallow unreachable code after control flow statements"
},
{
"id": "no-unsafe-finally",
"severity": "error",
"description": "Disallow control flow statements within finally blocks"
}
]

## Object and Array Handling

@rules [
{
"id": "no-dupe-keys",
"severity": "error",
"description": "Disallow duplicate keys in object literals"
},
{
"id": "no-sparse-arrays",
"severity": "warning",
"description": "Disallow sparse arrays"
},
{
"id": "no-prototype-builtins",
"severity": "warning",
"description": "Disallow the use of Object.prototype builtins directly"
},
{
"id": "no-new-symbol",
"severity": "error",
"description": "Disallow using new operators with built-in Symbols"
}
]

## Module System

@rules [
{
"id": "no-namespace",
"severity": "error",
"description": "Disallow the use of namespace and module keywords"
},
{
"id": "prefer-namespace-keyword",
"severity": "warning",
"description": "Recommend the use of namespace keyword over module keyword when necessary"
},
{
"id": "no-implicit-declare-namespace-export",
"severity": "error",
"description": "Disallow implicit exports in ambient namespaces"
},
{
"id": "triple-slash-reference",
"severity": "warning",
"description": "Disallow certain triple slash directives in favor of ES6-style import declarations"
},
{
"id": "no-import-assertions",
"severity": "error",
"description": "Disallow the assert keyword for import attributes"
}
]

## Environment Restrictions

@rules [
{
"id": "no-deprecated-deno-api",
"severity": "error",
"description": "Disallow the use of deprecated Deno APIs"
},
{
"id": "no-node-globals",
"severity": "error",
"description": "Disallow the use of NodeJS global objects"
},
{
"id": "no-process-global",
"severity": "error",
"description": "Disallow the use of NodeJS process global"
},
{
"id": "no-window",
"severity": "error",
"description": "Disallow the use of the window object"
},
{
"id": "no-window-prefix",
"severity": "error",
"description": "Disallow the use of Web APIs via the window object"
},
{
"id": "no-external-import",
"severity": "warning",
"description": "Disallow the use of external imports"
},
{
"id": "no-top-level-await",
"severity": "warning",
"description": "Disallow top level await expressions"
}
]

## Other Best Practices

@rules [
{
"id": "no-throw-literal",
"severity": "warning",
"description": "Disallow throwing literals as exceptions"
},
{
"id": "no-with",
"severity": "error",
"description": "Disallow the usage of with statements"
},
{
"id": "no-shadow-restricted-names",
"severity": "error",
"description": "Disallow shadowing of restricted names"
},
{
"id": "no-this-alias",
"severity": "warning",
"description": "Disallow assigning variables to this"
},
{
"id": "no-this-before-super",
"severity": "error",
"description": "Disallow use of this or super before calling super() in constructors"
},
{
"id": "no-delete-var",
"severity": "error",
"description": "Disallow the deletion of variables"
},
{
"id": "no-octal",
"severity": "error",
"description": "Disallow expressing octal numbers via numeric literals beginning with 0"
},
{
"id": "valid-typeof",
"severity": "error",
"description": "Restrict the use of the typeof operator to a specific set of string literals"
},
{
"id": "prefer-ascii",
"severity": "info",
"description": "Ensure that the code is fully written in ASCII characters"
},
{
"id": "prefer-primordials",
"severity": "info",
"description": "Suggest using frozen intrinsics from primordials rather than the default globals"
}
]

## Implementation Examples

@implementation {
"language": "typescript",
"dependencies": ["deno"],
"types": {
"LintRule": "Rule configuration object",
"RuleSeverity": "error | warning | info",
"ImportRule": "Rules specific to module imports"
}
}

### Complete Deno Configuration Example

```typescript
// deno.json
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/"],
    "rules": {
      "tags": ["recommended"],
      "include": ["eqeqeq", "explicit-function-return-type"],
      "exclude": ["no-unused-vars"]
    }
  },
  "imports": {
    "$std/": "https://deno.land/std@0.208.0/"
  }
}
```

### Import Example

```typescript
// ✅ Correct - with .ts extension
import { serve } from "./server.ts";
import type { ServerOptions } from "./types.ts";

// ❌ Incorrect - missing .ts extension
import { serve } from "./server";
```

### Type Safety Example

```typescript
// ✅ Correct - explicit return type
function calculateSum(a: number, b: number): number {
  return a + b;
}

// ❌ Incorrect - implicit any type
function processData(data: any) {
  return data.value;
}

// ✅ Correct - use type assertion
const config = {
  port: 8000,
  host: "localhost",
} as const;
```

## Common Patterns

@patterns {
"import_structure": {
"format": "import { ... } from './path.ts';",
"description": "Always include .ts extension"
},
"error_handling": {
"format": "try { ... } catch (error) { ... }",
"description": "Use structured error handling"
},
"type_declarations": {
"format": "type TypeName = { ... }",
"description": "Prefer type over interface when possible"
}
}

## Validation

@validation {
"required": [
"All imports must use .ts extensions",
"All functions must have explicit return types",
"No use of 'any' type",
"Type-safe equality operators only",
"No NodeJS globals or process object",
"All files must be properly typed"
],
"recommended": [
"Use const for variables that won't be reassigned",
"Handle errors properly",
"Include type annotations for all function parameters",
"Use const assertions for configuration objects",
"Prefer functional programming patterns",
"Avoid unnecessary type assertions"
]
}
