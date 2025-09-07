import type { TabItemProps } from "./type.ts";

function slugifyLabel(label: string): string {
  return String(label ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

/**
 * Compute deterministic values for tabs:
 * - Use label (slugified) when value is missing
 * - If duplicate labels without explicit values exist, append stable numeric suffixes
 * - Ensure global uniqueness among computed values
 */
export function computeTabValues(children?: TabItemProps[]) {
  const resolvedItems = (children ?? []).map((item) => ({ ...item }));

  const missingValueCounts = new Map<string, number>();
  for (const item of resolvedItems) {
    if (!item.value) {
      const key = item.label;
      missingValueCounts.set(key, (missingValueCounts.get(key) ?? 0) + 1);
    }
  }

  const computedValues = new Array<string>(resolvedItems.length);
  const usedValues = new Set<string>();
  const labelRunningIndex = new Map<string, number>();

  for (let i = 0; i < resolvedItems.length; i++) {
    const item = resolvedItems[i]!;
    const base = item.value ?? slugifyLabel(item.label);

    let value = base;
    if (!item.value) {
      const count = missingValueCounts.get(item.label) ?? 0;
      if (count > 1) {
        const nextIdx = (labelRunningIndex.get(item.label) ?? 0) + 1;
        labelRunningIndex.set(item.label, nextIdx);
        value = `${slugifyLabel(item.label)}-${nextIdx}`;
      }
    }

    // Ensure uniqueness across all values
    let candidate = value;
    let suffix = 2;
    while (usedValues.has(candidate)) {
      candidate = `${value}-${suffix++}`;
    }
    computedValues[i] = candidate;
    usedValues.add(candidate);
  }

  return { resolvedItems, computedValues } as const;
}
