// import { InZero } from "../zero/index.ts";
// import type { InRouteManifest, RouteNode } from "./types.ts";

// /**
//  * Filesystem Route Scanner
//  * - Scans ./src/app/** irrespective of app folder name
//  * - Emits manifest and loader maps under ./src/app/.inroute/
//  */
// export class FSRouteScanner {
//   private readonly appRoot = "./src/app";
//   private readonly outDir = "./src/app/.inroute";

//   async scanAndWrite(): Promise<void> {
//     const manifest = await this.scan();
//     await this.writeOutputs(manifest);
//   }

//   async scan(): Promise<InRouteManifest> {
//     const _routes: RouteNode[] = [];
//     const prefix = "";

//     const walk = async (dir: string, urlBase: string): Promise<RouteNode[]> => {
//       const nodes: RouteNode[] = [];
//       let hasPage = false;
//       let windowFile: string | undefined;
//       let sceneFile: string | undefined;
//       let layoutFile: string | undefined;
//       let loadingFile: string | undefined;
//       let errorLayout: string | undefined;
//       let errorNotFound: string | undefined;
//       let errorNotUnauthorized: string | undefined;

//       // First pass: read entries
//       const subdirs: string[] = [];
//       try {
//         for await (const entry of (globalThis as any).Deno.readDir(dir)) {
//           if (entry.isFile) {
//             if (entry.name === "window.tsx")
//               windowFile = `${dir}/${entry.name}`;
//             if (entry.name === "scene.tsx") sceneFile = `${dir}/${entry.name}`;
//             if (entry.name === "layout.tsx")
//               layoutFile = `${dir}/${entry.name}`;
//             if (entry.name === "loading.tsx")
//               loadingFile = `${dir}/${entry.name}`;
//           } else if (entry.isDirectory) {
//             subdirs.push(entry.name);
//           }
//         }
//       } catch {
//         // Directory might not exist; return empty
//         return [];
//       }

//       // Handle error subfolder
//       if (subdirs.includes("error")) {
//         try {
//           for await (const errEntry of (globalThis as any).Deno.readDir(
//             `${dir}/error`
//           )) {
//             if (!errEntry.isFile) continue;
//             if (errEntry.name === "layout.tsx")
//               errorLayout = `${dir}/error/${errEntry.name}`;
//             if (errEntry.name === "not-found.tsx")
//               errorNotFound = `${dir}/error/${errEntry.name}`;
//             if (errEntry.name === "not-unauthorized.tsx")
//               errorNotUnauthorized = `${dir}/error/${errEntry.name}`;
//             if (errEntry.name === "global.tsx") {
//               // root-only; handled when writing manifest consumers
//               // we include under error.global at root level by leaf detection below
//             }
//           }
//         } catch {
//           // ignore error folder read issues (non-fatal)
//         }
//       }

//       // Create node for this directory if it has any route-relevant files
//       hasPage = Boolean(windowFile || sceneFile || layoutFile || loadingFile);

//       let thisNode: RouteNode | null = null;
//       if (hasPage) {
//         const files: RouteNode["files"] = {} as any;
//         if (windowFile || sceneFile) {
//           if (windowFile && sceneFile) {
//             files.page = {
//               web: this.toSrcPath(windowFile),
//               universal: this.toSrcPath(sceneFile),
//             } as any;
//           } else if (windowFile) {
//             files.page = { web: this.toSrcPath(windowFile) } as any;
//           } else if (sceneFile) {
//             files.page = { universal: this.toSrcPath(sceneFile) } as any;
//           }
//         }
//         if (layoutFile) files.layout = this.toSrcPath(layoutFile);
//         if (loadingFile) files.loading = this.toSrcPath(loadingFile);
//         if (errorLayout || errorNotFound || errorNotUnauthorized) {
//           files.error = {} as any;
//           if (errorLayout)
//             (files.error as any).layout = this.toSrcPath(errorLayout);
//           if (errorNotFound)
//             (files.error as any).notFound = this.toSrcPath(errorNotFound);
//           if (errorNotUnauthorized)
//             (files.error as any).notUnauthorized =
//               this.toSrcPath(errorNotUnauthorized);
//         }

//         const meta: RouteNode["meta"] = {};
//         if (windowFile) meta.viewType = "window" as any;
//         if (!windowFile && sceneFile) meta.viewType = "scene" as any;

//         const name = this.routeKeyFromPath(urlBase || "/");
//         thisNode = {
//           name,
//           path: urlBase || "/",
//           files,
//           meta,
//           children: [],
//         };
//         nodes.push(thisNode);
//       }

//       // Recurse into subdirectories
//       for (const sub of subdirs) {
//         const isGroup = sub.startsWith("(") && sub.endsWith(")");
//         const isDynamicBracket = sub.startsWith("[") && sub.endsWith("]");
//         const isDynamicBrace = sub.startsWith("{") && sub.endsWith("}");

//         const segment = isGroup
//           ? ""
//           : isDynamicBracket
//           ? `/{${sub.slice(1, -1)}}`
//           : isDynamicBrace
//           ? `/${sub}`
//           : `/${sub}`;

//         const childBase = isGroup ? urlBase : `${urlBase}${segment}`;
//         const childDir = `${dir}/${sub}`;
//         const childNodes = await walk(childDir, childBase);

//         // Attach to nearest node at this level if exists, otherwise append top-level
//         if (childNodes.length > 0) {
//           if (thisNode)
//             thisNode.children = [...(thisNode.children || []), ...childNodes];
//           else nodes.push(...childNodes);
//         }
//       }

//       return nodes;
//     };

//     let children = await walk(this.appRoot, "");

//     // Ensure we have a home ("/") route. If user didn't define one,
//     // pick the shallowest page node deterministically and alias it to "/".
//     const hasExplicitRoot = children.some((n) => n.path === "/");
//     if (!hasExplicitRoot && children.length > 0) {
//       // Flatten nodes to search for first page
//       const flat: RouteNode[] = [];
//       const collect = (n: RouteNode) => {
//         flat.push(n);
//         (n.children || []).forEach(collect);
//       };
//       children.forEach(collect);

//       // Filter nodes that actually have a page
//       const pageNodes = flat.filter(
//         (n: RouteNode) => !!(n.files && (n.files as any).page)
//       );
//       if (pageNodes.length > 0) {
//         const pick = pageNodes
//           .map((n) => ({
//             node: n,
//             depth: (n.path || "").split("/").filter(Boolean).length,
//           }))
//           .sort((a, b) =>
//             a.depth === b.depth
//               ? a.node.path.localeCompare(b.node.path)
//               : a.depth - b.depth
//           )[0].node;

//         // Create alias root node
//         const aliasRoot: RouteNode = {
//           name: "root",
//           path: "/",
//           files: { ...(pick.files || {}) },
//           meta: { ...(pick.meta || {}), home: true as any },
//           children: [],
//         } as any;

//         // Prepend alias so it’s obvious in the manifest
//         children = [aliasRoot, ...children];
//       }
//     }

//     const manifest: InRouteManifest = {
//       version: "0",
//       routes: children,
//       prefix,
//     };
//     return manifest;
//   }

//   private toSrcPath(absLike: string): string {
//     // Normalize to src-relative path starting with ./src/...
//     const norm = absLike.replace(/\\/g, "/");
//     const idx = norm.indexOf("/src/");
//     return idx >= 0 ? norm.slice(idx) : norm;
//   }

//   private routeKeyFromPath(fullPath: string): string {
//     if (fullPath === "/" || fullPath === "") return "root";
//     return fullPath
//       .replace(/^\/?/, "/")
//       .replace(/\{([^}]+)\}/g, "_$1")
//       .replace(/[^a-zA-Z0-9_]+/g, "_")
//       .replace(/^_+|_+$/g, "");
//   }

//   private async writeOutputs(manifest: InRouteManifest): Promise<void> {
//     await InZero.mkdir(this.outDir, { recursive: true });

//     // Write manifest.json
//     const manifestJson = JSON.stringify(manifest, null, 2);
//     await InZero.writeFile(
//       `${this.outDir}/manifest.json`,
//       new TextEncoder().encode(manifestJson)
//     );

//     // Build loader maps from manifest
//     const pageEntries: string[] = [];
//     const layoutEntries: string[] = [];
//     const loadingEntries: string[] = [];
//     const seenPage = new Set<string>();
//     const seenLayout = new Set<string>();
//     const seenLoading = new Set<string>();
//     let globalNotFound: string | null = null;

//     const addNode = (node: RouteNode, isRoot = false) => {
//       const routePath = node.path;
//       const f = node.files || ({} as any);
//       // page
//       if (f.page && !seenPage.has(routePath)) {
//         if (typeof f.page === "string") {
//           pageEntries.push(
//             `  ${JSON.stringify(routePath)}: () => import(${JSON.stringify(
//               this.relFromOut(f.page)
//             )}),`
//           );
//         } else {
//           // Platform map: prefer web for dev
//           const web = (f.page as any).web ?? (f.page as any).universal;
//           if (web)
//             pageEntries.push(
//               `  ${JSON.stringify(routePath)}: () => import(${JSON.stringify(
//                 this.relFromOut(web)
//               )}),`
//             );
//         }
//         seenPage.add(routePath);
//       }
//       if (f.layout && !seenLayout.has(routePath)) {
//         if (typeof f.layout === "string") {
//           layoutEntries.push(
//             `  ${JSON.stringify(routePath)}: () => import(${JSON.stringify(
//               this.relFromOut(f.layout)
//             )}),`
//           );
//         }
//         seenLayout.add(routePath);
//       }
//       if (f.loading && !seenLoading.has(routePath)) {
//         if (typeof f.loading === "string") {
//           loadingEntries.push(
//             `  ${JSON.stringify(routePath)}: () => import(${JSON.stringify(
//               this.relFromOut(f.loading)
//             )}),`
//           );
//         }
//         seenLoading.add(routePath);
//       }
//       if (isRoot && f.error && typeof (f.error as any).global === "string") {
//         globalNotFound = this.relFromOut((f.error as any).global as string);
//       }
//       (node.children || []).forEach((c) => addNode(c, false));
//     };
//     (manifest.routes || []).forEach((n) => addNode(n, true));

//     const code =
//       `// Generated by InSpatial Serve - FS Route Scanner\n` +
//       `export const manifest = ${manifestJson} as const;\n\n` +
//       `export const pageFiles = {\n${pageEntries.join("\n")}\n} as const;\n` +
//       `export const layoutFiles = {\n${layoutEntries.join(
//         "\n"
//       )}\n} as const;\n` +
//       `export const loadingFiles = {\n${loadingEntries.join(
//         "\n"
//       )}\n} as const;\n` +
//       (globalNotFound
//         ? `\nexport const notFound = () => import(${JSON.stringify(
//             globalNotFound
//           )});\n`
//         : "") +
//       `\nexport const loaders = { pageFiles, layoutFiles, loadingFiles } as const;\n`;

//     await InZero.writeFile(
//       `${this.outDir}/loaders.ts`,
//       new TextEncoder().encode(code)
//     );
//   }

//   private relFromOut(srcPath: string): string {
//     // loaders.ts is in ./src/app/.inroute → target is under ./src/app/**
//     // So relative path is ../<rest-after-./src/app/>
//     const norm = srcPath.replace(/\\/g, "/");
//     const prefix = "/src/app/";
//     const idx = norm.indexOf(prefix);
//     if (idx >= 0) {
//       const rest = norm.slice(idx + prefix.length);
//       return `../${rest}`;
//     }
//     // Fallback: try to make it relative to loaders file
//     if (norm.startsWith("./src/app/"))
//       return `../${norm.slice("./src/app/".length)}`;
//     return norm;
//   }
// }
