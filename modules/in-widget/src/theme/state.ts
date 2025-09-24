import { createState } from "@in/teract/state";

/*################################(Types)################################*/

export type ThemeModeProps = "light" | "dark";

/*################################(State)################################*/
export const useTheme = createState.in({
  initialState: {
    mode: "light" as ThemeModeProps,
  },
  action: {
    setLight: { key: "mode", fn: () => "light" as ThemeModeProps },
    setDark: { key: "mode", fn: () => "dark" as ThemeModeProps },
    setToggle: {
      key: "mode",
      fn: (current: ThemeModeProps) => (current === "dark" ? "light" : "dark"),
    },
  },
  storage: {
    key: "inspatial-theme",
    backend: "local",
  },
});
