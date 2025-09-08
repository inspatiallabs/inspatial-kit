type RuntimeTemplateApply = (renderer: any) => void | Promise<void>;

const templates: Map<string, RuntimeTemplateApply> = new Map();

/** Create a named runtime template applier */
function createRuntimeTemplate(name: string, apply: RuntimeTemplateApply): void {
  templates.set(name, apply);
}

/** Apply a template by name or direct function */
async function applyRuntimeTemplate(
  renderer: any,
  template?: "jsx" | "jsxsfc" | RuntimeTemplateApply
): Promise<void> {
  if (!template) return;
  const applier = typeof template === "function" ? template : templates.get(template);
  if (applier) await applier(renderer);
}

// Built-in creation for JSX
createRuntimeTemplate("jsx", async function (renderer: any) {
  const mod = await import("@in/runtime/index.ts");
  const fn = (mod as any).jsxRuntimeWrap || (mod as any).wrap;
  if (typeof fn === "function") fn(renderer);
});

export type { RuntimeTemplateApply };
export { createRuntimeTemplate, applyRuntimeTemplate };


