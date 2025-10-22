import {
  createState,
  type StorageProps,
  type TriggerDefsFor,
} from "@in/teract/state";
import type { CounterControls, CounterProps } from "./type.ts";

/*####################################(COUNTER STATE)####################################*/
export const useCounter = createState.in({
  /******************************(ID)******************************/
  id: "counter-state",

  /******************************(Initial State)******************************/
  initialState: <CounterControls>{
    value: 0,
    format: "None",
    axis: "x",
    reset: true,
    increment: true,
    decrement: true,
    // rateLimit: 100,
    // holdImmediate: false,
  },

  /******************************(Action)******************************/
  action: <TriggerDefsFor<CounterControls>>{
    setValue: {
      key: "value",
      fn: (_: CounterControls["value"], v: number) => v,
      options: { name: "counter-set-value" },
    },
    showIncrement: {
      key: "increment",
      fn: (current: CounterControls["increment"]) => !current,
      options: { name: "counter-increment" },
    },
    setIncrement: {
      key: "value",
      fn: (current: CounterControls["value"], amount = 1) => current + amount,
      options: { name: "counter-increment", throttle: 50 },
    },
    showDecrement: {
      key: "decrement",
      fn: (current: CounterControls["decrement"]) => !current,
      options: { name: "counter-decrement" },
    },
    setDecrement: {
      key: "value",
      fn: (current: CounterControls["value"], amount = 1) => current - amount,
      options: { name: "counter-decrement", throttle: 50 },
    },
    showReset: {
      key: "reset",
      fn: (current: CounterControls["reset"]) => !current,
      options: { name: "counter-reset" },
    },
    setReset: {
      key: "value",
      fn: () => 0,
      options: { name: "counter-reset" },
    },
  },

  /******************************(Storage)******************************/
  storage: <StorageProps>{
    key: "counter-state",
    backend: "local",
    debounce: 300,
  },
});

