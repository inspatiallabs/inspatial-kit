import type { JSX } from "@in/runtime";

/*#####################################(Type)#####################################*/

export type SlotProps = JSX.SharedProps & { content?: any; className?: string };
