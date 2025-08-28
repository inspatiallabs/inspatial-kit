import { createComponent } from "../../component/index.ts";

export function cellRender<TProps>(
  Comp: ((props: TProps) => any) | any,
  props: TProps
): any {
  if (!Comp) return null;

  if (typeof Comp === "function") {
    const result = Comp(props);
    // If the result is a plain value (string, number, etc), return it directly
    if (
      typeof result === "string" ||
      typeof result === "number" ||
      typeof result === "boolean"
    ) {
      return result;
    }
    // If it's a JSX element, wrap it with createComponent
    if (result && typeof result === "object" && result.$$typeof) {
      return createComponent(() => result, {});
    }
    return result;
  }

  // If Comp is a plain value, return it directly
  if (
    typeof Comp === "string" ||
    typeof Comp === "number" ||
    typeof Comp === "boolean"
  ) {
    return Comp;
  }

  return Comp;
}
