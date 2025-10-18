/*#########################(Emulator Props)#############################*/
import type { EmulatorWebProps } from "./web/type.ts";

export type EmulatorFormat = { web: EmulatorWebProps } | { none: true | {} };

export type EmulatorProps = {
  format: EmulatorFormat;
};
