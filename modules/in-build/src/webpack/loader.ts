import { type LoaderContext } from "./type.ts";

/*##################################(FUNCTIONS)##################################*/
function inSpatialHotReload(this: LoaderContext, source: string): string {
  const {
    importSource = ["@inspatial/kit/build", "@in/build"],
    importSourcePaths = [],
  } = this.getOptions?.() || {};

  let code = source.replace(
    /\s*\/\*\s*@inspatial\s+webpack\s*\*\/\s*import\.meta\.hot/g,
    "import.meta.webpackHot"
  );

  const sources = Array.isArray(importSource)
    ? Array.from(new Set(importSource))
    : [importSource];
  for (const p of importSourcePaths) {
    if (this.resourcePath === p) {
      return code;
    }
  }

  const bootstrap = `if (import.meta.webpackHot && !(import.meta.webpackHot as any).__inspatialInjected) {
	(import.meta.webpackHot as any).__inspatialInjected = true;
	(async () => {
		let m: any = null;
		${sources
      .map((s) => `if (!m) { try { m = await import("${s}"); } catch {} }`)
      .join("\n\t\t")}
		if (!m || !m.setup) return;
		m.setup({
			data: import.meta.webpackHot.data,
			current: import(${JSON.stringify(this.resourcePath)}),
			accept() { import.meta.webpackHot.accept() },
			dispose(cb) { import.meta.webpackHot.dispose(cb) },
			invalidate(reason) { (import.meta.webpackHot as any).decline?.(reason) }
		});
	})();
}`;

  code += `\n\n${bootstrap}`;

  if (this.sourceMap && this.callback) {
    const map = {
      version: 3,
      file: this.resourcePath,
      sources: [this.resourcePath],
      sourcesContent: [source],
      mappings: "",
    };
    this.callback(null, code, map);
    return code;
  }

  return code;
}

export default inSpatialHotReload;
