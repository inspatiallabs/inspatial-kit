export interface ChoiceInputProps extends JSX.SharedProps {
  icon?:
    | "ball"
    | "tick"
    | "cross"
    | "brand"
    | "dash"
    | JSX.SharedProps["children"];
  type:
    | "switch"
    | "checkbox"
    | "radio"
    | "radiogroup"
    | "togglegroup"
    | "choicegroup";
}
