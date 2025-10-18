import { iss } from "@in/style";
import type {
  SimulatorBrowserBarProps,
  SimulatorFrameProps,
  SimulatorInnerFrameProps,
  SimulatorOuterFrameProps,
  SimulatorProps,
  SimulatorStatusBarProps,
  SimulatorWrapperProps,
} from "./type.ts";
import { Slot, YStack } from "@in/widget/structure";
import { SimulatorStyle } from "./style.ts";
import { Show } from "@in/widget/control-flow";
import { Emulator } from "../emulator/component.tsx";

/*############################(WRAPPER)#############################*/
export function SimulatorWrapper(props: SimulatorWrapperProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.wrapper.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*############################(FRAME)#############################*/
export function SimulatorInnerFrame(props: SimulatorInnerFrameProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.frame.inner.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

export function SimulatorOuterFrame(props: SimulatorOuterFrameProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.frame.outer.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

export function SimulatorFrame(props: SimulatorFrameProps) {
  const { children, ...rest } = props;
  return (
    <SimulatorOuterFrame>
      <SimulatorInnerFrame {...rest}>{children}</SimulatorInnerFrame>
    </SimulatorOuterFrame>
  );
}

/*############################(STATUS BAR)#############################*/
export function SimulatorStatusBar(props: SimulatorStatusBarProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.statusBar.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*############################(BROWSER BAR)#############################*/
export function SimulatorBrowserBar(props: SimulatorBrowserBarProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.browserBar.getStyle({ className }))}
      {...rest}
    >
      {children}
    </Slot>
  );
}

/*############################(SIMULATOR)#############################*/
export function Simulator(props: SimulatorProps) {
  const { format, radius, size, disabled, className, children, ...rest } =
    props;
  return (
    <SimulatorWrapper
      radius={radius}
      size={size}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <SimulatorFrame>
        <Emulator variant={format ?? "none"} {...rest} />
      </SimulatorFrame>
    </SimulatorWrapper>
  );
}
