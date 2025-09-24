### NOTE

- **THIS IS NOT A REACT PROJECT**: Do not import, write or use React apis and hooks.

- All InSpatial Dev Modules start with `@in` directive

- Build success doesn't mean no runtime issues. Check carefully if you have made any existing variables disappear during an edit, or the new variables has not been declared.

- If you want to check build errors in deno use the deno core command `deno task build` when using `InServe` renderer extension. Use `deno check` or `deno lint` too for comprehensive checks. For pnpm use `pnpm build`, do not use `pnpm dev`, as `pnpm dev` spawns a blocking dev server that never automatically exits.
