import { createController } from "@in/widget/control-flow";
import { useSimulator } from "./state.ts";

/*####################################(SIMULATOR CONTROLLER)####################################*/

export const SimulatorController = createController({
  id: "simulator-controller",
  mode: "manipulator",
  hasReset: true,
  state: useSimulator,
  settings: [
    {
      name: "Frame",
      path: "frame",
      field: {
        type: "choice",
        component: "tab",
        options: [
          { label: "All", value: "All" },
          { label: "Inner", value: "Inner" },
          { label: "Outer", value: "Outer" },
          { label: "None", value: "None" },
        ],
      },
    },
    {
      name: "Screen Fill",
      path: "screenFill",
      field: {
        type: "choice",
        component: "tab",
        options: [
          { label: "Fill", value: true },
          { label: "None", value: false },
        ],
      },
    },
    {
      name: "Screen Size",
      path: "screenSize",
      field: {
        type: "choice",
        component: "tab",
        options: [
          { label: "XS", value: "xs" },
          { label: "SM", value: "sm" },
          { label: "MD", value: "md" },
          { label: "LG", value: "lg" },
          { label: "XL", value: "xl" },
        ],
      },
    },
    {
      name: "OS",
      path: "os",
      field: {
        type: "choice",
        component: "tab",
        options: [
          { label: "Android", value: "Android" },
          { label: "AndroidXR", value: "AndroidXR" },
          { label: "iOS", value: "iOS" },
          { label: "VisionOS", value: "VisionOS" },
          { label: "HorizonOS", value: "HorizonOS" },
        ],
      },
    },
    {
      path: "isWeb",
      field: {
        type: "choice",
        component: "switch",
        options: [
          { label: "Web", value: true },
          { label: "None", value: false },
        ],
      },
    },
  ],
});
