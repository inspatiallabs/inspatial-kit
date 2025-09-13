export type Platform =
  | "web"
  | "android"
  | "androidxr"
  | "ios"
  | "visionos"
  | "horizonos"
  | "universal";

export type ViewType = "window" | "scene";

export type WindowViewDirectives =
  | "native"
  | "dom"
  | "ssr"
  | "android"
  | "ios"
  | "visionos"
  | "horizonos";
export type SceneViewDirectives = "gpu" | "vr" | "ar" | "mr" | "volumetric";

export interface ViewDirectives {
  use?: Array<WindowViewDirectives | SceneViewDirectives>;
}

export type PlatformFileMap = Record<Platform, string>;

export interface RouteFiles {
  view?: string | PlatformFileMap; // path to window.tsx or scene.tsx
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
  theme?: string; // can only have one theme.ts file
  type?: string;
  menu?: string;
  env?: string;
  doc?: string;
  api?: string;
  collection?: string | string[]; // folder
}

export interface RouteNodeMeta {
  platform?: Platform;
  viewType?: ViewType;
  directives?: ViewDirectives;
  mode?: "spa" | "mpa" | "auto";
  zone?: string; // for multi-zone
}

export interface RouteNode {
  name: string;
  to: string; // compiled route path
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
