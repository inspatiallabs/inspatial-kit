import { createController } from "@in/widget/control-flow";
import { useCounter } from "./state.ts";
import type { ControllerSettingItem } from "@in/widget/control-flow/controller/type.ts";
import type { CounterControls } from "./type.ts";

/*####################################(COUNTER CONTROLLER)####################################*/

export function CounterController(id: string) {
  return createController({
    id,
    mode: "manipulator",
    hasReset: true,
    state: useCounter,
    settings: <ControllerSettingItem<CounterControls>[]>[
      {
        name: "Format",
        path: "format",
        field: {
          type: "choice",
          component: "tab",
          options: [
            { label: "Number", value: "Number" },
            { label: "None", value: "None" },
            // { label: "Progress", value: "Progress" }, // TODO: Add Progress Bar when Visualization Widget is ready
          ],
        },
      },
      {
        name: "Axis",
        path: "axis",
        field: {
          type: "choice",
          component: "tab",
          options: [
            { label: "X", value: "x" },
            { label: "Y", value: "y" },
          ],
        },
      },
      {
        name: "Reset",
        path: "reset",
        field: {
          type: "choice",
          component: "tab",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
      },
      {
        name: "Increment",
        path: "increment",
        field: {
          type: "choice",
          component: "tab",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
      },
      {
        name: "Decrement",
        path: "decrement",
        field: {
          type: "choice",
          component: "tab",
          options: [
            { label: "Show", value: true },
            { label: "Hide", value: false },
          ],
        },
      },
    ],
  });
}
