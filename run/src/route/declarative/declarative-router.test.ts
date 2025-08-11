import { describe, it, expect } from "@inspatial/test";
import { Route } from "./declarative-router.ts"

// We need to access the private _match method for testing
// Add this utility to expose the method for testing purposes
function testMatch(
  route: Route<any, any>,
  path: string,
  search = {},
  hash = ""
) {
  return (route as any)._match(path, search, hash);
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
    expect(matchHome?.path).toBe("/home");
    expect(matchHome?.view).toBe("HomeView");
    expect(matchHome?.params).toEqual({});

    const matchAbout = testMatch(route, "/about");
    expect(matchAbout).not.toBeNull();
    expect(matchAbout?.view).toBe("AboutView");

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
    expect(matchUser?.path).toBe("/users/123");
    expect(matchUser?.view).toBe("UserView");
    expect(matchUser?.params).toEqual({ id: "123" });

    const matchPost = testMatch(route, "/posts/hello-world");
    expect(matchPost).not.toBeNull();
    expect(matchPost?.params).toEqual({ slug: "hello-world" });
  });

  it("matches paths with regex parameters", () => {
    const route = new Route([
      { path: "/users/{id:\\d+}", view: "UserView" },
      { path: "/posts/{year:\\d{4}}/{slug:[a-z-]+}", view: "PostView" },
    ]);

    const matchUser = testMatch(route, "/users/123");
    expect(matchUser).not.toBeNull();
    expect(matchUser?.params).toEqual({ id: "123" });

    const noMatchUser = testMatch(route, "/users/abc");
    expect(noMatchUser).toBeNull();

    const matchPost = testMatch(route, "/posts/2023/hello-world");
    expect(matchPost).not.toBeNull();
    expect(matchPost?.params).toEqual({ year: "2023", slug: "hello-world" });

    const noMatchPost = testMatch(route, "/posts/2023/Hello123");
    expect(noMatchPost).toBeNull();
  });

  it("matches catch-all routes", () => {
    const route = new Route([
      { path: "/home", view: "HomeView" },
      { path: "*", view: "NotFoundView" },
    ]);

    const matchHome = testMatch(route, "/home");
    expect(matchHome?.view).toBe("HomeView");

    const matchNotFound = testMatch(route, "/any/random/path");
    expect(matchNotFound).not.toBeNull();
    expect(matchNotFound?.view).toBe("NotFoundView");
    expect(matchNotFound?.params).toEqual({});
  });

  it("includes search parameters and hash in the match", () => {
    const route = new Route([{ path: "/search", view: "SearchView" }]);

    const search = { q: "test", filter: "recent" };
    const hash = "#results";

    const match = testMatch(route, "/search", search, hash);
    expect(match).not.toBeNull();
    expect(match?.search).toEqual(search);
    expect(match?.hash).toBe(hash);
  });

  it("respects route order for matching", () => {
    const route = new Route([
      { path: "/users/admin", view: "AdminView" },
      { path: "/users/{id}", view: "UserView" },
    ]);

    const matchAdmin = testMatch(route, "/users/admin");
    expect(matchAdmin?.view).toBe("AdminView");
    expect(matchAdmin?.params).toEqual({});

    const matchUser = testMatch(route, "/users/123");
    expect(matchUser?.view).toBe("UserView");
    expect(matchUser?.params).toEqual({ id: "123" });
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
      new Route([{ path: "/invalid{param" }]);
    }).toThrow("Malformed path: /invalid{param");

    expect(() => {
      new Route([{ path: "/missing-closing}/brace" }]);
    }).toThrow();

    expect(() => {
      new Route([{ path: "no-leading-slash" }]);
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
