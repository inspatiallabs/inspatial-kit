import type { FormPath } from "./type.ts";

/*####################################(TO FORM PATH)####################################*/
export function toFormPath<T>(name: FormPath<T>): (string | number)[] {
  if (Array.isArray(name)) return name;

  const parts: (string | number)[] = [];

  name
    .toString()

    .split(".")

    .forEach((segment) => {
      const re = /([^\[]+)|\[(\d+)\]/g;

      let m;

      while ((m = re.exec(segment))) {
        if (m[1]) parts.push(m[1]);

        if (m[2]) parts.push(Number(m[2]));
      }
    });

  return parts;
}

/*####################################(SLUGIFY)####################################*/
export function slugify(name: string): string {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/*####################################(COERCE EVENT VALUE)####################################*/
export function coerceEventValue(evOrVal: any): any {
  if (evOrVal && (evOrVal as any).target !== undefined) {
    const t: any = (evOrVal as any).target;
    if (t.type === "checkbox") return !!t.checked;
    return t.value;
  }
  return evOrVal;
}
