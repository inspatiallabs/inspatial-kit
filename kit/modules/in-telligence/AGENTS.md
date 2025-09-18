# IMPORTANT

IMPORTANT - Before any implementation always fully explore and understand the context of the existing codebase.

IMPORTANT - Never write code immediately on every propmt always deeply understand what's currently happening first.

IMPORTANT - Spend a minimum of 1 minutes up to a max of 3 minutes to deeply reason about how a world-class engineer would approach solving the problem.

IMPORTANT - Generate ideas, critique them, refine your thinking, and then propose an excellent final plan. I'll approve or request changes before implentation.

IMPORTANT - Always understand the environment you are operating in to reduce risk of hallucination if you do not understand ask before making any implmentation.

IMPORTANT - After every proposal or multi-agent orchestration cycle, the lead agent MUST always leave a call to action e.g "say enable X and I'll apply it" or ask a question "would you like me to do x"

# PATTERNS
Got it — I’ll clean this up so it reads as a properly structured guideline without all the `@symbols` and clutter. Here’s a clear refactored version:

---

# Code & API Design Patterns

## Class Naming Pattern

* Append `Class` to all class names.
* Use **PascalCase** for the base name.
* **Example**: `UserClass`, `AuthenticationClass`, `HttpClientClass`

```ts
class UserClass {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
```

---

## Type Naming Pattern

* Append `Props` to all types (interfaces, type aliases, etc.).
* Use **PascalCase** for the base name.
* **Example**: `UserProps`, `ConfigProps`, `ResponseProps`

```ts
type UserProps = {
  id: number;
  name: string;
  email: string;
};

interface ConfigProps {
  apiUrl: string;
  timeout: number;
}
```

---

## InSpatial Type Pattern

1. Define schema with **InSpatial Type** for runtime validation.

   * Use `In` prefix + Name + `Type` suffix.
   * Always define in `index.ts`.
2. Extract TypeScript type for static type checking.

   * Use Name + `Type` suffix.

```ts
// Step 1: Define runtime validation
const InUserType = type({
  id: "string",
  name: "string",
  email: "string",
});

// Step 2: Extract static type
type UserType = typeof InUserType.infer;
```

---

## Function Naming Pattern

* Use **camelCase** for function names.
* Prefer **Verb + Noun** structure.
* Always include explicit return type annotations.

```ts
function getUserById(id: number): UserType {
  return { id, name: "John Doe", email: "john@example.com" };
}
```

---

## Generic Type Pattern

* Append `Type` to generic type names.
* Use descriptive **T-prefixed** names for type parameters.

```ts
type ResponseType<TData> = {
  data: TData;
  status: number;
  message: string;
};
```

---

## Union Type Pattern

* Append `Type` to union type names.
* Use descriptive names representing the union concept.

```ts
type StatusType = "pending" | "active" | "completed" | "failed";
```

---

## Enum Pattern

* Append `Enum` to enum names.
* Use **PascalCase** for enum values.

```ts
enum StatusEnum {
  Pending = "PENDING",
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Failed = "FAILED",
}
```

---

## Validation Pattern

* Prefix validators with `validate`.
* Return `boolean` or throw a specific error.

```ts
function validateUserType(user: unknown): user is UserType {
  const validator = InUserType.validate(user);
  return validator.success;
}
```

---

## Assertion Pattern

* Prefix assertions with `assert`.
* Throw descriptive errors.

```ts
function assertUserType(user: unknown): asserts user is UserType {
  const validation = InUserType.validate(user);
  if (!validation.success) {
    throw new Error(`Invalid user: ${validation.error}`);
  }
}
```

---

## Barrel Export Pattern

* Use `index.ts` files to re-export components.
* Group related functionality.

**Example structure:**

```
/users
  /models
    UserType.ts
    index.ts  (exports all types)
  /services
    UserServiceClass.ts
    index.ts  (exports all services)
index.ts       (re-exports from models and services)
```

```ts
// users/index.ts
export * from "./models/index.ts";
export * from "./services/index.ts";
```

---

## Error Class Pattern

* Append `Error` to error class names.
* Extend `Error`.
* Include meaningful error codes.

```ts
class ValidationErrorClass extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ValidationErrorClass";
    this.code = code;
  }
}
```

---

# Linting & Rules

## Import Requirements

* Always use `.ts` extensions in imports.
* Avoid sloppy/ambiguous imports.
* Declare type imports explicitly.

✅ Correct

```ts
import { serve } from "./server.ts";
import type { ServerOptions } from "./types.ts";
```

❌ Incorrect

```ts
import { serve } from "./server";
```

---

## Type Safety

* Use `===` and `!==` only.
* All functions must have explicit return types.
* No `any`.
* Avoid redundant type annotations.
* No non-null assertions (`!`).
* Prefer `as const` for literals.

✅ Correct

```ts
function calculateSum(a: number, b: number): number {
  return a + b;
}

const config = {
  port: 8000,
  host: "localhost",
} as const;
```

❌ Incorrect

```ts
function processData(data: any) {
  return data.value;
}
```

---

## Variables

* Use `const` whenever possible.
* No `var`.
* No reassignments of `const`.
* Avoid multiple variables in one declaration.

---

## Control Flow

* `for` loops must increment correctly.
* Always guard `for-in` loops.
* Avoid `await` in loops.
* No fallthrough in `switch`.

---

## Functions & Classes

* Getters must return.
* Setters must not return values.
* Avoid sync fn inside async fn.
* All async functions should `await`.
* Disallow duplicate args, members.

---

## Error Handling

* No `debugger`, `eval`, or unstructured `console.log`.
* No empty blocks.
* No unused variables.
* Always use structured `try/catch`.

---

## Regular Expressions

* No control characters.
* No invalid regex.
* Avoid multiple spaces in regex.

---

## Comparison

* No comparing with `-0`.
* Use `isNaN()` instead of comparing to `NaN`.
* Avoid duplicate conditions.

---

## Error Prevention

* No assignments in conditionals.
* No reassigning exceptions or imports.
* No unreachable code.
* No unsafe `finally`.

---

## Objects & Arrays

* No duplicate keys.
* No sparse arrays.
* Don’t use `Object.prototype` directly.

---

## Module System

* No `namespace` or `module`.
* Use ES6 imports only.
* No import assertions.

---

## Environment Restrictions

* No NodeJS globals.
* No `window`.
* Avoid external imports where possible.

---

## Best Practices

* Don’t throw raw literals.
* No `with` statements.
* Don’t shadow restricted names.
* Avoid `this` aliasing.
* Ensure valid `typeof` usage.

---

## Example Deno Config

```json
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

---

| Category  | Rule                                       | Example ✅                 | Example ❌        |
| --------- | ------------------------------------------ | ------------------------- | ---------------- |
| Classes   | Suffix `Class`                             | `UserClass`               | `User`           |
| Types     | Suffix `Props`                             | `UserProps`               | `User`           |
| Enums     | Suffix `Enum`, PascalCase members          | `StatusEnum.Pending`      | `status.pending` |
| Functions | camelCase, Verb+Noun, explicit return type | `getUserById(): UserType` | `getuser()`      |
| Imports   | Always `.ts` extension                     | `./module.ts`             | `./module`       |
| Types     | No `any`, no `!`, prefer `as const`        | `as const`                | `: any`          |
| Errors    | Suffix `Error`, extend `Error`             | `ValidationErrorClass`    | `Validation`     |
| Vars      | Prefer `const`, no `var`                   | `const x = 1`             | `var x = 1`      |
