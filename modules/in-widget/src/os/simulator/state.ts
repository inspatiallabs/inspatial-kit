import {
  createState,
  type StorageProps,
  type TriggerDefsFor,
} from "@in/teract";
import type { SimulatorControls } from "./type.ts";

/*####################################(STATE)####################################*/
export const useSimulator = createState.in({
  /******************************(ID)******************************/
  id: "simulator-state",

  /******************************(Initial State)******************************/
  initialState: <SimulatorControls>{
    frame: "All",
    screenFill: false,
    screenSize: "sm",
    os: "iOS",
    isWeb: false,
  },

  /******************************(Actions)******************************/
  action: <TriggerDefsFor<SimulatorControls>>{
    setFrame: {
      key: "frame",
      fn: (_: string, frame: SimulatorControls["frame"]) => frame,
    },
    setScreenFill: {
      key: "screenFill",
      fn: (_: string, screenFill: SimulatorControls["screenFill"]) =>
        screenFill,
    },
    setScreenSize: {
      key: "screenSize",
      fn: (_: string, screenSize: SimulatorControls["screenSize"]) =>
        screenSize,
    },
    setOs: {
      key: "os",
      fn: (_: string, os: SimulatorControls["os"]) => os,
    },
    setIsWeb: {
      key: "isWeb",
      fn: (_: string, isWeb: SimulatorControls["isWeb"]) => isWeb,
    },
  },

  /******************************(Storage)******************************/
  storage: <StorageProps>{
    key: "simulator-state",
    backend: "local",
  },
});
