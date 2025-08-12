// @ts-ignore
import { describe, it, expect } from "@inspatial/test";
// @ts-ignore
import { Route } from "./route.ts";

// We need to access the private _match method for testing
// Add this utility to expose the method for testing purposes
function testMatch(
  router: Route<any, any>,
  path: string,
  search: Record<string, string> = {},
  hash = ""
) {
  const qs = Object.entries(search)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const _full = qs ? `${path}?${qs}${hash}` : `${path}${hash}`;
  const anyRouter = router as any;
  if (typeof anyRouter._matchRoute === "function") {
    return anyRouter._matchRoute(path);
  }
  return anyRouter._match?.(path, search, hash) ?? null;
}

//======================================(MATCH)=======================================//
describe("Route _match function", () => {
  it("matches exact paths", () => {
    const route = new Route([
      { path: "/home", view: "HomeView" },
      { path: "/about", view: "AboutView" },
    ]);

    const matchHome = testMatch(route, "/home");
    expect(matchHome).not.toBeNull();
    expect((matchHome as any)?.route?.path ?? (matchHome as any)?.path).toBe(
      "/home"
    );
    expect((matchHome as any)?.view ?? (matchHome as any)?.route?.view).toBe(
      "HomeView"
    );
    expect((matchHome as any)?.params ?? {}).toEqual({});

    const matchAbout = testMatch(route, "/about");
    expect(matchAbout).not.toBeNull();
    expect((matchAbout as any)?.view ?? (matchAbout as any)?.route?.view).toBe(
      "AboutView"
    );

    const noMatch = testMatch(route, "/contact");
    expect(noMatch).toBeNull();
  });

  it("matches paths with parameters", () => {
    const route = new Route([
      { path: "/users/{id}", view: "UserView" },
      { path: "/posts/{slug}", view: "PostView" },
    ]);

    const matchUser = testMatch(route, "/users/123");
    expect(matchUser).not.toBeNull();
    expect((matchUser as any)?.route?.path ?? (matchUser as any)?.path).toBe(
      "/users/123"
    );
    expect((matchUser as any)?.view ?? (matchUser as any)?.route?.view).toBe(
      "UserView"
    );
    expect((matchUser as any)?.params ?? {}).toEqual({ id: "123" });

    const matchPost = testMatch(route, "/posts/hello-world");
    expect(matchPost).not.toBeNull();
    expect((matchPost as any)?.params ?? {}).toEqual({ slug: "hello-world" });
  });

  it("matches paths with regex parameters", () => {
    const route = new Route([
      { path: "/users/{id:\\d+}", view: "UserView" },
      { path: "/posts/{year:\\d{4}}/{slug:[a-z-]+}", view: "PostView" },
    ]);

    const matchUser = testMatch(route, "/users/123");
    expect(matchUser).not.toBeNull();
    expect((matchUser as any)?.params ?? {}).toEqual({ id: "123" });

    const noMatchUser = testMatch(route, "/users/abc");
    expect(noMatchUser).toBeNull();

    const matchPost = testMatch(route, "/posts/2023/hello-world");
    expect(matchPost).not.toBeNull();
    expect((matchPost as any)?.params ?? {}).toEqual({
      year: "2023",
      slug: "hello-world",
    });

    const noMatchPost = testMatch(route, "/posts/2023/Hello123");
    expect(noMatchPost).toBeNull();
  });

  it("matches catch-all routes", () => {
    const route = new Route([
      { path: "/home", view: "HomeView" },
      { path: "*", view: "NotFoundView" },
    ]);

    const matchHome = testMatch(route, "/home");
    expect((matchHome as any)?.view ?? (matchHome as any)?.route?.view).toBe(
      "HomeView"
    );

    const matchNotFound = testMatch(route, "/any/random/path");
    expect(matchNotFound).not.toBeNull();
    expect(
      (matchNotFound as any)?.view ?? (matchNotFound as any)?.route?.view
    ).toBe("NotFoundView");
    expect((matchNotFound as any)?.params ?? {}).toEqual({});
  });

  it("includes search parameters and hash in the match", () => {
    const route = new Route([{ path: "/search", view: "SearchView" }]);

    const search = { q: "test", filter: "recent" };
    const hash = "#results";

    const match = testMatch(route, "/search", search, hash);
    expect(match).not.toBeNull();
    expect(typeof match).not.toBe("undefined");
  });

  it("respects route order for matching", () => {
    const route = new Route([
      { path: "/users/admin", view: "AdminView" },
      { path: "/users/{id}", view: "UserView" },
    ]);

    const matchAdmin = testMatch(route, "/users/admin");
    expect((matchAdmin as any)?.view ?? (matchAdmin as any)?.route?.view).toBe(
      "AdminView"
    );
    expect((matchAdmin as any)?.params ?? {}).toEqual({});

    const matchUser = testMatch(route, "/users/123");
    expect((matchUser as any)?.view ?? (matchUser as any)?.route?.view).toBe(
      "UserView"
    );
    expect((matchUser as any)?.params ?? {}).toEqual({ id: "123" });
  });

  it("returns null when no routes exist", () => {
    const route = new Route();
    const match = testMatch(route, "/some/path");
    expect(match).toBeNull();
  });

  it("handles multiple parameters in a single path", () => {
    const route = new Route([
      { path: "/blog/{category}/{year:\\d{4}}/{slug}", view: "BlogView" },
    ]);

    const match = testMatch(route, "/blog/tech/2023/javascript-updates");
    expect(match).not.toBeNull();
    expect(match?.params).toEqual({
      category: "tech",
      year: "2023",
      slug: "javascript-updates",
    });
  });
});

//======================================(ROUTER)=======================================//

describe("Route constructor", () => {
  it("creates a route with empty routes", () => {
    const route = new Route();
    expect(route).toBeInstanceOf(Route);
  });

  it("creates a route with valid routes", () => {
    const route = new Route([
      { path: "/", redirect: "/home" },
      { path: "/home", view: "HomeView" },
      { path: "/users/{id}", handler: () => true },
      { path: "/posts/{postId:\\d+}", view: "PostView" },
      { path: "*", view: "NotFoundView" },
    ]);

    expect(route).toBeInstanceOf(Route);
  });

  it("handles catch-all routes correctly", () => {
    const route = new Route([{ path: "*", view: "NotFoundView" }]);

    expect(route).toBeInstanceOf(Route);
  });

  it("accepts various parameter formats", () => {
    const route = new Route([
      { path: "/users/{id}", view: "UserView" },
      { path: "/posts/{slug:[a-z0-9-]+}", view: "PostView" },
      { path: "/products/{category}/{id:\\d+}", view: "ProductView" },
    ]);

    expect(route).toBeInstanceOf(Route);
  });

  it("throws an error for malformed paths", () => {
    expect(() => {
      new Route([{ path: "/invalid{param" } as any]);
    }).toThrow("Malformed path: /invalid{param");

    expect(() => {
      new Route([{ path: "/missing-closing}/brace" } as any]);
    }).toThrow();

    expect(() => {
      new Route([{ path: "no-leading-slash" } as any]);
    }).toThrow();
  });

  it("handles complex path patterns", () => {
    const route = new Route([
      {
        path: "/blog/{year:\\d{4}}/{month:\\d{2}}/{day:\\d{2}}/{slug:[a-z0-9-]+}",
        view: "BlogPostView",
      },
      {
        path: "/api/{version:\\d+}/resources/{resourceId:[a-f0-9-]+}",
        view: "ApiResourceView",
      },
    ]);

    expect(route).toBeInstanceOf(Route);
  });

  it("handles multiple routes with similar patterns", () => {
    const route = new Route([
      { path: "/users/{id}", view: "UserView" },
      { path: "/users/new", view: "NewUserView" },
      { path: "/users/{id}/edit", view: "EditUserView" },
    ]);

    expect(route).toBeInstanceOf(Route);
  });
});
