import { InZero } from "@in/zero";

/**
 * @fileoverview InSpatial Development Server
 *
 * The InSpatial Development Server (`InSpatialServe`) is a comprehensive development environment that provides:
 *
 * ## Features
 *
 * - **File Serving**: Serves your InSpatial app from the `dist` directory
 * - **File Watching**: Monitors source files for changes
 * - **Smart Building**: Automatically rebuilds JavaScript, CSS, and HTML assets
 * - **Hot Reload**: Instant browser refresh via WebSocket connection *
 *
 * ## Usage
 *
 * ### From deno.json task (recommended)
 * ```bash
 * # From the app directory
 * deno task serve
 * ```
 *
 * ### Direct execution
 * ```bash
 * # From the app directory
 * deno run --allow-net --allow-read --allow-write --allow-env --allow-run src/config/serve.ts
 * ```
 *
 * ### As import
 * ```typescript
 * import { InSpatialServe } from "@inspatial/serve";
 *
 * // Create and run server
 * await new InSpatialServe().run();
 * ```
 *
 * ## Configuration
 *
 * ### Default Ports
 * - **App Server**: `http://localhost:6310`
 * - **WebSocket (Hot Reload)**: `ws://localhost:8888`
 *
 * ### File Watching
 * - Watches `./src/**` for source files
 * - Watches `./index.html` for HTML changes
 * - Supports: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.scss`
 *
 * ### Build Process
 * - **CSS First**: When both JS and CSS need rebuilding, CSS builds first to ensure Tailwind classes are ready
 * - **Smart Triggers**: TypeScript/JSX changes trigger both JS and CSS rebuilds (for new Tailwind classes)
 * - **File Stability**: Waits for CSS files to stabilize before triggering reload
 * - **Race Condition Prevention**: Sequential CSS-first building prevents style reset issues
 *
 * ## Architecture
 *
 * ```
 * InSpatialServe
 * ├── BuildQueue           # Manages build operations with debouncing
 * ├── WebSocket Server     # Hot reload communication (port 8888)
 * ├── File Watcher         # Monitors source file changes
 * ├── HTTP Server          # Serves app files (port 6310)
 * └── Hot Reload Client    # Browser-side reload script
 * ```
 *
 * ## Hot Reload System
 *
 * - `InSpatialServe` - Native Development server for Bare InSpatial apps
 * - `InVite` - Vite plugin
 * - `InPack` - Webpack plugin
 * - Hot reload utilities
 *
 *
 * @author InSpatial
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Build queue to handle multiple file changes efficiently with debouncing.
 * Prevents excessive rebuilds when multiple files change rapidly.
 *
 * @internal
 */
class BuildQueue {
  private queue = new Set<"js" | "css" | "html">();
  private building = false;
  private buildTimer: number | undefined;

  add(buildType: "js" | "css" | "html") {
    this.queue.add(buildType);
    this.scheduleBuilds();
  }

  private scheduleBuilds() {
    if (this.buildTimer) {
      clearTimeout(this.buildTimer);
    }

    // Debounce builds by 100ms to handle rapid file changes
    this.buildTimer = setTimeout(() => {
      this.processBuildQueue();
    }, 100) as unknown as number;
  }

  private async processBuildQueue() {
    if (this.building || this.queue.size === 0) return;

    this.building = true;
    this.buildTimer = undefined;

    console.log(`🔨 Building: ${Array.from(this.queue).join(", ")}`);
    const builds = Array.from(this.queue);
    this.queue.clear();

    try {
      // If both JS and CSS need to be built, prioritize CSS first
      // This ensures CSS with new Tailwind classes is ready before JS
      if (builds.includes("css") && builds.includes("js")) {
        console.log(
          "🎯 CSS + JS build: Building CSS first for Tailwind classes"
        );
        await this.executeBuild("css");

        // Build remaining items in parallel
        const remainingBuilds = builds.filter((b) => b !== "css");
        const buildPromises = remainingBuilds.map((buildType) =>
          this.executeBuild(buildType)
        );
        await Promise.all(buildPromises);
      } else {
        // Build in parallel where possible
        const buildPromises = builds.map((buildType) =>
          this.executeBuild(buildType)
        );
        await Promise.all(buildPromises);
      }

      console.log("✅ Build completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Build failed:", error);
      return false;
    } finally {
      this.building = false;
    }
  }

  private async executeBuild(buildType: "js" | "css" | "html"): Promise<void> {
    switch (buildType) {
      case "js":
        return this.buildJavaScript();
      case "css":
        return this.buildCSS();
      case "html":
        return this.buildHTML();
    }
  }

  private async buildJavaScript(): Promise<void> {
    console.log("📦 Building JavaScript bundle...");

    const buildProcess = new InZero.Command("deno", {
      args: [
        "bundle",
        "--platform=browser",
        "--output=dist/bundle.js",
        "--sourcemap",
        "src/config/render.ts",
      ],
      cwd: InZero.cwd(),
    });

    const { code, stderr } = await buildProcess.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      throw new Error(`JavaScript build failed: ${errorText}`);
    }

    console.log("✅ JavaScript bundle built");
  }

  private async buildCSS(): Promise<void> {
    console.log("🎨 Building CSS...");

    // Base content globs always include the app sources
    const contentGlobs = ["src/**/*.{ts,tsx,js,jsx}"] as string[];

    // Conditionally include monorepo framework sources
    // Support both legacy path ../kit/src and current ../kit/modules
    try {
      const statSrc = await InZero.stat("../kit/src");
      // deno-lint-ignore no-explicit-any
      if ((statSrc as any)?.isDirectory) {
        contentGlobs.push("../kit/src/**/*.{ts,tsx,js,jsx}");
        console.log("📦 Including ../kit/src in Tailwind content globs");
      }
    } catch {}
    try {
      const statModules = await InZero.stat("../kit/modules");
      // deno-lint-ignore no-explicit-any
      if ((statModules as any)?.isDirectory) {
        contentGlobs.push("../kit/modules/**/*.{ts,tsx,js,jsx}");
        console.log("📦 Including ../kit/modules in Tailwind content globs");
      }
    } catch {}

    // Repeat --content per glob (Tailwind CLI expects individual flags)
    const contentArgs = ([] as string[]).concat(
      ...contentGlobs.map((g) => ["--content", g])
    );

    const buildProcess = new InZero.Command("deno", {
      args: [
        "run",
        "-A",
        "npm:@tailwindcss/cli@latest",
        "-i",
        "src/config/app.css",
        "-o",
        "dist/kit.css",
        ...contentArgs,
      ],
      cwd: InZero.cwd(),
    });

    const { code, stderr } = await buildProcess.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      throw new Error(`CSS build failed: ${errorText}`);
    }

    console.log("✅ CSS built");
  }

  private async buildHTML(): Promise<void> {
    console.log("📄 Copying HTML...");

    try {
      await InZero.copyFile("index.html", "dist/index.html");
      console.log("✅ HTML updated");
    } catch (error) {
      throw new Error(`HTML copy failed: ${error}`);
    }
  }

  isBuilding(): boolean {
    return this.building;
  }
}

/**
 * InSpatial Development Server
 *
 * A comprehensive development server that provides file serving, hot reload,
 * smart building, and file watching for InSpatial applications.
 *
 * ## Key Features:
 * - Automatic builds on file changes
 * - Hot reload via WebSocket
 * - Tailwind CSS v4 support with race condition prevention
 * - CSS-first building strategy
 * - File stability checking
 *
 * @example
 * ```typescript
 * // Basic usage
 * const server = new InSpatialServe();
 * await server.run();
 *
 * // One-liner usage
 * await new InSpatialServe().run();
 * ```
 *
 * @public
 */
export class InSpatialServe {
  private watchers: any[] = [];
  private clients: Set<WebSocket> = new Set();
  private isRunning = false;
  private buildQueue = new BuildQueue();
  private httpServer: any | null = null;
  private wsServer: any | null = null;

  /**
   * Runs the InSpatial Development Server
   *
   * This method initializes all components of the development server:
   * - Sets up the build environment and creates necessary directories
   * - runs the WebSocket server for hot reload communication
   * - Begins smart file watching for source changes
   * - Launches the HTTP server for serving application files
   * - Triggers initial builds for all assets
   *
   * @returns {Promise<void>} Resolves when the server is fully runed
   * @throws {Error} If server setup fails
   *
   * @example
   * ```typescript
   * const server = new InSpatialServe();
   * await server.run();
   * console.log("Server running at http://localhost:6310");
   * ```
   */
  async run() {
    const t0 = (globalThis as any).performance?.now?.() ?? Date.now();
    console.log("🔥 runing InSpatial development server...");

    // Ensure dist directory exists and is set up
    await this.initialSetup();

    // run WebSocket server for hot reload communication
    this.runWebSocketServer();

    // run file watching with intelligent build triggers
    this.runSmartWatching();

    // run file server
    this.runFileServer();

    this.isRunning = true;
    console.log("✅ InSpatial development server runed");
    const t1 = (globalThis as any).performance?.now?.() ?? Date.now();
    const readyMs = Math.round(t1 - t0);
    console.log(`🕒 Ready in ${readyMs}ms`);
  }

  private async initialSetup() {
    console.log("🏗️ Setting up build environment...");

    try {
      // Create dist directory if it doesn't exist

      await InZero.mkdir("dist", { recursive: true });
      await InZero.mkdir("dist/asset", { recursive: true });

      // Copy static assets
      try {
        await InZero.copyFile(
          "src/asset/favicon.png",
          "dist/asset/favicon.png"
        );
      } catch {
        console.log("⚠️ No favicon found, skipping...");
      }

      // Initial builds
      console.log("🔄 Running initial builds...");
      this.buildQueue.add("css");
      this.buildQueue.add("js");
      this.buildQueue.add("html");

      console.log("✅ Initial setup completed");
    } catch (error) {
      console.error("❌ Setup failed:", error);
      throw error;
    }
  }

  private runWebSocketServer() {
    const handler = (request: Request) => {
      const upgrade = request.headers.get("upgrade");
      if (upgrade !== "websocket") {
        return new Response("Not a websocket request", { status: 400 });
      }

      const { socket, response } = InZero.upgradeWebSocket(request);

      socket.onopen = () => {
        this.clients.add(socket);
        console.log(`🔌 New client connected (${this.clients.size} total)`);

        // Send welcome message
        socket.send(
          JSON.stringify({
            type: "connected",
            message: "InSpatial Development Server Connected",
          })
        );
      };

      socket.onclose = () => {
        this.clients.delete(socket);
        console.log(`🔌 Client disconnected (${this.clients.size} remaining)`);
      };

      return response;
    };

    const tryPorts = [8888, 8889, 8890];
    for (const p of tryPorts) {
      try {
        this.wsServer = InZero.serve({ port: p }, handler);
        console.log(`🔌 WebSocket server runed on port ${p}`);
        return;
      } catch (e) {
        console.warn(
          `⚠️ Failed to bind WS port ${p}:`,
          (e as any)?.message || e
        );
      }
    }
    throw new Error("Unable to bind WebSocket server on ports 8888-8890");
  }

  private runSmartWatching() {
    try {
      // Watch source files
      const srcWatcher = InZero.watchFs("./src", { recursive: true });
      this.watchers.push(srcWatcher);

      // Watch local framework/runtime sources when linked as a package (import map path)
      try {
        const runWatcher = InZero.watchFs("@inspatial/kit", {
          recursive: true,
        });
        this.watchers.push(runWatcher);
        (async () => {
          for await (const event of runWatcher) {
            await this.handleSourceChange(event);
          }
        })();
        console.log("👁️ Watching @inspatial/kit for framework changes");
      } catch {
        // optional; ignore if package path not present
      }

      // Conditionally also watch monorepo source (../kit/src or ../kit/modules) when present
      (async () => {
        try {
          const stat = await InZero.stat("../kit/src");
          // deno-lint-ignore no-explicit-any
          if ((stat as any)?.isDirectory) {
            const kitWatcher = InZero.watchFs("../kit/src", {
              recursive: true,
            });
            this.watchers.push(kitWatcher);
            (async () => {
              for await (const event of kitWatcher) {
                await this.handleSourceChange(event);
              }
            })();
            console.log("👁️ Watching ../kit/src for framework changes");
          }
        } catch {}
        try {
          const stat = await InZero.stat("../kit/modules");
          // deno-lint-ignore no-explicit-any
          if ((stat as any)?.isDirectory) {
            const kitWatcher = InZero.watchFs("../kit/modules", {
              recursive: true,
            });
            this.watchers.push(kitWatcher);
            (async () => {
              for await (const event of kitWatcher) {
                await this.handleSourceChange(event);
              }
            })();
            console.log("👁️ Watching ../kit/modules for framework changes");
          }
        } catch {}
      })();

      // Watch root files (index.html, etc.)
      const rootWatcher = InZero.watchFs("./", { recursive: false });
      this.watchers.push(rootWatcher);

      // Process source file changes
      (async () => {
        for await (const event of srcWatcher) {
          await this.handleSourceChange(event);
        }
      })();

      // Process root file changes
      (async () => {
        for await (const event of rootWatcher) {
          await this.handleRootChange(event);
        }
      })();

      console.log("👁️ Smart file watching runed");
    } catch (error) {
      console.error("❌ Failed to run file watching:", error);
    }
  }

  private async handleSourceChange(event: any) {
    if (event.kind !== "modify" && event.kind !== "create") return;

    const relevantFiles = event.paths.filter(
      (path: string) =>
        /\.(ts|tsx|js|jsx|css|scss)$/.test(path) &&
        !path.includes("node_modules") &&
        !path.includes(".git") &&
        !path.includes("dist")
    );

    // Detect asset file changes (images, etc.) under src
    const assetFiles = event.paths.filter(
      (path: string) =>
        /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(path) &&
        path.includes("/src/") &&
        !path.includes("dist")
    );

    if (relevantFiles.length === 0 && assetFiles.length === 0) return;

    console.log(
      `📝 Source files changed: ${[...relevantFiles, ...assetFiles]
        .map((p: string) =>
          p.replace((globalThis as any).Deno?.cwd?.() ?? "", ".")
        )
        .join(", ")}`
    );

    // Determine what needs to be rebuilt
    const needsJS = relevantFiles.some((file: string) =>
      /\.(ts|tsx|js|jsx)$/.test(file)
    );
    const needsCSS = relevantFiles.some((file: string) =>
      /\.(css|scss)$/.test(file)
    );

    // IMPORTANT: Always rebuild CSS when TypeScript/JSX files change
    // because they might contain new Tailwind classes that need to be generated
    const needsCSSForTailwind = relevantFiles.some((file: string) =>
      /\.(ts|tsx|js|jsx)$/.test(file)
    );

    // If only assets changed, notify clients without triggering builds
    if (!needsJS && !needsCSS && assetFiles.length > 0) {
      await this.notifyClients();
      return;
    }

    if (needsJS) {
      this.buildQueue.add("js");
      console.log("🔨 Queuing JavaScript rebuild");
    }
    if (needsCSS || needsCSSForTailwind) {
      this.buildQueue.add("css");
      if (needsCSSForTailwind && !needsCSS) {
        console.log("🎨 Queuing CSS rebuild (for new Tailwind classes)");
      } else if (needsCSS) {
        console.log("🎨 Queuing CSS rebuild (CSS file changed)");
      }
    }

    // Wait for builds to complete, then notify clients
    await this.waitForBuildAndNotify();
  }

  private async handleRootChange(event: any) {
    if (event.kind !== "modify" && event.kind !== "create") return;

    const htmlFiles = event.paths.filter(
      (path: string) => path.endsWith(".html") && !path.includes("dist")
    );

    if (htmlFiles.length > 0) {
      console.log("📄 HTML files changed, updating...");
      this.buildQueue.add("html");
      await this.waitForBuildAndNotify();
    }
  }

  private async waitForBuildAndNotify() {
    // Wait a bit for the build queue to process
    let attempts = 0;
    while (this.buildQueue.isBuilding() && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (attempts >= 50) {
      console.error("⏰ Build timeout, notifying clients anyway");
    }

    // Add extra delay to ensure CSS files are fully written to disk
    // This prevents race conditions where JS completes before CSS is available
    console.log("⏳ Ensuring all builds are complete...");
    await this.ensureCSSIsReady();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Notify all connected clients
    await this.notifyClients();
  }

  private async ensureCSSIsReady(): Promise<void> {
    // Wait for CSS file to be written and stabilized
    try {
      const cssPath = "./dist/kit.css";
      let attempts = 0;
      let lastSize = 0;

      while (attempts < 10) {
        try {
          const stat = await InZero.stat(cssPath);
          const currentSize = stat.size;

          // If file size hasn't changed in the last 100ms, consider it stable
          if (currentSize === lastSize && attempts > 0) {
            console.log("📄 CSS file is stable");
            break;
          }

          lastSize = currentSize;
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        } catch {
          // File might not exist yet, wait a bit
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not check CSS file stability:", error);
    }
  }

  private notifyClients() {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({
      type: "reload",
      timestamp: Date.now(),
    });

    const deadClients: WebSocket[] = [];

    for (const client of this.clients) {
      try {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        } else {
          deadClients.push(client);
        }
      } catch (error) {
        console.warn("Failed to notify client:", error);
        deadClients.push(client);
      }
    }

    // Clean up dead connections
    deadClients.forEach((client) => this.clients.delete(client));

    console.log(`🔄 Notified ${this.clients.size} clients to reload`);
    // Notify any in-process listeners (e.g., virtual manifest consumers)
    try {
      const CE = (globalThis as any).CustomEvent;
      const dispatch = (globalThis as any).dispatchEvent;
      if (CE && dispatch) {
        const evt = new CE("inroute:manifest:updated");
        dispatch(evt);
      }
    } catch {
      // best-effort notification only
    }
  }

  private runFileServer() {
    const handler = async (request: Request) => {
      const url = new URL(request.url);
      let pathname = url.pathname;

      // Default to index.html
      if (pathname === "/") {
        pathname = "/index.html";
      }

      // Dev asset handler: serve /asset/* from dist first, then src as fallback
      if (pathname.startsWith("/asset/")) {
        const safeRel = pathname.replace(/^\/asset\//, "");
        // Disallow path traversal
        if (safeRel.includes("..")) {
          return new Response("400 - Bad Request", { status: 400 });
        }
        const tryServe = async (base: string) => {
          try {
            const filePath = `${base}/${safeRel}`;
            const content = await InZero.readFile(filePath);
            const contentType = this.getContentType(pathname);
            const headers = new Headers({ "Content-Type": contentType });
            // Dev cache policy: avoid stale assets during development
            headers.set("Cache-Control", "no-store");
            return new Response(content, { headers });
          } catch {
            return null;
          }
        };
        // Prefer built assets (parity with production)
        const fromDist = await tryServe("./dist/asset");
        if (fromDist) return fromDist;
        // Fallback to source assets during dev
        const fromSrc = await tryServe("./src/asset");
        if (fromSrc) return fromSrc;
        console.log(`❌ Asset not found: ${pathname}`);
        return new Response("404 - Asset Not Found", { status: 404 });
      }

      try {
        // Serve from dist directory
        const filePath = `./dist${pathname}`;
        const content = await InZero.readFile(filePath);

        // Inject InSpatial hot reload client for HTML files
        if (pathname.endsWith(".html")) {
          const textContent = new TextDecoder().decode(content);
          const wsPort = (this.wsServer as any)?.addr?.port || 8888;
          const modifiedContent = textContent.replace(
            "</body>",
            `
            <script>
              // InSpatial Hot Reload Client
              const ws = new WebSocket('ws://localhost:${wsPort}');
              ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'reload') {
                  console.log('🔥 InSpatial: Reloading...');
                  window.location.reload();
                }
              };
              ws.onopen = () => console.log('🔌 InSpatial: Connected to hot reload');
              ws.onclose = () => console.log('❌ InSpatial: Disconnected from hot reload');
            </script>
            </body>`
          );
          return new Response(modifiedContent, {
            headers: { "Content-Type": "text/html" },
          });
        }

        const contentType = this.getContentType(pathname);

        return new Response(content, {
          headers: { "Content-Type": contentType },
        });
      } catch (_error) {
        // SPA fallback: if not a direct file (no extension), serve index.html
        const hasExtension = pathname.includes(".");
        if (!hasExtension) {
          try {
            const indexContent = await InZero.readFile("./dist/index.html");
            const textContent = new TextDecoder().decode(indexContent);
            const wsPort = (this.wsServer as any)?.addr?.port || 8888;
            const modifiedContent = textContent.replace(
              "</body>",
              `
              <script>
                // InSpatial Hot Reload Client (SPA fallback)
                const ws = new WebSocket('ws://localhost:${wsPort}');
                ws.onmessage = (event) => {
                  const data = JSON.parse(event.data);
                  if (data.type === 'reload') {
                    console.log('🔥 InSpatial: Reloading...');
                    window.location.reload();
                  }
                };
                ws.onopen = () => console.log('🔌 InSpatial: Connected to hot reload');
                ws.onclose = () => console.log('❌ InSpatial: Disconnected from hot reload');
              </script>
              </body>`
            );
            return new Response(modifiedContent, {
              headers: { "Content-Type": "text/html" },
            });
          } catch {
            // fallthrough to 404 if index.html missing
          }
        }
        console.log(`❌ File not found: ${pathname}`);
        return new Response("404 - File Not Found", { status: 404 });
      }
    };

    const tryPorts = [6310, 6311, 6312];
    for (const p of tryPorts) {
      try {
        this.httpServer = InZero.serve({ port: p }, handler);
        console.log(`🌐 InSpatial app running at http://localhost:${p}`);
        const wsPort = (this.wsServer as any)?.addr?.port || 8888;
        console.log(`🔥 Hot reload enabled via WebSocket on port ${wsPort}`);
        console.log("✨ Ready for development!");
        return;
      } catch (e) {
        console.warn(
          `⚠️ Failed to bind HTTP port ${p}:`,
          (e as any)?.message || e
        );
      }
    }
    throw new Error("Unable to bind HTTP server on ports 6310-6312");
  }

  private getContentType(pathname: string): string {
    const ext = pathname.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "html":
        return "text/html";
      case "css":
        return "text/css";
      case "js":
        return "application/javascript";
      case "json":
        return "application/json";
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "svg":
        return "image/svg+xml";
      case "webp":
        return "image/webp";
      case "avif":
        return "image/avif";
      default:
        return "text/plain";
    }
  }
}
