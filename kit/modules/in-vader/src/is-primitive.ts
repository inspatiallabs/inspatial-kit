export function isPrimitive(
  val: unknown
): val is string | number | boolean | null | undefined | symbol | bigint {
  return Object(val) !== val;
}
