/**
 * Converts a value to a percentage within the range defined by `min` and `max`.
 *
 * If `max` equals `min`, returns 0. Otherwise, calculates the percentage
 * as `((value - min) / (max - min)) * 100`.
 *
 * @param value - The number to convert to percentage.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The percentage value (0-100).
 */
export function toPercentage(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}
