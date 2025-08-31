export function isThenable<T = unknown>(
  val: unknown
): val is
  | Promise<T>
  | {
      then: (
        onFulfilled?: (value: unknown) => T | PromiseLike<T>
      ) => PromiseLike<T>;
    } {
  return Boolean(val && typeof (val as any).then === "function");
}
