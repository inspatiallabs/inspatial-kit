/**
 * Restricts a numeric value to be within the inclusive range defined by `min` and `max`.
 *
 * If `value` is less than `min`, returns `min`.
 * If `value` is greater than `max`, returns `max`.
 * Otherwise, returns `value`.
 *
 * @param value - The number to clamp.
 * @param min - The minimum allowable value.
 * @param max - The maximum allowable value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
