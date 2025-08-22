import { createStyle } from "@in/style";

export const presentationStyle = createStyle({
  base: [
    "flex relative justify-center items-center rounded-xl bg-(--surface) text-(--primary) shadow-(--shadow-effect) min-w-[500px] min-h-[500px] m-auto pointer-events-auto",
  ],
  settings: {},
  defaultSettings: {},
});
