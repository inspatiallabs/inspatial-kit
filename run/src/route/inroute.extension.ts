// import {
//   type RendererExtension,
//   createExtension,
// } from "../renderer/create-extension.ts";
// import {
//   InDOMTriggerProps,
//   InUniversalTriggerProps,
//   createTriggerHandle,
// } from "../state/trigger/trigger-props.ts";
// import { isSafeHref } from "./sanitize.ts";
// import { createSignal } from "../signal/signal.ts";
// import { lazy } from "../kit/control-flow/lazy/index.ts";
// import { createFsRoute } from "./create-fs-route.ts";

// export function InRoute(): RendererExtension {
//   return createExtension({
//     meta: {
//       key: "inroute",
//       name: "InRoute Extension",
//       description: "Filesystem and programmatic routing integration",
//       version: "0.1.0",
//     },
//     capabilities: {
//       rendererProps: {
//         onDirective(prefix, _key) {
//           // Accept route directives, but actual behavior is handled by router/runtime
//           if (prefix === "use") return (() => {}) as any;
//           return undefined;
//         },
//       },
//     },
//     lifecycle: {
//       setup(renderer?: any) {
//         // Auto-bootstrap FS routing (browser only)
//         (async () => {
//           try {
//             if (!(globalThis as any).document) return;
//             const hinted = (globalThis as any).InAppLoadersPath;
//             const spec = hinted || "/.inroute/loaders.js";
//             // Use non-literal specifier to avoid bundler resolving it at build time
//             const loadersMod: any = await import(spec as string).catch(() => null);
//             if (!loadersMod || !loadersMod.manifest) return;
//             const { manifest, pageFiles, layoutFiles, loadingFiles } = loadersMod;
//             const route = createFsRoute({
//               manifest: manifest as any,
//               loaders: { pageFiles, layoutFiles, loadingFiles } as any,
//             });
//             (globalThis as any).InRoute = route;

//             // Provide a default view that resolves the page module from loader maps
//             const InRouteView = (_R: any) => {
//               const tick = createSignal(0);
//               // Re-render on route changes
//               route.current.connect(() => tick.set(tick.get() + 1));

//               return (R2: any) => {
//                 // Establish dependency
//                 tick.get();
//                 const rawPath =
//                   route.current.get()?.path ||
//                   (globalThis as any).location?.pathname ||
//                   "/";
//                 const cleanPath = rawPath.split("?")[0].split("#")[0];
//                 const loader = (pageFiles as any)[cleanPath] ||
//                   (pageFiles as any)[rawPath];
//                 if (!loader) {
//                   const globalNotFound = (loadersMod as any).notFound || null;
//                   if (globalNotFound) {
//                     const NF = lazy(async () => {
//                       const mod = await globalNotFound();
//                       if (mod?.default) return { default: mod.default } as any;
//                       const key = Object.keys(mod).find(
//                         (k) => /Window$|Scene$/i.test(k) && typeof (mod as any)[k] === "function"
//                       );
//                       const picked = key ? (mod as any)[key] : undefined;
//                       return { default: picked || ((_: any) => (R2.c("div", null, "Not Found"))) } as any;
//                     }, "default");
//                     return R2.c(NF as any);
//                   }
//                   return R2.c("div", { class: "inroute-404" }, "404 Not Found");
//                 }
//                 const LazyComp = lazy(async () => {
//                   const mod = await loader();
//                   if (mod?.default) return { default: mod.default } as any;
//                   const key = Object.keys(mod).find(
//                     (k) => /Window$|Scene$/i.test(k) && typeof (mod as any)[k] === "function"
//                   );
//                   const picked = key ? (mod as any)[key] : undefined;
//                   // Fallback component renders via R2; but lazy expects a component, so provide default
//                   return { default: picked || ((_: any) => (R2.c("div", null, "Missing page export"))) } as any;
//                 }, "default");
//                 return R2.c(LazyComp as any);
//               };
//             };
//             (globalThis as any).InRouteView = InRouteView;

//             // Auto-mount default view if host hasn't rendered anything yet (keeps render.ts pure)
//             try {
//               if ((globalThis as any).document && renderer?.render) {
//                 const container = (globalThis as any).document.getElementById("app");
//                 if (container && !container.hasChildNodes?.()) {
//                   renderer.render(container, InRouteView as any);
//                 }
//               }
//             } catch {
//               // best-effort auto-mount only
//             }
//           } catch {
//             // best-effort auto-bootstrap
//           }
//         })();
//         // Register trigger-props so components can use on:tap, on:pointerenter, etc.
//         try {
//           InDOMTriggerProps();
//           InUniversalTriggerProps();
//         } catch {
//           // trigger-props registration best-effort
//         }

//         // Minimal safety-only capture for plain anchors (block unsafe schemes)
//         if ((globalThis as any).document) {
//           const onClickCapture = (event: any) => {
//             const link = (event.target as Element)?.closest?.("a");
//             if (!link) return;
//             const href = link.getAttribute("href") || "";
//             if (!isSafeHref(href)) {
//               event.preventDefault();
//               event.stopPropagation();
//             }
//           };
//           (globalThis as any).document.addEventListener(
//             "click",
//             onClickCapture,
//             { capture: true }
//           );

//           // Prefetch via trigger: map pointerenter to a prefetch callback if route is exposed
//           createTriggerHandle("pointerenter", (_node, _cb: any) => {
//             const rt: any = (globalThis as any).InRoute;
//             if (!rt || typeof rt.prefetch !== "function") return;
//             _node.addEventListener("pointerenter", (e: any) => {
//               const a = (e.target as Element)?.closest?.("a");
//               if (!a) return;
//               const href = a.getAttribute("href") || "";
//               rt.prefetch(href);
//             });
//           });
//         }
//       },
//     },
//   });
// }
