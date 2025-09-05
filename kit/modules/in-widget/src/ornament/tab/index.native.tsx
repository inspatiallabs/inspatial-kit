import { composeStyle, iss } from "@in/style";
import { TabStyle } from "./style.ts";
import type { TabWrapperProps, TabTriggerProps } from "./type.ts";
import { Slot } from "@in/widget/structure/index.ts";

/*##############################(TAB WRAPPER)####################################*/

export function TabWrapper(props: TabWrapperProps) {
  /**************************(Props)**************************/
  const { className, children, $ref, ...rest } = props;

  /**************************(Render)**************************/
  return (
    <Slot
      className={iss(TabStyle.wrapper.getStyle({ className }))}
      role="tablist"
      $ref={$ref}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*##############################(TAB TRIGGER)####################################*/

// Create composed style for cross-references to work (like Switch)
const composedTabStyle = composeStyle(
  TabStyle.trigger.getStyle,
  TabStyle.label.getStyle
);

export function TabTrigger(props: TabTriggerProps) {
  /**************************(Props)**************************/
  const {
    className,
    value,
    selected = false,
    defaultSelected,
    onChange,
    children,
    $ref,
    ...rest
  } = props;

  /**************************(State)**************************/
  const isSelected = selected === true;

  /**************************(Handlers)**************************/
  const handleChange = (event: any) => {
    const newChecked = event?.target?.checked ?? !isSelected;
    onChange?.(newChecked);
  };

  /**************************(Render)**************************/
  return (
    <>
      <label className={iss(TabStyle.trigger.getStyle({ className }))}>
        <input
          type="radio"
          className={iss(TabStyle.input.getStyle({}))}
          name="inspatial-tab"
          value={value}
          checked={isSelected}
          defaultChecked={defaultSelected}
          on:input={handleChange}
          on:change={handleChange}
          $ref={$ref}
          {...rest}
        />
        {/* Label is the visual part, like handle in Switch */}
        <Slot
          className={iss(TabStyle.label.getStyle({}))}
          data-checked={isSelected}
        >
          {children}
        </Slot>
      </label>
    </>
  );
}
