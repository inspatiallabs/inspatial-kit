// import { Choose } from "@in/widget/control-flow";
// import type { ChoiceInputProps } from "./type.ts";
// import { Checkbox, type CheckboxProps } from "./checkbox/index.ts";
// import { Radio, type RadioProps } from "./radio/index.ts";
// import { Switch, type SwitchProps } from "./switch/index.ts";

// /*################################(CHOICE INPUT)################################*/
// export function ChoiceInput(props: ChoiceInputProps) {
//   /**************************(Props)**************************/
//   const { type, ...rest } = props;

//   return (
//     <Choose
//       cases={[
//         {
//           when: type === "checkbox",
//           children: <Checkbox {...(rest as CheckboxProps)} />,
//         },
//         {
//           when: type === "radio",
//           children: <Radio {...(rest as RadioProps)} />,
//         },
//         {
//           when: type === "switch",
//           children: <Switch {...(rest as SwitchProps)} />,
//         },
//       ]}
//     />
//   );
// }
