type RuntimeMarkupApply = (renderer: any) => void | Promise<void>;

const templates: Map<string, RuntimeMarkupApply> = new Map();

/** Create a named runtime template applier */
function createRuntimeMarkup(name: string, apply: RuntimeMarkupApply): void {
  templates.set(name, apply);
}

/** Apply a template by name or direct function */
async function applyRuntimeMarkup(
  renderer: any,
  template?: "jsx" | "jsxsfc" | RuntimeMarkupApply
): Promise<void> {
  if (!template) return;
  const applier = typeof template === "function" ? template : templates.get(template);
  if (applier) await applier(renderer);
}

// Built-in creation for JSX
createRuntimeMarkup("jsx", async function (renderer: any) {
  const mod = await import("@in/runtime");
  const fn = (mod as any).jsxRuntimeWrap || (mod as any).wrap;
  if (typeof fn === "function") fn(renderer);
});

export type { RuntimeMarkupApply };
export { createRuntimeMarkup, applyRuntimeMarkup };


