<div align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/icon-brutal-dark.svg" alt="InSpatial" width="300">
    </picture>

<br>
   <br>

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg">
        <img src="https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/logo-dark.svg" height="75" alt="InSpatial">
    </picture>
</p>

_Reality is your canvas_

<h3 align="center">
    InSpatial is a universal development environment (UDE) <br> for building cross-platform and spatial (AR/MR/VR) applications
  </h3>

[![InSpatial Dev](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg)](https://www.inspatial.dev)
[![InSpatial Cloud](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/cloud-badge.svg)](https://www.inspatial.cloud)
[![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.io)
[![InSpatial Store](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg)](https://www.inspatial.store)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Discord](https://img.shields.io/badge/discord-join_us-5a66f6.svg?style=flat-square)](https://discord.gg/inspatiallabs)
[![Twitter](https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat-square)](https://twitter.com/inspatiallabs)
[![LinkedIn](https://img.shields.io/badge/linkedin-connect_with_us-0a66c2.svg?style=flat-square)](https://www.linkedin.com/company/inspatiallabs)

</div>

##

<div align="center">

| InSpatial                                                                                                                     | Description                          | Link                                           |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| [![InSpatial Dev](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/dev-badge.svg)](https://www.inspatial.dev)       | Universal Libraries & Frameworks     | [inspatial.dev](https://www.inspatial.dev)     |
| [![InSpatial Cloud](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/cloud-badge.svg)](https://www.inspatial.cloud) | Backend APIs and SDKs                | [inspatial.cloud](https://www.inspatial.cloud) |
| [![InSpatial App](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/app-badge.svg)](https://www.inspatial.io)        | Build and manage your InSpatial apps | [inspatial.app](https://www.inspatial.io)      |
| [![InSpatial Store](https://inspatial-storage.s3.eu-west-2.amazonaws.com/media/store-badge.svg)](https://www.inspatial.store) | Deploy and discover InSpatial apps   | [inspatial.store](https://www.inspatial.store) |

</div>

---

## 🛠️ InVader (🟢 Stable)

InVader is your Swiss Army knife for universal and spatial application development. It provides a collection of powerful, type-safe utility functions to streamline your workflow and enhance your projects.

## 🚀 Features

- 🧰 **70+ Utility Functions** - Comprehensive collection of type-safe utilities for common programming tasks
- 🔢 **Advanced Array Operations** - Ensure arrays, flatten, group, splice, shuffle, and manipulate arrays with ease
- 📝 **String Processing** - Capitalize, format, hyphenize, escape HTML, and manipulate strings safely
- ⚡ **Async Management** - Abortable promises, delays, backoff strategies, and async iterable handling
- 🔍 **Type Safety** - Primitive type checking, thenable detection, and runtime type validation
- 🌐 **Environment Detection** - Runtime, platform, and feature detection across different environments
- 🔐 **Security Utilities** - HTML escaping, safe data handling, and secure coding helpers
- 📊 **Data Processing** - CSV parsing, data extraction, formatting, and manipulation tools
- 🖥️ **DOM Operations** - Image conversion, clipboard management, link handling, and window utilities
- 🎯 **Performance Tools** - Caching, memoization, and optimization utilities
- 🐛 **Debugging Support** - Comprehensive logging, environment analysis, and development aids
- 🌍 **Internationalization** - Country data, encoding utilities, and locale-aware functions

These features make InVader an essential toolkit for developers building robust, performant, and secure applications across all platforms.

## 📦 Install InVader:

Choose your preferred package manager:

```bash
deno install jsr:@in/vader
```

##

```bash
npx jsr add @in/vader
```

##

```bash
yarn dlx jsr add @in/vader
```

##

```bash
pnpm dlx jsr add @in/vader
```

##

```bash
bunx jsr add @in/vader
```

## 🛠️ Available Utilities

InVader includes the following utility functions:

1. (Main module export - imports all utilities)
2. `capitalize`: Capitalizes the first letter of a string.
3. `shuffle`: Randomly shuffles an array.
4. `shuffled`: Returns a new array with shuffled elements.
5. `focusInput`, `hasErrorInput`, `focusRing`: Input styling utilities for focus and error states.
6. `range`: Generates an array of numbers within a specified range.
7. `milliseconds`: Converts time units to milliseconds.
8. `crossArray`: Crosses two arrays to produce a Cartesian product.
9. `dedupe`: Removes duplicate elements from an array.
10. `eq`: Checks for deep equality between two values.
11. `random`: Generates a random number within a specified range.
12. `swap`: Swaps two elements in an array.
13. `trackDebug`: Utility for tracking and debugging.
14. `domainMatcher`: Matches a domain against a list of patterns.
15. `prettify`: Formats data into a more readable form.
16. `format`: Formats strings with placeholders.
17. `formatTime`: Formats time values into human-readable strings.
18. `getRandomKitColors`: Generates random color schemes for UI components.
19. `mergeRef`: Merges multiple React refs into one.
20. `generateUniqueId`: Generates a unique identifier.
21. `copyToClipboard`: Copies a URL to the clipboard and executes an optional callback.
22. `openLink`: Opens a URL in a new browser tab.
23. `printPage`: Triggers the browser's print dialog for the current page.
24. `replaceNonDigits`: Removes non-digit characters from a string.
25. `currency`: Formats numbers as currency strings.
26. `share`: Shares content using the Web Share API.
27. `dateTime`: Utilities for date and time manipulation.
28. `ulid`: Generates a Universally Unique Lexicographically Sortable Identifier.
29. `csv`: Parses and generates CSV data.
30. `extractor`: Extracts specific data from a larger dataset.
31. `text`: Text manipulation utilities.
32. `collection`: Provides collection utilities from the standard library.
33. `countries`: Utilities for handling country data.
34. `encoding`: Utilities for encoding and decoding data.
35. `regexEscape`: Escapes special characters in a regex pattern.
36. `sameStart`: Checks if two strings start with the same sequence.
37. `farthestPoint`: Finds the farthest point in a dataset.
38. `difference`: Calculates the difference between two datasets.
39. `convertImageToBase64DOM`: Converts an image file to a base64 string using the DOM.
40. `svgToTinyDataUri`: Converts an SVG to a tiny data URI.
41. `svgToSrcSet`: Converts an SVG to a srcset-compatible data URI.
42. `stringify`: Converts an object to a string.
43. `clamp`: Restricts a numeric value to an inclusive range defined by min and max.
44. `unwrapValue`: Unwraps a value that may be a number or a reactive signal containing a number.
45. `toPercentage`: Converts a value to a percentage within a specified range.
46. `abortable`: Allows cancellation of promises or async iterables using AbortSignal for graceful operation termination.
47. `array`: Provides utility functions for array operations like ensuring arrays, flattening, and grouping.
48. `backoffJitter`: Calculates exponential backoff delays with jitter for retry mechanisms and rate limiting.
49. `backtrace`: Analyzes differences between two lists and tracks what was added, removed, or changed.
50. `cached`: Provides caching utilities for memoizing function results and improving performance.
51. `createAttributeFilter`: Creates filter functions that match objects by namespace and name with case-insensitive matching.
52. `createFilter`: Creates filter functions for file inclusion/exclusion based on glob patterns.
53. `debug`: Comprehensive debugging utilities with different log levels and categories for development.
54. `delay`: Creates promises that resolve after a specified delay with optional cancellation support.
55. `env`: Environment detection and management utilities for runtime, platform, and feature detection.
56. `escapeHtml`: Escapes HTML special characters to prevent XSS attacks and ensure safe rendering.
57. `file-system`: Utilities for managing your file system across all runtime and platforms.
58. `getPackageVersion`: Retrieves the current package version for display or comparison purposes.
59. `hyphenize`: Converts camelCase or PascalCase strings to hyphen-case/kebab-case format.
60. `isOneEditAway`: Checks if two strings are only one edit operation apart (insert, delete, or replace).
61. `isPrimitive`: Type guard that checks if a value is a primitive type (string, number, boolean, etc.).
62. `isThenable`: Checks if a value has a `then` method, identifying Promise-like objects.
63. `keydown`: Handles keyboard navigation for radio groups and interactive elements.
64. `nop`: No-operation function that does nothing, useful as a default or placeholder.
65. `normalizePath`: Normalizes file paths by converting backslashes to forward slashes.
66. `parseX`: Parses comma-separated strings into arrays of numbers or strings.
67. `removeFromArr`: Removes specific elements from arrays efficiently.
68. `safeLookupMap`: Provides a safe lookup map that handles both object keys and primitive keys.
69. `splice`: Advanced array splicing utilities with filtering and search capabilities.
70. `splitFirst`: Splits a string at the first occurrence of a delimiter.
71. `tolower`: Converts values to lowercase strings.
72. `toupper`: Converts values to uppercase strings.
73. `windowSize`: Tracks and responds to window size changes across different environments.

For detailed usage and parameters of each utility, please refer to the source code or our comprehensive documentation.

---

## 🚀 Getting Started

To begin your journey with InSpatial Kit, visit our comprehensive documentation at [inspatial.dev](https://www.inspatial.dev).

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 📄 License

InSpatial Dev is released under the Intentional 1.0 License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Ready to supercharge your InSpatial development?</strong>
  <br>
  <a href="https://www.inspatial.io">Get Started with InVader</a>
</div>
