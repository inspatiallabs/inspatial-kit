# InRoute Roadmap

## Phase 3

- Data loaders: co-located `loader()` with typed client stubs; server/client execution; serialization.
- Advanced routing: parallel slots (`@slot`), intercepting routes, transition orchestration.
- Route modes: SPA/MPA per-route and app defaults; Navigation API fallback; focus/scroll management.

## Phase 4 (Advance - deferred)

- Multi-zone support and shared shells; split builds.
- Parallel Domain (multi-origin) strategies; reverse proxy guidance; optional iframe shell.

## Phase 5 (Nice to have)

- reintroduce file scanner to implement native InSpatial @serve manifest generation?

- SSR integration: stream `layout + page` with `SSRRenderer`; hydrate router/state; manifest hash.

- Vite/Webpack scanner: enrich directive parsing (multi-line, comments), platform suffix handling for layout/loading/error; intercepting/parallel segments; route groups; zones; dynamic segments.

- Vite/Webpack: rebuild manifest on FS changes and emit types; HMR align to affected routes only.

## Phase 6 (Nice to have)

- Security guidance: CSP, sanitizer defaults, SSR escaping.
- Docs, templates, E2E tests.
