/**
 * Convert any string into PascalCase by splitting on non-alphanumeric boundaries
 * and capitalizing each segment.
 *
 * Examples:
 * - pascalize("check-icon") => "CheckIcon"
 * - pascalize("check_icon") => "CheckIcon"
 * - pascalize("check icon") => "CheckIcon"
 * - pascalize("CHECKICON") => "Checkicon"
 */
export function pascalize(input: string): string {
  const cleaned = String(input)
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
}
