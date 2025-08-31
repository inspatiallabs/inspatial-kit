/** Represents a navigation hook that can cancel navigation, redirect, or allow it to proceed. */
type Hook<T extends BaseRouteConfig, C> = (
  route: CompiledRoute<T>,
  params: Record<string, string>,
  context: C | null
) => boolean | string | Promise<boolean | string>;

/** Represents the route configuration object. */
interface RouteOptions<T extends BaseRouteConfig, C = any> {
  delegateUnknown?: boolean;
  eventName?: string;
  hooks?: Hook<T, C>[];
  ignoreUnknown?: boolean;
  initialContext?: C;
  interceptLinks?: boolean;
  prefix?: string;
  routeName?: string;
}

/** Base configuration for a route, required by the library. */
interface BaseRouteConfig {
  to: string; // The route path (required)
  hooks?: any[]; // Optional hooks for route lifecycle (flexible type to avoid circular reference)
  redirect?: string; // Optional redirect target
  [key: string]: any; // Allow additional properties for custom route configurations
}

/** A compiled route, including library-added properties and user-defined properties. */
type CompiledRoute<T extends BaseRouteConfig> = T & {
  name: string; // Route name (added by the library)
  pattern: RegExp; // Compiled regex for matching the path
  params: string[]; // Parameter names extracted from the path
  mapping: string; // Mapping string for regex grouping
};

/** The Route class for handling navigation and route matching. */
import { detectBrowserEngine } from "@in/vader/env";

export class Route<T extends BaseRouteConfig, C = null> {
  private mappings: RegExp | null = null;
  private hooks: Hook<T, C>[];
  private routes: Record<string, CompiledRoute<T>>;
  private captureGroupToRouteName: Record<string, string> = {};
  private prefix: string;
  private eventName: string;
  private context: C | null;
  private interceptLinks: boolean;
  private ignoreUnknown: boolean;
  private delegateUnknown: boolean;
  private routeName: string | null = null;
  // Keep stable references for add/removeEventListener
  private _onPopStateBound = this._handlePopState.bind(this);
  private _onClickBound = this._handleClick.bind(this);
  private _onNavigateBound = this._handleNavigateEvent.bind(this);
  // Track last navigation result for Navigation API programmatic calls
  private _lastResult:
    | { route: CompiledRoute<T>; params: Record<string, string> }
    | false
    | undefined;
  private _handlingNavigationEvent = false;

  /**
   * Initialize the route with routes configuration and options.
   *
   * @param routes - A map of routes or array of routes, including a 'notFound' route.
   * @param options - Configuration options including global hooks, prefix, and event name.
   */
  constructor(
    routes: T[] | Record<string, T> = {},
    options: RouteOptions<T, C> = {}
  ) {
    this.hooks = options.hooks || [];
    this.prefix = options.prefix || "";
    this.eventName = options.eventName || "in-route";
    this.context = options.initialContext ?? null;
    this.interceptLinks = options.interceptLinks ?? true;
    this.ignoreUnknown = options.ignoreUnknown ?? false;
    this.delegateUnknown = options.delegateUnknown ?? false;
    this.routeName = options.routeName || null;
    this.routes = {};

    // Convert array format to object format if needed
    const routesObject = this._normalizeRoutes(routes);
    this._compile(routesObject);
  }

  /**
   * Normalizes routes input to object format, converting arrays to objects if needed.
   * @param routes - Routes in array or object format
   * @returns Routes in object format with index-based keys for arrays
   */
  private _normalizeRoutes(routes: T[] | Record<string, T>): Record<string, T> {
    // Handle empty/undefined routes
    if (!routes) {
      return {};
    }

    // Check if routes is an array
    if (Array.isArray(routes)) {
      // Convert array to object format using index-based keys
      const routesObject: Record<string, T> = {};
      routes.forEach((route, index) => {
        routesObject[index.toString()] = route;
      });
      return routesObject;
    }

    // Already in object format, return as-is
    return routes;
  }

  /**
   * Creates a valid capture group name for regex patterns.
   * JavaScript regex named capture groups must start with a letter or underscore.
   * @param name - The original route name
   * @returns A valid capture group name
   */
  private _createValidCaptureGroupName(name: string): string {
    // If name starts with a digit, prefix with 'route_'
    if (/^\d/.test(name)) {
      return `route_${name}`;
    }
    // If name contains invalid characters, replace them with underscores
    return name.replace(/[^a-zA-Z0-9_$]/g, "_");
  }

  /**
   * Compiles the user-provided routes into a format usable by the route.
   * @param routes - The user-defined routes.
   */
  private _compile(routes: Record<string, T>): void {
    const compiledRoutes: Record<string, CompiledRoute<T>> = {};
    const mappings: string[] = [];
    const captureGroupToRouteName: Record<string, string> = {};

    for (const [name, routeConfig] of Object.entries(routes)) {
      if (name) {
        const compiledRoute = this._process(routeConfig, name);
        compiledRoutes[name] = compiledRoute;

        // Create valid capture group name (must start with letter or underscore)
        const captureGroupName = this._createValidCaptureGroupName(name);
        captureGroupToRouteName[captureGroupName] = name;

        mappings.push(`(?<${captureGroupName}>${compiledRoute.mapping})`);
      }
    }

    // Handle empty routes gracefully for testing scenarios
    if (mappings.length === 0) {
      this.mappings = null;
      this.routes = {};
      this.captureGroupToRouteName = {};
      return;
    }

    this.mappings = new RegExp(`^${mappings.join("|")}$`, "i");
    this.routes = compiledRoutes;
    this.captureGroupToRouteName = captureGroupToRouteName;
  }

  /**
   * Processes a single route configuration into a compiled route.
   * @param routeConfig - The user-provided route configuration.
   * @param name - The name of the route.
   * @returns A compiled route object.
   */
  private _process(routeConfig: T, name: string): CompiledRoute<T> {
    if (routeConfig.to === "*") {
      return {
        ...routeConfig,
        name,
        pattern: new RegExp("^.*$"),
        params: [],
        mapping: "^.*$",
      };
    }
    const fullPath = this.prefix + routeConfig.to;

    const SEGMENT_REGEX =
      /(?:\/([^\/{}]+)|\/\{([a-zA-Z_$][a-zA-Z0-9_$]*)(?::([^/]+))?\}|(\/))/g;
    const matches = fullPath.match(SEGMENT_REGEX);
    if (!matches || matches.join("") !== fullPath) {
      throw new Error(`Malformed to: ${fullPath}`);
    }

    let paramRegex = "^";
    let mappingRegex = "^";
    const names: string[] = [];

    fullPath.replace(
      SEGMENT_REGEX,
      (_matchStr, literal, param, regex, slash) => {
        if (literal) {
          const escaped =
            "\\/" + literal.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
          paramRegex += escaped;
          mappingRegex += escaped;
        } else if (param) {
          paramRegex += `\\/(?<${param}>${regex || "[^/]+"})`;
          mappingRegex += `\\/${regex || "[^/]+"}`;
          names.push(param);
        } else if (slash) {
          paramRegex += "\\/";
          mappingRegex += "\\/";
        }
        return "";
      }
    );
    paramRegex += "$";
    mappingRegex += "$";

    return {
      ...routeConfig,
      name,
      pattern: new RegExp(paramRegex),
      params: names,
      mapping: mappingRegex,
    };
  }

  /**
   * Matches a path to a route and extracts parameters.
   * @param path - The path to match.
   * @returns The matched route and its parameters, or the notFound route if no match.
   */
  private _matchRoute(
    to: string
  ): { route: CompiledRoute<T>; params: Record<string, string> } | null {
    // Return null when no routes are configured (for testing scenarios)
    if (!this.mappings) return null;

    const matches = this.mappings.exec(to);
    if (!matches || matches[0] !== to || !matches.groups)
      return this.ignoreUnknown || !this.routes.notFound
        ? null
        : { route: this.routes.notFound, params: {} };

    const captureGroupName = Object.keys(matches.groups ?? {}).find(
      (key) => matches.groups?.[key] !== undefined
    );
    if (!captureGroupName) {
      return { route: this.routes.notFound, params: {} };
    }

    // Map capture group name back to actual route name
    const routeName = this.captureGroupToRouteName[captureGroupName];
    if (!routeName) {
      return { route: this.routes.notFound, params: {} };
    }

    const route = this.routes[routeName];
    const paramsMatch = route.pattern.exec(to);
    const paramsRaw = paramsMatch ? paramsMatch.groups || {} : {};
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(paramsRaw)) {
      try {
        params[k] = typeof v === "string" ? decodeURIComponent(v) : (v as any);
      } catch {
        params[k] = v as any;
      }
    }
    return { route, params };
  }

  /** Starts the route, attaching event listeners and navigating to the current path. */
  start(): this {
    const navApi = (globalThis as any).navigation;
    const isChromium = detectBrowserEngine() === "chromium";

    if (navApi && isChromium) {
      // Use the Web Navigation API (Chromium)
      navApi.addEventListener("navigate", this._onNavigateBound);
    }
    // Always attach History+click interception for broad compatibility
    globalThis.addEventListener("popstate", this._onPopStateBound);
    this.interceptLinks &&
      document.addEventListener("click", this._onClickBound);
    // Prime current route
    this.navigate(
      globalThis.location.pathname + globalThis.location.search,
      false
    );
    this.delegateUnknown &&
      document.addEventListener(
        `${this.eventName}-delegate`,
        this._onDelegate.bind(this)
      );
    return this;
  }

  /** Stops the route, removing event listeners. */
  stop(): void {
    const navApi = (globalThis as any).navigation;
    const isChromium = detectBrowserEngine() === "chromium";

    if (navApi && isChromium) {
      navApi.removeEventListener?.("navigate", this._onNavigateBound);
    }
    globalThis.removeEventListener("popstate", this._onPopStateBound);
    this.interceptLinks &&
      document.removeEventListener("click", this._onClickBound);
  }

  /**
   * Generates a URL for a named route with parameters and query string.
   * @param name - The name of the route.
   * @param params - Route parameters.
   * @param query - Query parameters.
   * @returns The generated URL.
   */
  generateUrl(
    name: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): string {
    const route = this.routes[name];
    if (!route) {
      throw new Error(`Named route '${name}' not found`);
    }

    let path = this.prefix + (route as any).to;
    for (const paramName of route.params) {
      const value = params[paramName];
      if (value === undefined || value === null) {
        throw new Error(
          `Missing required parameter: ${paramName} for route '${name}'`
        );
      }
      const escapedParamName = paramName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const paramRegex = new RegExp(
        `\\{${escapedParamName}(?::[^}]*)?\\}`,
        "g"
      );
      path = path.replace(paramRegex, encodeURIComponent(value));
    }

    if (query && Object.keys(query).length > 0) {
      const queryString = Object.entries(query)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      path += `?${queryString}`;
    }

    return path;
  }

  /**
   * Handles custom event triggered by another instance of the route.
   *
   * @param event - The custom event containing the path another route had no config for.
   * @returns A promise that resolves when the delegate action is complete.
   */
  private _onDelegate(e: Event): void {
    const event = e as CustomEvent;
    if (event.detail.route !== this.routeName) {
      const raw =
        (event as any).detail?.path ?? (event as any).detail?.to ?? "";
      const match = this._matchRoute(String(raw).split("?")[0]);
      match && this.navigate(String(raw));
    }
  }

  /**
   * Navigates to a given path, running hooks and updating history.
   * @param path - The path to navigate to.
   * @param pushState - Whether to push a new history state.
   * @param delegate - Whether to delegate to another route if no match is found.
   * @returns A promise resolving to the matched route and params, or false if navigation is canceled.
   */
  async navigate(
    to: string,
    pushState: boolean = true,
    redirectCount: number = 0
  ): Promise<
    { route: CompiledRoute<T>; params: Record<string, string> } | false
  > {
    if (redirectCount > 10)
      throw new Error("in-route: redirect limit exceeded");

    // Run the route locally for broad browser support
    const result = await this._runRouteForPath(to, redirectCount);
    if (result === false) return false;

    // Update history after successful match
    try {
      const hasHistory = typeof (globalThis as any).history !== "undefined";
      if (hasHistory) {
        if (pushState) (globalThis as any).history.pushState({ to }, "", to);
        else (globalThis as any).history.replaceState({ to }, "", to);
      }
    } catch {
      // best-effort history update
    }

    return result;
  }

  /**
   * Navigates to a named route with parameters.
   * @param name - The name of the route.
   * @param params - Route parameters.
   * @param pushState - Whether to push a new history state.
   * @returns A promise resolving to the matched route and params, or false if navigation is canceled.
   */
  navigateToNamed(
    name: string,
    params: Record<string, string> = {},
    pushState: boolean = true
  ): Promise<
    { route: CompiledRoute<T>; params: Record<string, string> } | false
  > {
    const route = this.routes[name];
    if (!route) {
      throw new Error(`Named route '${name}' not found`);
    }

    let path = this.prefix + (route as any).to;
    for (const paramName of route.params) {
      const value = params[paramName] || "";
      path = path.replace(
        new RegExp(`\\{${paramName}(?::[^}]*)?\\}`, "g"),
        encodeURIComponent(value)
      );
    }

    return this.navigate(path, pushState);
  }

  /**
   * Parses a query string into a key-value object.
   * @param queryString - The query string to parse.
   * @returns The parsed query parameters.
   */
  private _parseQuery(queryString: string): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(queryString));
  }

  /**
   * Dispatches a custom event with route details.
   * @param route - The matched route.
   * @param params - The route parameters.
   */
  private _dispatchEvent(
    route: CompiledRoute<T>,
    params: Record<string, string>,
    path?: string
  ): void {
    const currentPath = path || (globalThis as any).location?.pathname || "";
    const currentSearch = (globalThis as any).location?.search || "";
    const event = new CustomEvent(this.eventName, {
      detail: {
        route,
        params: params || {},
        to: currentPath,
        query: this._parseQuery(currentSearch),
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  /** Handles browser back/forward navigation. */
  private async _handlePopState(_event: PopStateEvent): Promise<void> {
    await this.navigate(
      globalThis.location.pathname + globalThis.location.search,
      false
    );
  }

  /** Handles link clicks to enable SPA navigation. */
  private async _handleClick(event: MouseEvent): Promise<void> {
    // If default has been prevented by a higher-priority handler (e.g., Link), respect it
    if ((event as any).defaultPrevented) return;
    // Respect modifier keys and non-left clicks (open in new tab/window, background, etc.)
    if ((event as any).button !== 0) return;
    if (
      (event as any).metaKey ||
      (event as any).ctrlKey ||
      (event as any).shiftKey ||
      (event as any).altKey
    )
      return;
    const link = (event.target as Element).closest("a");
    if (
      !link ||
      link.getAttribute("target") === "_blank" ||
      link.hasAttribute("data-no-route") ||
      link.hasAttribute("download") ||
      link.getAttribute("rel") === "external"
    ) {
      return;
    }

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      !href.startsWith(this.prefix) ||
      new URL(href, globalThis.location.origin).origin !==
        globalThis.location.origin
    ) {
      return;
    }

    event.preventDefault();
    await this.navigate(href);
  }

  /** Handle Navigation API navigate event (Chromium) */
  // deno-lint-ignore no-explicit-any
  private _handleNavigateEvent(e: any): void {
    const _event = e as any;
    try {
      const destUrl = new URL(
        _event?.destination?.url || "",
        globalThis.location.origin
      );
      // Only handle same-origin navigations
      if (destUrl.origin !== globalThis.location.origin) return;

      const path = destUrl.pathname + destUrl.search;
      _event?.intercept?.({
        handler: async () => {
          this._handlingNavigationEvent = true;
          try {
            await this._runRouteForPath(path);
          } finally {
            this._handlingNavigationEvent = false;
          }
        },
      });
    } catch {
      // ignore malformed URLs
    }
  }

  /** Run route matching, hooks and dispatch without mutating history */
  private async _runRouteForPath(
    to: string,
    redirectCount: number = 0
  ): Promise<
    { route: CompiledRoute<T>; params: Record<string, string> } | false
  > {
    if (redirectCount > 10)
      throw new Error("in-route: redirect limit exceeded");

    const _match = this._matchRoute(to.split("?")[0]);
    if (_match === null) {
      this.delegateUnknown &&
        document.dispatchEvent(
          new CustomEvent(`${this.eventName}-delegate`, {
            detail: { to, route: this.routeName },
          })
        );
      this._lastResult = false;
      return false;
    }

    if (_match.route.redirect) {
      return this.navigate(_match.route.redirect, true, redirectCount + 1);
    }

    for (const hook of [...this.hooks, ...(_match.route.hooks || [])]) {
      try {
        const result = await hook(_match.route, _match.params, this.context);
        if (result === false) {
          this._lastResult = false;
          return false;
        }
        if (typeof result === "string") {
          return this.navigate(result, true);
        }
      } catch (error) {
        console.error("Error in navigation hook:", error);
        this._lastResult = false;
        return false;
      }
    }

    this._dispatchEvent(_match.route, _match.params, to);
    this._lastResult = { route: _match.route, params: _match.params };
    return this._lastResult;
  }
}
