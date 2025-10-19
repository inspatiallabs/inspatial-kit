# Dependency Metrics

## Why We Bundle Instead of Install
InSpatial Kit ships with zero third-party modules or external dependencies by default. Some may note that certain modules such as **TanStack Table** and **Headless Tree** are technically "bundled dependencies." While it’s possible to install these packages directly, in our case, we have chosen to integrate their source into the InSpatial Kit infrastructure rather than expose their raw code. This decision was made for several reasons:

- **Project Maturity & Ergonomics:** Since InSpatial Kit is relatively new, it does not make sense to require upstream authors to maintain specific integration layers for us.
- **Control & Flexibility:** Bundling these modules allows us to make necessary adjustments and refectors immediately, without relying on third parties whose roadmaps or priorities may differ from ours.
- **Registry Alignment:** These dependencies are not currently available on the JSR registry, which is InSpatial’s primary package registry. We believe that npm is outdated and presents unnecessary security risks for modern projects like ours see our [Philosophy](https://github.com/inspatiallabs/inspatial-kit-doc/blob/master/0.%20getting-started/philosophy.md) for more on shipping with zero dependencies and our position on npm.

**rEFui** is a special case. Its Signals and DOM primitives make the basis of our own comprehensive state management solution and universal render targets. The authors of RefUI had different project goals, motivations and a strong preference against **Deno** and **TypeScript**, both of which form the backbone of InSpatial Kit. Consequently, we decided to upstream and extend the Signal and DOM infrastructure independently rather than depend directly on RefUI.

We extend our sincere gratitude to these authors for their hard work and for directly or indirectly shaping InSpatial Kit. For a full list of acknowledgments, please see our [CREDITS](./CREDITS.md).


## Codebase Composition by Source
The InSpatial Kit codebase is composed of the following approximate proportions:

| Category                                  | Description                                                                                                                        | Percentage |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Third-Party Bundled / Refactored Code** | External open-source modules integrated and refactored for compatibility and performance within the InSpatial ecosystem.           | ~5%        |
| **AI-Generated & Refactored Code**        | Code initially produced with AI assistance and subsequently reviewed, refactored, and optimized by the InSpatial engineering team. | 4%        |
| **Origin Code**                           | Original InSpatial Kit implementations architecture and supporting infrastructure.                                                     | 91%        |

> **Note:** Percentages are approximate and reflect the composition across the InSpatial Kit monorepo as of the current v(0.7) release.

### Purpose of These Metrics

These dependency metrics are published to maintain transparency regarding the origins of the InSpatial Kit codebase.
They demonstrate our commitment to:

- Proper open-source attribution and license compliance.
- Clear separation between upstream, AI-assisted, and original contributions.
- Maintaining engineering integrity and accountability throughout development.

By sharing this breakdown, we aim to provide full visibility into how InSpatial Kit is built, how third-party work is respected, and how originality is preserved within our ecosystem.
