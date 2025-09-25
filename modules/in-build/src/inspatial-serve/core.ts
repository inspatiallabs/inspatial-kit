// deno-lint-ignore-file no-empty
import { InZero } from "@in/zero";
import { resolveServeConfig } from "./config.ts";
import type { InServeResolvedConfig } from "./type.ts";

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
 */

/**
 * Build queue to handle multiple file changes efficiently with debouncing.
 * Prevents excessive rebuilds when multiple files change rapidly.
 *
 * @internal
 */
class BuildQueue {
  private getConfig: () => InServeResolvedConfig;
  private onMemoryArtifactsUpdate?: (
    artifacts: Map<string, Uint8Array>
  ) => void;
  constructor(
    getConfig: () => InServeResolvedConfig,
    onMemoryArtifactsUpdate?: (artifacts: Map<string, Uint8Array>) => void
  ) {
    this.getConfig = getConfig;
    this.onMemoryArtifactsUpdate = onMemoryArtifactsUpdate;
  }
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

    // Debounce builds per configuration to handle rapid file changes
    this.buildTimer = setTimeout(() => {
      this.processBuildQueue();
    }, this.getConfig().build.timing.debounceMs) as unknown as number;
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

  private executeBuild(buildType: "js" | "css" | "html"): Promise<void> {
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
    const cfg = this.getConfig();
    const entries =
      cfg.build.js.entrypoints && cfg.build.js.entrypoints.length > 0
        ? cfg.build.js.entrypoints
        : [cfg.paths.renderEntry];

    // Try inprocess bundling if requested and available
    // deno-lint-ignore no-explicit-any
    const D = (globalThis as any).Deno;
    if (cfg.build.js.engine === "inprocess" && D?.bundle) {
      try {
        const result = await D.bundle({
          entrypoints: entries,
          outputDir: cfg.build.js.outputDir || cfg.paths.distDir,
          output: cfg.build.js.output || undefined,
          platform: cfg.build.js.platform,
          minify: cfg.build.js.minify,
          codeSplitting: cfg.build.js.codeSplitting,
          format: cfg.build.js.format,
          inlineImports: cfg.build.js.inlineImports,
          external: cfg.build.js.external,
          packages: cfg.build.js.packages,
          sourcemap: cfg.build.js.sourcemap,
          write: cfg.build.js.write,
        });
        if (!cfg.build.js.write) {
          // Capture outputs in memory for serving
          const artifacts = new Map<string, Uint8Array>();
          const files = (result as any)?.outputFiles as Array<any> | undefined;
          if (files && Array.isArray(files)) {
            for (const f of files) {
              try {
                let bytes: Uint8Array | undefined;
                if (f?.bytes) bytes = f.bytes as Uint8Array;
                if (!bytes) {
                  let text: string | undefined;
                  try {
                    text = typeof f?.text === "function" ? f.text() : undefined;
                  } catch {}
                  if (text) bytes = new TextEncoder().encode(text);
                }
                if (!bytes) continue;
                const raw: string = (
                  f?.path ||
                  f?.filePath ||
                  f?.name ||
                  ""
                ).toString();
                const normalized = raw.replace(/\\/g, "/");
                const fileName = normalized
                  ? normalized.substring(normalized.lastIndexOf("/") + 1)
                  : "bundle.js";
                const key = `/${fileName}`;
                artifacts.set(key, bytes);
              } catch {}
            }
          }
          this.onMemoryArtifactsUpdate?.(artifacts);
          console.log(`🧠 Runtime bundle (in-memory): ${artifacts.size} files`);
        }
        console.log("✅ JavaScript bundle built (runtime)");
        return;
      } catch (err) {
        console.warn(
          "⚠️ Runtime bundling failed, falling back to CLI:",
          (err as any)?.message || err
        );
      }
    }

    // CLI fallback
    const args: string[] = ["bundle"];
    if (cfg.build.js.platform) args.push(`--platform=${cfg.build.js.platform}`);
    if (cfg.build.js.sourcemap) args.push("--sourcemap");
    if (cfg.build.js.minify) args.push("--minify");
    if (cfg.build.js.codeSplitting) args.push("--code-splitting");
    if (cfg.build.js.format) args.push(`--format=${cfg.build.js.format}`);
    if (cfg.build.js.inlineImports) args.push("--inline-imports");

    const isHtml =
      entries.length === 1 && entries[0].toLowerCase().endsWith(".html");
    if (isHtml) {
      args.push("--outdir", cfg.build.js.outputDir || cfg.paths.distDir);
      args.push(entries[0]);
    } else {
      const out = cfg.paths.jsOutput;
      args.push("--output", out);
      // For multiple entries, we run one-by-one into outputDir when possible; for now, pick the first.
      args.push(entries[0]);
    }

    const buildProcess = new InZero.Command("deno", {
      args,
      cwd: InZero.cwd(),
    });
    const { code, stderr } = await buildProcess.output();
    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      throw new Error(`JavaScript build failed: ${errorText}`);
    }
    console.log("✅ JavaScript bundle built (subprocess)");
  }

  private async buildCSS(): Promise<void> {
    console.log("🎨 Building CSS...");
    const cfg = this.getConfig();
    const engine = (cfg.build.css as any).engine || "iss";

    if (engine === "tailwind") {
      const contentGlobs = [...cfg.build.css.contentGlobs];
      // Augment with kitRoots if developer didn't already specify
      for (const root of cfg.discovery.kitRoots || []) {
        const glob = `${root.replace(/\/$/, "")}/**/*.{ts,tsx,js,jsx}`;
        if (!contentGlobs.includes(glob)) contentGlobs.push(glob);
      }
      const contentArgs = ([] as string[]).concat(
        ...contentGlobs.map((g) => ["--content", g])
      );

      const buildProcess = new InZero.Command("deno", {
        args: [
          "run",
          "-A",
          "npm:@tailwindcss/cli@latest",
          "-i",
          cfg.build.css.input,
          "-o",
          cfg.build.css.output,
          ...contentArgs,
        ],
        cwd: InZero.cwd(),
      });

      const { code, stderr } = await buildProcess.output();

      if (code !== 0) {
        const errorText = new TextDecoder().decode(stderr);
        throw new Error(`CSS build failed: ${errorText}`);
      }
      console.log("✅ CSS built (tailwind)");
      return;
    }

    // iss/none engines: do not invoke tailwind; ensure output exists
    try {
      // Read input if present
      let inputCss = "";
      try {
        inputCss = await InZero.readTextFile(cfg.build.css.input);
      } catch {}

      if (inputCss) {
        const hasTailwindImport = /@import\s+["']tailwindcss["']/.test(
          inputCss
        );
        const hasApply = /@apply\b/.test(inputCss);
        const hasTheme = /@theme\b/.test(inputCss);
        const hasCustomVariant = /@custom-variant\b/.test(inputCss);

        // Strip tailwind import lines only; pass through the rest
        const stripped = inputCss
          .split(/\n/)
          .filter((line) => !/@import\s+["']tailwindcss["']/.test(line))
          .join("\n");

        if (
          engine !== "tailwind" &&
          (hasTailwindImport || hasApply || hasTheme || hasCustomVariant)
        ) {
          console.warn(
            "[InServe] Tailwind-only directives detected in CSS but engine='iss/none'. Consider engine=\"tailwind\" or migrate to runtime styles. Found:",
            {
              importTailwind: hasTailwindImport,
              apply: hasApply,
              theme: hasTheme,
              customVariant: hasCustomVariant,
            }
          );
        }

        await InZero.writeTextFile(cfg.build.css.output, stripped);
      } else {
        // Ensure output exists even if no input
        await InZero.writeTextFile(
          cfg.build.css.output,
          "/* InSpatial runtime CSS placeholder */\n"
        );
      }
      console.log(`✅ CSS prepared (${engine})`);
    } catch (e) {
      throw new Error(`CSS prepare failed (${engine}): ${e}`);
    }
  }

  private async buildHTML(): Promise<void> {
    console.log("📄 Copying HTML...");
    const cfg = this.getConfig();
    // If inprocess HTML entrypoints are enabled, Deno.bundle will manage HTML outputs; skip copy
    const entries =
      cfg.build.js.entrypoints && cfg.build.js.entrypoints.length > 0
        ? cfg.build.js.entrypoints
        : [cfg.paths.renderEntry];
    const isRuntimeHtml =
      cfg.build.js.engine === "inprocess" &&
      cfg.build.js.htmlEntrypoints &&
      entries.length === 1 &&
      entries[0].toLowerCase().endsWith(".html");
    if (isRuntimeHtml) {
      console.log("ℹ️ Skipping HTML copy (managed by runtime bundler)");
      return;
    }
    try {
      // Try copying user-provided HTML if present
      try {
        await InZero.copyFile(cfg.paths.htmlEntry, cfg.paths.htmlDist);
        console.log("✅ HTML updated");
        return;
      } catch {}

      // Generate a minimal HTML if no entry file exists
      const html = `<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <title>InSpatial App</title>\n  <link rel=\"stylesheet\" href=\"/kit.css\" />\n</head>\n<body>\n  <div id=\"app\"></div>\n  <script type=\"module\" src=\"/bundle.js\"></script>\n</body>\n</html>`;
      await InZero.writeTextFile(cfg.paths.htmlDist, html);
      console.log("ℹ️ No htmlEntry found. Generated minimal dist/index.html");
    } catch (error) {
      throw new Error(`HTML copy/generate failed: ${error}`);
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
  private buildQueue!: BuildQueue;
  private httpServer: any | null = null;
  private wsServer: any | null = null;
  private extensionTriggers: Map<string, any> = new Map();
  private generatingTypes = false;
  private config!: InServeResolvedConfig;
  private memoryArtifacts: Map<string, Uint8Array> = new Map();

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

    // Load configuration
    this.config = await resolveServeConfig();
    this.buildQueue = new BuildQueue(
      () => this.config,
      (artifacts) => {
        // atomic swap of in-memory artifacts for serving
        this.memoryArtifacts = artifacts;
      }
    );

    // Ensure dist directory exists and is set up
    await this.initialSetup();

    // Scan extensions and generate trigger types
    await this.scanExtensionsAndGenerateTypes();

    // run WebSocket server for hot reload communication
    this.runWebSocketServer();

    // run file watching with intelligent build triggers
    this.runSmartWatching();

    // run file server
    this.runFileServer();

    this.isRunning = true;
    // Startup summary
    const summary = {
      httpPorts: this.config.server.httpPorts,
      wsPorts: this.config.server.wsPorts,
      host: this.config.server.host,
      engine: this.config.build.js.engine,
      entrypoints:
        this.config.build.js.entrypoints &&
        this.config.build.js.entrypoints.length > 0
          ? this.config.build.js.entrypoints
          : [this.config.paths.renderEntry],
      dist: this.config.paths.distDir,
    };
    console.log("✅ InSpatial development server is running");
    console.log(`⚙️ Config: ${JSON.stringify(summary)}`);
    const t1 = (globalThis as any).performance?.now?.() ?? Date.now();
    const readyMs = Math.round(t1 - t0);
    console.log(`🕒 Ready in ${readyMs}ms`);
  }

  private async scanExtensionsAndGenerateTypes() {
    console.log("🔍 Scanning extensions for trigger declarations...");

    try {
      if (this.generatingTypes) return; // prevent re-entrancy
      this.generatingTypes = true;
      // Scan for render.ts file using configured entry and search candidates
      let renderPath: string | null = null;
      const cfg = this.config;
      const candidates = [cfg.paths.renderEntry, ...cfg.discovery.renderSearch];

      for (const path of candidates) {
        try {
          await InZero.stat(path);
          renderPath = path;
          console.log(`📄 Found render.ts at: ${path}`);
          break;
        } catch {
          // File doesn't exist, try next
        }
      }

      if (!renderPath) {
        console.log(
          "⚠️ No render.ts file found, skipping trigger type generation"
        );
        return;
      }

      // Discovered extension identifiers → import specifiers
      const importMap: Record<string, string> = {};
      // Discovered extension type files to reference
      const discoveredTypeFiles: string[] = [];

      try {
        const renderContent = await InZero.readTextFile(renderPath);

        // 1) Parse import statements: build identifier → specifier map
        const importRegex = /import\s+([^;]+?)\s+from\s+["']([^"']+)["'];?/g;
        let match: RegExpExecArray | null;
        while ((match = importRegex.exec(renderContent))) {
          const bindings = match[1];
          const specifier = match[2];
          const namedMatch = bindings.match(/\{([^}]+)\}/);
          if (namedMatch) {
            const names = namedMatch[1]
              .split(",")
              .map((s) => s.trim().split(" as ")[1] || s.trim());
            for (const name of names) {
              if (name) importMap[name] = specifier;
            }
          } else {
            const defaultName = bindings.trim();
            if (defaultName) importMap[defaultName] = specifier;
          }
        }

        // 2) Parse extensions array from createRenderer call
        const createRendererMatch = renderContent.match(
          /createRenderer\s*\(\s*\{[\s\S]*?extensions\s*:\s*\[([\s\S]*?)\]/
        );
        if (!createRendererMatch) {
          console.log("⚠️ No extensions array found in createRenderer");
          return;
        }
        const extensionsContent = createRendererMatch[1];

        // 3) Extract identifiers used in extensions array (tokens followed by '(')
        const idRegex = /([A-Za-z_$][\w$]*)\s*\(/g;
        const extensionIds = new Set<string>();
        let idMatch: RegExpExecArray | null;
        while ((idMatch = idRegex.exec(extensionsContent))) {
          extensionIds.add(idMatch[1]);
        }

        // 4) Resolve each identifier to its specifier and locate its type files
        //    Strategy:
        //      a) Use app deno.json "imports" to map specifier → filesystem path
        //      b) Heuristic for monorepo @inspatial/kit/* → ../kit/modules/in-*/
        //      c) Within the resolved root, use declared inspatial.triggerTypes (if any)
        //      d) Fallback to common conventions: src/types.d.ts, src/trigger-types.d.ts, types.d.ts

        // Load app imports map (best-effort)
        let appImports: Record<string, string> = {};
        try {
          const denoJson = await InZero.readTextFile("./deno.json");
          const denoCfg = JSON.parse(denoJson || "{}");
          appImports = denoCfg?.imports || {};
        } catch {
          // best-effort: app import map may be missing
        }

        const resolveSpecifierToPath = async (
          specifier: string
        ): Promise<string | null> => {
          // a) Try direct mapping via imports
          for (const key of Object.keys(appImports)) {
            if (specifier === key || specifier.startsWith(key)) {
              const mapped = appImports[key];
              const remainder = specifier.slice(key.length);
              const resolved = mapped.replace(/\/$/, "") + remainder;
              try {
                const stat = await InZero.stat(resolved);
                // deno-lint-ignore no-explicit-any
                if ((stat as any)?.isDirectory) {
                  return resolved;
                } else if ((stat as any)?.isFile) {
                  // If it's a file, return its directory
                  const normalized = resolved.replace(/\\/g, "/");
                  const dir = normalized.substring(
                    0,
                    normalized.lastIndexOf("/")
                  );
                  return dir;
                }
              } catch {}
            }
          }
          // b) Heuristic for monorepo @inspatial/kit/* → ../kit/modules/in-*/
          if (specifier.startsWith("@inspatial/kit/")) {
            const name = specifier.split("/").pop() || "";
            const moduleDir = `../kit/modules/in-${name}`;
            try {
              // deno-lint-ignore no-explicit-any
              const stat = await InZero.stat(moduleDir);
              if ((stat as any)?.isDirectory) return moduleDir;
            } catch {}
          }
          return null;
        };

        const tryDiscoverTypeFiles = async (
          rootDir: string
        ): Promise<string[]> => {
          const candidates: string[] = [];
          // c) Read deno.json/package.json for inspatial.triggerTypes
          const tryConfigs = ["deno.json", "package.json"];
          for (const cfg of tryConfigs) {
            try {
              const text = await InZero.readTextFile(`${rootDir}/${cfg}`);
              const json = JSON.parse(text || "{}");
              const triggerTypes = json?.inspatial?.triggerTypes as
                | string
                | string[]
                | undefined;
              if (triggerTypes) {
                const arr = Array.isArray(triggerTypes)
                  ? triggerTypes
                  : [triggerTypes];
                for (const rel of arr) candidates.push(`${rootDir}/${rel}`);
                break;
              }
            } catch {}
          }
          // d) If no explicit paths declared, recursively discover in rootDir
          //    Search for files exporting: `export interface ExtensionTriggerTypes`
          async function listDir(
            path: string
          ): Promise<Array<{ name: string; isFile: boolean; isDir: boolean }>> {
            const out: Array<{
              name: string;
              isFile: boolean;
              isDir: boolean;
            }> = [];
            try {
              // Try Deno.readDir if available
              if (InZero.readDir) {
                for await (const ent of InZero.readDir(path)) {
                  out.push({
                    name: ent.name,
                    isFile: !!ent.isFile,
                    isDir: !!ent.isDirectory,
                  });
                }
              }
            } catch {}
            return out;
          }

          async function existsFile(file: string): Promise<boolean> {
            try {
              // deno-lint-ignore no-explicit-any
              const stat = await InZero.stat(file);
              // deno-lint-ignore no-explicit-any
              return !!(stat as any)?.isFile;
            } catch {
              return false;
            }
          }

          async function readText(file: string): Promise<string> {
            try {
              return await InZero.readTextFile(file);
            } catch {
              return "";
            }
          }

          const discovered: string[] = [];
          const visited = new Set<string>();
          const ignoreDirs = new Set([
            "node_modules",
            "dist",
            ".git",
            ".cache",
            ".next",
            "build",
          ]);
          const maxDepth = 6;
          const maxFiles = 200; // safety cap

          async function walk(dir: string, depth: number): Promise<void> {
            if (discovered.length >= maxFiles) return;
            if (depth > maxDepth) return;
            const norm = dir.replace(/\\/g, "/");
            if (visited.has(norm)) return;
            visited.add(norm);
            const entries = await listDir(norm);
            for (const ent of entries) {
              const p = `${norm}/${ent.name}`;
              if (ent.isDir) {
                if (!ignoreDirs.has(ent.name)) await walk(p, depth + 1);
              } else if (ent.isFile && p.endsWith(".d.ts")) {
                // quick check content
                const src = await readText(p);
                if (/export\s+interface\s+ExtensionTriggerTypes\b/.test(src)) {
                  discovered.push(p);
                }
              }
              if (discovered.length >= maxFiles) break;
            }
          }

          // prefer declared config file list first; if none found, do discovery
          // Build explicit candidate list from known conventional file names at root levels (non-hardcoded deeper paths)
          const conventional = [
            "types.d.ts",
            "trigger-types.d.ts",
            "trigger.types.d.ts",
            "src/types.d.ts",
            "src/trigger-types.d.ts",
            "src/trigger.types.d.ts",
          ];
          for (const rel of conventional) candidates.push(`${rootDir}/${rel}`);

          const existing: string[] = [];
          for (const file of candidates) {
            if (await existsFile(file)) {
              const src = await readText(file);
              if (/export\s+interface\s+ExtensionTriggerTypes\b/.test(src))
                existing.push(file);
            }
          }

          if (existing.length > 0) return existing;

          // Fallback: recursive discovery
          await walk(rootDir.replace(/\\/g, "/"), 0);
          return discovered;
        };

        for (const id of Array.from(extensionIds)) {
          const spec = importMap[id];
          if (!spec) continue;
          const resolvedRoot = await resolveSpecifierToPath(spec);
          if (!resolvedRoot) continue;
          const typeFiles = await tryDiscoverTypeFiles(resolvedRoot);
          for (const f of typeFiles) {
            if (!discoveredTypeFiles.includes(f)) discoveredTypeFiles.push(f);
          }
        }

        // 5) App-level override: add files from resolved config
        try {
          const list = this.config.appTriggerTypes || [];
          for (const p of list) {
            try {
              const st = await InZero.stat(p);
              // deno-lint-ignore no-explicit-any
              const isFile = !!(st as any)?.isFile;
              if (isFile && !discoveredTypeFiles.includes(p)) {
                discoveredTypeFiles.push(p);
              }
            } catch {}
          }
        } catch {}

        // Generate extension trigger types and an optional aggregator for external files
        const outDir = "./src/types";
        try {
          await InZero.mkdir(outDir, { recursive: true });
        } catch {}

        // Always regenerate with CURRENT extensions only
        const mkExtendsFromFiles = async (
          files: string[]
        ): Promise<{ imports: string; extendsList: string }> => {
          const importLines: string[] = [];
          const aliasNames: string[] = [];
          let idx = 0;
          const stripComments = (s: string): string =>
            s
              .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
              .replace(/^\s*\/\/.*$/gm, ""); // line comments

          for (const f of files) {
            try {
              // Verify the file actually exports the interface before importing
              try {
                const src = await InZero.readTextFile(f);
                const decommented = stripComments(src);
                if (
                  !/export\s+interface\s+ExtensionTriggerTypes\b/.test(
                    decommented
                  )
                ) {
                  continue;
                }
              } catch {}
              const normalized = f.replace(/\\/g, "/");
              // Try to map absolute/relative file path to an import specifier using appImports
              let specifier: string | null = null;
              // Prefer longer mapped paths first
              const entries = Object.entries(appImports).sort(
                (a, b) => (b[1] || "").length - (a[1] || "").length
              );
              for (const [key, mappedPath] of entries) {
                const base = (mappedPath || "").replace(/\/$/, "");
                if (base && normalized.startsWith(base)) {
                  const remainder = normalized.slice(base.length);
                  specifier = key.replace(/\/$/, "") + remainder;
                  break;
                }
              }
              if (!specifier) {
                // Fallback: if already looks like an import map path, use as-is
                specifier = normalized;
              }
              const alias = `T${idx++}`;
              importLines.push(
                `import type { ExtensionTriggerTypes as ${alias} } from "${specifier}";`
              );
              aliasNames.push(alias);
            } catch {}
          }
          const imports = importLines.join("\n");
          const extendsList = aliasNames.length
            ? ` extends ${aliasNames.join(", ")} `
            : " ";
          return { imports, extendsList };
        };

        const { imports, extendsList } = await mkExtendsFromFiles(
          discoveredTypeFiles
        );
        const extensionTriggerTypes = `// Auto-generated by InSpatial Serve – DO NOT EDIT
// This file is regenerated on each build when extensions change
${imports ? imports + "\n\n" : ""}declare global {
  namespace InSpatial {
    interface ExtensionTriggers${extendsList}{ }
  }
}
export {};
`;

        const outFile = `${outDir}/extension-trigger-types.generated.d.ts`;
        let shouldWrite = true;
        try {
          const prev = await InZero.readTextFile(outFile);
          if (prev === extensionTriggerTypes) shouldWrite = false;
        } catch {}
        if (shouldWrite) {
          await InZero.writeTextFile(outFile, extensionTriggerTypes);
          console.log(
            `✅ Generated global extension trigger types with ${discoveredTypeFiles.length} source file(s)`
          );
        } else {
          console.log("ℹ️ Extension trigger types unchanged (no write)");
        }
      } catch (e) {
        console.warn("⚠️ Could not scan render.ts for extensions:", e);
      }
    } catch (error) {
      console.error("❌ Failed to generate trigger types:", error);
    } finally {
      this.generatingTypes = false;
    }
  }

  private async initialSetup() {
    console.log("🏗️ Setting up build environment...");

    try {
      // Create dist directory if it doesn't exist
      const cfg = this.config;
      await InZero.mkdir(cfg.paths.distDir, { recursive: true });
      await InZero.mkdir(cfg.paths.assetDistDir, { recursive: true });

      // Copy static assets
      try {
        await InZero.copyFile(
          cfg.paths.favicon,
          `${cfg.paths.assetDistDir}/favicon.png`
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

    const tryPorts = this.config.server.wsPorts;
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
      const cfg = this.config;
      // Watch include roots
      const srcWatchers: any[] = [];
      for (const root of cfg.watch.include) {
        try {
          const w = InZero.watchFs(root, { recursive: true });
          this.watchers.push(w);
          srcWatchers.push(w);
        } catch {}
      }

      // Watch framework/runtime sources
      for (const root of cfg.watch.includeFramework) {
        try {
          const runWatcher = InZero.watchFs(root, { recursive: true });
          this.watchers.push(runWatcher);
          (async () => {
            for await (const event of runWatcher) {
              await this.handleSourceChange(event);
            }
          })();
          console.log(`👁️ Watching ${root} for framework changes`);
        } catch {}
      }

      // Watch root directory shallow (for html entry changes)
      try {
        const rootWatcher = InZero.watchFs("./", { recursive: false });
        this.watchers.push(rootWatcher);
        (async () => {
          for await (const event of rootWatcher) {
            await this.handleRootChange(event);
          }
        })();
      } catch {}

      // Process source file changes
      for (const w of srcWatchers) {
        (async () => {
          for await (const event of w) {
            await this.handleSourceChange(event);
          }
        })();
      }

      console.log("👁️ Smart file watching runed");
    } catch (error) {
      console.error("❌ Failed to run file watching:", error);
    }
  }

  private async handleSourceChange(event: any) {
    if (event.kind !== "modify" && event.kind !== "create") return;

    const normalizedPaths: string[] = event.paths.map((p: string) =>
      p.replace(/\\/g, "/")
    );

    const relevantFiles = normalizedPaths.filter(
      (path: string) =>
        /\.(ts|tsx|js|jsx|css|scss)$/.test(path) &&
        !path.endsWith(".d.ts") &&
        !path.includes("node_modules") &&
        !path.includes(".git") &&
        !path.includes("/dist/")
    );

    // Check if render.ts changed (extensions may have changed)
    const renderChanged = normalizedPaths.some((path: string) =>
      path.endsWith("/render.ts")
    );

    if (renderChanged) {
      console.log(
        "📝 Extensions may have changed, regenerating trigger types..."
      );
      await this.scanExtensionsAndGenerateTypes();
    }

    // Detect asset file changes (images, etc.) under src
    const assetFiles = normalizedPaths.filter(
      (path: string) =>
        /\.(png|jpe?g|gif|svg|webp|avif|wgsl)$/i.test(path) &&
        path.includes("/src/") &&
        !path.includes("/dist/")
    );

    if (relevantFiles.length === 0 && assetFiles.length === 0) return;

    console.log(
      `📝 Source files changed: ${[...relevantFiles, ...assetFiles]
        .map((p: string) =>
          p.replace((globalThis as any).Deno?.cwd?.() ?? "", ".")
        )
        .join(", ")}`
    );

    // If only the generated extension types changed, skip rebuilds to avoid loops
    const onlyGeneratedTypesChanged =
      relevantFiles.length === 1 &&
      relevantFiles[0].endsWith(
        "/src/types/extension-trigger-types.generated.d.ts"
      );
    if (onlyGeneratedTypesChanged) {
      return;
    }

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
      await this.notifyClients("assets");
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

    // Determine change kind for hot client
    const changeKind =
      needsCSS && !needsJS ? "css" : needsJS && !needsCSS ? "js" : "mixed";

    // Wait for builds to complete, then notify clients
    await this.waitForBuildAndNotify(changeKind);
  }

  private async handleRootChange(event: any) {
    if (event.kind !== "modify" && event.kind !== "create") return;

    const htmlFiles = event.paths.filter(
      (path: string) => path.endsWith(".html") && !path.includes("dist")
    );

    if (htmlFiles.length > 0) {
      console.log("📄 HTML files changed, updating...");
      this.buildQueue.add("html");
      await this.waitForBuildAndNotify("html");
    }
  }

  private async waitForBuildAndNotify(
    changeKind?: "css" | "js" | "html" | "mixed" | "assets"
  ) {
    // Wait a bit for the build queue to process
    const timing = this.config.build.timing;
    let attempts = 0;
    while (this.buildQueue.isBuilding() && attempts < timing.waitAttempts) {
      await new Promise((resolve) =>
        setTimeout(resolve, timing.waitIntervalMs)
      );
      attempts++;
    }

    if (attempts >= timing.waitAttempts) {
      console.error("⏰ Build timeout, notifying clients anyway");
    }

    // Add extra delay to ensure CSS files are fully written to disk
    // This prevents race conditions where JS completes before CSS is available
    console.log("⏳ Ensuring all builds are complete...");
    await this.ensureCSSIsReady();
    await new Promise((resolve) =>
      setTimeout(resolve, this.config.build.timing.waitIntervalMs)
    );

    // Notify all connected clients
    await this.notifyClients(changeKind);
  }

  private async ensureCSSIsReady(): Promise<void> {
    // Wait for CSS file to be written and stabilized
    try {
      const cssPath =
        this.config.build.css.output || this.config.paths.cssOutput;
      let attempts = 0;
      let lastSize = 0;

      while (attempts < this.config.build.timing.cssStabilizeAttempts) {
        try {
          const stat = await InZero.stat(cssPath);
          const currentSize = stat.size;

          // If file size hasn't changed in the last 100ms, consider it stable
          if (currentSize === lastSize && attempts > 0) {
            console.log("📄 CSS file is stable");
            break;
          }

          lastSize = currentSize;
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.build.timing.cssStabilizeIntervalMs)
          );
          attempts++;
        } catch {
          // File might not exist yet, wait a bit
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.build.timing.cssStabilizeIntervalMs)
          );
          attempts++;
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not check CSS file stability:", error);
    }
  }

  private notifyClients(
    changeKind?: "css" | "js" | "html" | "mixed" | "assets"
  ) {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({
      type: "reload",
      timestamp: Date.now(),
      change: changeKind || "mixed",
    });

    const deadClients: WebSocket[] = [];

    for (const client of Array.from(this.clients)) {
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
      const cfg = this.config;

      // Default to index.html
      if (pathname === "/") {
        pathname = "/index.html";
      }

      // Serve in-memory artifacts first (runtime bundler write=false)
      if (this.memoryArtifacts.size > 0) {
        const mem = this.memoryArtifacts.get(pathname);
        if (mem) {
          return new Response(mem as unknown as ReadableStream | null, {
            headers: { "Content-Type": this.getContentType(pathname) },
          });
        }
      }

      // Dev asset handler: serve asset route base from dist first, then src as fallback
      const assetBase = (cfg.server.assetRouteBase || "/asset/").replace(
        /\/?$/,
        "/"
      );
      if (pathname.startsWith(assetBase)) {
        const safeRel = pathname.replace(
          new RegExp(`^${assetBase.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`),
          ""
        );
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
            headers.set("Cache-Control", cfg.server.cacheControl || "no-store");
            return new Response(content, { headers });
          } catch {
            return null;
          }
        };
        // Prefer built assets (parity with production)
        const fromDist = await tryServe(cfg.paths.assetDistDir);
        if (fromDist) return fromDist;
        // Fallback to source assets during dev
        const fromSrc = await tryServe(cfg.paths.assetSrcDir);
        if (fromSrc) return fromSrc;
        console.log(`❌ Asset not found: ${pathname}`);
        return new Response("404 - Asset Not Found", { status: 404 });
      }

      try {
        // Serve from dist directory
        const filePath = `${cfg.paths.distDir}${pathname}`;
        const content = await InZero.readFile(filePath);

        // Inject InSpatial hot reload client for HTML files
        if (pathname.endsWith(".html") && this.config.server.injectClient) {
          const textContent = new TextDecoder().decode(content);
          const wsPort = (this.wsServer as any)?.addr?.port || 8888;
          const injection = this.config.server.clientScriptUrl
            ? `<script src="${this.config.server.clientScriptUrl}"></script>`
            : `
            <script>
              // InSpatial Hot Reload Client
              const ws = new WebSocket('ws://${
                this.config.server.host || "localhost"
              }:${wsPort}');
              ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'reload') {
                  console.log('🔥 InSpatial: Reloading...');
                  window.location.reload();
                }
              };
              ws.onopen = () => console.log('🔌 InSpatial: Connected to hot reload');
              ws.onclose = () => console.log('❌ InSpatial: Disconnected from hot reload');
            </script>`;
          const modifiedContent = textContent.replace(
            "</body>",
            `${injection}\n</body>`
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
            const indexContent = await InZero.readFile(
              `${this.config.paths.distDir}/index.html`
            );
            const textContent = new TextDecoder().decode(indexContent);
            const wsPort = (this.wsServer as any)?.addr?.port || 8888;
            const injection = this.config.server.injectClient
              ? this.config.server.clientScriptUrl
                ? `<script src="${this.config.server.clientScriptUrl}"></script>`
                : `
              <script>
                // InSpatial Hot Reload Client (SPA fallback)
                const ws = new WebSocket('ws://${
                  this.config.server.host || "localhost"
                }:${wsPort}');
                ws.onmessage = (event) => {
                  const data = JSON.parse(event.data);
                  if (data.type === 'reload') {
                    console.log('🔥 InSpatial: Reloading...');
                    window.location.reload();
                  }
                };
                ws.onopen = () => console.log('🔌 InSpatial: Connected to hot reload');
                ws.onclose = () => console.log('❌ InSpatial: Disconnected from hot reload');
              </script>`
              : "";
            const modifiedContent = injection
              ? textContent.replace("</body>", `${injection}\n</body>`)
              : textContent;
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

    const tryPorts = this.config.server.httpPorts;
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
      case "wgsl":
        return "text/plain";
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
