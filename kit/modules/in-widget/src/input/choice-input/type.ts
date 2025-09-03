export interface ChoiceInputProps extends JSX.SharedProps {
  type:
    | "switch"
    | "checkbox"
    | "radio"
    | "radiogroup"
    | "togglegroup"
    | "choicegroup";
}
