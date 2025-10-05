export function cached<T, R>(handler: (arg: T) => R): (arg: T) => R {
  const cache = new Map<T, R>();
  return (arg: T): R => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = handler(arg);
    cache.set(arg, result);
    return result;
  };
}

export function cachedStrKeyNoFalsy<T>(
  handler: (key: string) => T
): (key: string) => T {
  const cache: Record<string, T> = Object.create(null);
  return function (key: string): T {
    return cache[key] || (cache[key] = handler(key));
  };
}
