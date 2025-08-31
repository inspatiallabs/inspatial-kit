import {
  read,
  isSignal,
  type Signal,
  type SignalValueType,
} from "@in/teract/signal/index.ts";
import type { ComponentFunction } from "@in/widget/component/index.ts";
import type { RenderFunction } from "@in/widget/control-flow/render/index.ts";
import { Fn } from "@in/widget/control-flow/fn/index.ts";

export interface ChooseCase {
  when: SignalValueType<any> | (() => any) | any;
  children?: any | ComponentFunction;
}

export interface ChooseProps {
  cases: SignalValueType<ChooseCase[]> | ChooseCase[];
  otherwise?: any | ComponentFunction;
}

export function Choose(props: ChooseProps): ComponentFunction | RenderFunction {
  const { cases, otherwise } = props;

  return Fn({ name: "Choose" }, function () {
    const resolvedCases = read(cases) ?? [];

    for (const caseItem of resolvedCases as ChooseCase[]) {
      const { when, children } = caseItem ?? ({} as ChooseCase);

      // Evaluate condition with support for signals, functions, and static values
      let condition: any;
      if (isSignal(when)) condition = (when as Signal).value;
      else if (typeof when === "function") condition = (when as () => any)();
      else condition = when;

      if (condition) {
        if (typeof children === "function")
          return children as ComponentFunction;
        return () => children;
      }
    }

    // Fallback branch
    if (otherwise !== undefined) {
      if (typeof otherwise === "function")
        return otherwise as ComponentFunction;
      return () => otherwise;
    }

    return undefined as any;
  });
}
