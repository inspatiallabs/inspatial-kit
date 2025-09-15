import { env } from "@in/vader/env/index.ts";
import { InZero } from "@in/zero";

const defaultRoots = [InZero.cwd()];

const rootsEnv = env
  .getArray("IN_TEST_SPEC_ROOT")
  ?.map((s) => s.trim())
  .filter(Boolean);
const roots = rootsEnv && rootsEnv.length > 0 ? rootsEnv : defaultRoots;

const includeExtensions = new Set([
  ".spec.ts",
  ".spec.tsx",
  ".spec.js",
  ".spec.jsx",
]);
const excludeDirs = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "build",
  ".deno",
  ".next",
  ".cache",
]);

function toFileUrl(p: string): string {
  // Normalize Windows paths
  const normalized = p.replace(/\\/g, "/");
  return normalized.startsWith("/")
    ? `file://${normalized}`
    : `file:///${normalized}`;
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const entry of InZero.readDir(dir)) {
    const path = `${dir}${dir.endsWith("/") || dir.endsWith("\\") ? "" : "/"}${
      entry.name
    }`;
    if (entry.isDirectory) {
      if (excludeDirs.has(entry.name)) continue;
      yield* walk(path);
    } else if (entry.isFile) {
      const lower = entry.name.toLowerCase();
      for (const ext of Array.from(includeExtensions)) {
        if (lower.endsWith(ext)) {
          yield path;
          break;
        }
      }
    }
  }
}

Promise.resolve().then(async () => {
  const discovered = new Set<string>();

  for (const root of roots) {
    for await (const filePath of walk(root)) {
      if (discovered.has(filePath)) continue;
      discovered.add(filePath);
    }
  }

  const files = Array.from(discovered).sort();

  if (files.length === 0) {
    // No-op: let Deno test finish gracefully when no specs exist
    console.info("@in/test: no *.spec.* files found");
    return;
  }

  await Promise.all(files.map((p) => import(toFileUrl(p))));
});

export {};
