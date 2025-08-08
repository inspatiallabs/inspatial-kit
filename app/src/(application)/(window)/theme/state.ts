import { createState } from "@inspatial/state";

/*################################(Types)################################*/

export type ThemeMode = "light" | "dark";

/*################################(State)################################*/
export const themeState = createState.in({
  initialState: {
    mode: "light" as ThemeMode,
  },
  trigger: {
    setLight: { key: "mode", action: () => "light" as ThemeMode },
    setDark: { key: "mode", action: () => "dark" as ThemeMode },
    toggle: {
      key: "mode",
      action: (current: ThemeMode) => (current === "dark" ? "light" : "dark"),
    },
  },
  storage: {
    key: "inspatial-theme",
    backend: "local",
  },
});
