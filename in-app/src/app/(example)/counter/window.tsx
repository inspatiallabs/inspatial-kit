import { CounterView } from "./view.tsx";
import { AppMenu } from "../../menu.tsx";

export function CounterAppWindow() {
  return (
    <>
      <AppMenu />
      <CounterView />
    </>
  );
}
