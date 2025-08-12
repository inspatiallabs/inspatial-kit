export type Platform =
  | "web"
  | "android"
  | "androidx"
  | "ios"
  | "visionos"
  | "horizonos"
  | "universal";

export type PageKind = "window" | "scene";

export interface FileDirectives {
  use?: Array<
    "dom" | "ssr" | "native" | "xr" | "gpu" | "vr" | "ar" | "mr" | "volumetric"
  >;
}

export type PlatformFileMap = Record<Platform, string>;

export interface RouteFiles {
  page?: string | PlatformFileMap; // path to window.tsx or scene.tsx
  layout?: string | PlatformFileMap;
  loading?: string | PlatformFileMap;
  error?: {
    layout?: string | PlatformFileMap;
    notFound?: string | PlatformFileMap;
    notUnauthorized?: string | PlatformFileMap;
    global?: string | PlatformFileMap; // root only
  };
  state?: string;
  style?: string;
  type?: string;
  env?: string;
  doc?: string;
  api?: string;
  collection?: string | string[];
}

export interface RouteNodeMeta {
  platform?: Platform;
  pageKind?: PageKind;
  directives?: FileDirectives;
  mode?: "spa" | "mpa" | "auto";
  zone?: string; // for multi-zone
}

export interface RouteNode {
  name: string;
  path: string; // compiled route path
  redirect?: string;
  files: RouteFiles;
  meta?: RouteNodeMeta;
  children?: RouteNode[];
}

export interface InRouteManifest {
  version: string;
  routes: RouteNode[];
  prefix?: string;
}
