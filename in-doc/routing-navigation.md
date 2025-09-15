
# Routing & Navigation

### 8. InSpatial Route

InSpatial Route is a universal filesystem router built on InSpatial's `@in/route` module.

### Programmatic routing - `createRoute()` API

- Define routes with `createRoute({ routes })`.
- Map views with `.views({...})` or `.viewsByPath({...})`, and set `.default(fallback)`.
- Render with `<Dynamic is={route.selected} />`. Read `route.current`, navigate via `route.to(path)`, `route.redirect(path)`, `route.back()`; check `route.canGoBack`.
- Minimal example:

  ```ts
  export const route = createRoute({
    mode: "auto",
    defaultView: ErrorWindow,
    routes: [
      { name: "home", to: "/", view: HomeWindow },
      { name: "projects", to: "/projects", view: ProjectsWindow },
    ],
  });

  export function AppRoutes() {
    const Selected = route.selected;
    return () => <Dynamic is={Selected} />;
  }
  ```

  NOTE: Pass your `AppRoutes` as the entry point un your renderer

  ```ts
  createRenderer({...}).then((InSpatial: any) => {
      InSpatial.render(document.getElementById("app"), AppRoutes); // Import you Approutes
  });
  ```

### Navigation

#### A. With Link Component:

- Use `<Link to="/path">` for SPA navigation; it uses InSpatial's universal `InTrigger` props (`on:tap`) under the hood and appends `?ref=inspatial` for external http(s) links.
- Example:

  ```tsx
  <Link to="/projects">Projects</Link>
  ```

#### B. With Trigger Props

```ts
import { route } from "@inspatial/kit/route";

const route = createRoute()

//NOTE: route.to() handles both named and path/URL navigation so ("/home") or ("home") will both work
<MyComponent on:tap={() => route.to("/home")}>Home</MyComponent>
```

NOTE: `route.to()` is an alias of `route.navigate()` however .to is preffered since its reads fluently and aligns with `<Link to...>`

### File Based Routing - `InRoute()` Extension

\* \*\*Soon...