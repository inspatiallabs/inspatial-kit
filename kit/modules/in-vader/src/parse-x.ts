/*##############################(PARSE NUMBER ARRAY)##############################*/
export function parseNumberArray(value?: string): number[] | undefined {
  if (!value) return undefined;
  try {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));
  } catch {
    return undefined;
  }
}

/*##############################(PARSE STRING ARRAY)##############################*/
export function parseStringArray(value?: string): string[] | undefined {
  if (!value) return undefined;
  try {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return undefined;
  }
}
