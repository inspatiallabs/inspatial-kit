import { type SignalValueType, read } from "@in/teract/signal/index.ts";
import {
  type ComponentContext,
  KEY_CTX,
} from "@in/widget/component/index.ts";
import { Fn } from "@in/widget/control-flow/fn/index.ts";

export interface RenderProps {
  from: SignalValueType<any>;
}

export type RenderFunction = (renderer: any) => any;

export function Render(props: RenderProps): RenderFunction {
  return function (R: any) {
    return R.c(Fn, { name: "Render" }, function () {
      const instance = read(props.from);
      if (instance !== null && instance !== undefined)
        return render(instance, R);
    });
  };
}

export function render(instance: any, renderer: any): any {
  const ctx = instance[KEY_CTX] as ComponentContext | undefined;
  if (!ctx) {
    return;
  }

  const { run, render: renderComponent } = ctx;
  if (!renderComponent || typeof renderComponent !== "function")
    return renderComponent;

  return run!(renderComponent, renderer)[0];
}
