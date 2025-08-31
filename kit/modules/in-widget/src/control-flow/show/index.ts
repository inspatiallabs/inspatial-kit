import {
  type SignalValueType,
  isSignal,
  type Signal,
} from "@in/teract/signal/index.ts";
import type { ComponentFunction } from "@in/widget/component/index.ts";
import type { RenderFunction } from "@in/widget/control-flow/render/index.ts";
import { Fn } from "@in/widget/control-flow/fn/index.ts";

export interface ShowProps {
  when: SignalValueType<any> | (() => any);
  otherwise?: any;
  children?: any;
}

export function Show(
  props: ShowProps,
  children?: ComponentFunction | any,
  otherwise?: ComponentFunction
): ComponentFunction | RenderFunction {
  const { when, otherwise: otherwiseProp, children: childrenProp } = props;

  // Use children from props if provided, otherwise use parameter
  const actualChildren = childrenProp ?? children;

  // Use otherwise from props if provided, otherwise use parameter
  const otherwiseBranch = otherwiseProp ?? otherwise;

  // Wrap JSX children in functions if they're not already functions
  const wrappedChildren =
    typeof actualChildren === "function"
      ? actualChildren
      : () => actualChildren;
  const wrappedotherwise =
    typeof otherwiseBranch === "function"
      ? otherwiseBranch
      : () => otherwiseBranch;

  if (isSignal(when)) {
    return Fn({ name: "Show" }, function () {
      if ((when as Signal).value) return wrappedChildren;
      else return wrappedotherwise;
    });
  }

  if (typeof when === "function") {
    return Fn({ name: "Show" }, function () {
      if (when()) {
        return wrappedChildren;
      } else {
        return wrappedotherwise;
      }
    });
  }

  if (when) return wrappedChildren as any;
  return wrappedotherwise as any;
}
