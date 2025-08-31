export function cached<T, R>(handler: (arg: T) => R): (arg: T) => R {
  const store = new Map<T, R>();
  return function (arg: T): R {
    let val = store.get(arg);
    if (val === undefined) {
      val = handler(arg);
      store.set(arg, val);
    }
    return val;
  };
}

export function cachedStrKeyNoFalsy<T>(
  handler: (key: string) => T
): (key: string) => T {
  const store: Record<string, T> = Object.create(null);
  return function (key: string): T {
    return store[key] || (store[key] = handler(key));
  };
}
