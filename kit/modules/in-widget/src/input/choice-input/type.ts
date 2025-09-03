export interface ChoiceInputProps extends JSX.SharedProps {
  icon?: 
    | "ball"
    | "tick" 
    | "cross"
    | "brand"
    | "dash"
    | JSX.Element; // Specific JSX element type
  type:
    | "switch"
    | "checkbox"
    | "radio"
    | "radiogroup"
    | "togglegroup"
    | "choicegroup";
}
