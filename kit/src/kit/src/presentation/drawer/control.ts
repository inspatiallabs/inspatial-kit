type DrawerControlProps<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetterArg<T> = T | ((prev?: T) => T);

function resolveNext<T>(next: SetterArg<T>, prev?: T): T {
  return typeof next === "function"
    ? (next as (p?: T) => T)(prev)
    : (next as T);
}

export function drawerControl<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: DrawerControlProps<T>): readonly [
  T | undefined,
  (next: SetterArg<T | undefined>) => void
] {
  // Internal value for uncontrolled mode
  let internalValue = defaultProp as T | undefined;

  // When controlled, source of truth is prop; otherwise internal
  const getValue = (): T | undefined =>
    prop !== undefined ? prop : internalValue;

  const setValue = (next: SetterArg<T | undefined>): void => {
    if (prop !== undefined) {
      // Controlled: invoke onChange with computed next value relative to current prop
      const computed = resolveNext(next as SetterArg<T>, prop);
      if (computed !== prop) onChange(computed as T);
      return;
    }
    // Uncontrolled: update internal and notify
    const prev = internalValue;
    const computed = resolveNext(next, prev);
    internalValue = computed as T | undefined;
    if (computed !== prev && computed !== undefined) onChange(computed as T);
  };

  return [getValue(), setValue] as const;
}
