/** Cross-runtime text file writer */
export async function createOrUpdateTextFile(
  path: string,
  content: string
): Promise<void> {
  // Deno
  // deno-lint-ignore no-explicit-any
  const g: any = globalThis as any;
  try {
    if (g.Deno?.writeTextFile) {
      await g.Deno.writeTextFile(path, content);
      return;
    }
  } catch {}

  // Node.js
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs/promises");
    await fs.writeFile(path, content);
    return;
  } catch {}

  // Bun
  try {
    if (g.Bun?.write) {
      await g.Bun.write(path, content);
      return;
    }
  } catch {}

  throw new Error("No supported file writer in this runtime");
}
