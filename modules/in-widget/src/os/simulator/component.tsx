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
import { Slot } from "@in/widget/structure";
import { SimulatorStyle } from "./style.ts";
import { Emulator } from "../emulator/component.tsx";

/*############################(WRAPPER)#############################*/
export function SimulatorWrapper(props: SimulatorWrapperProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.wrapper.getStyle({ className, ...rest }))}
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
      className={iss(
        SimulatorStyle.frame.inner.getStyle({ className, ...rest })
      )}
    >
      {children}
    </Slot>
  );
}

export function SimulatorOuterFrame(props: SimulatorOuterFrameProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      className={iss(
        // @ts-ignore
        SimulatorStyle.frame.outer.getStyle({ className, ...rest })
      )}
    >
      {children}
    </Slot>
  );
}

export function SimulatorFrame(props: SimulatorFrameProps) {
  const { inner, outer, children } = props;
  return (
    <SimulatorOuterFrame {...outer}>
      <SimulatorInnerFrame {...inner}>{children}</SimulatorInnerFrame>
    </SimulatorOuterFrame>
  );
}

/*############################(STATUS BAR)#############################*/
export function SimulatorStatusBar(props: SimulatorStatusBarProps) {
  const { className, children, ...rest } = props;
  return (
    <Slot
      // @ts-ignore
      className={iss(SimulatorStyle.statusBar.getStyle({ className, ...rest }))}
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
      className={iss(
        SimulatorStyle.browserBar.getStyle({ className, ...rest })
      )}
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
      className={iss(SimulatorStyle.wrapper.getStyle({ className, ...rest }))}
      radius={radius}
      size={size}
      disabled={disabled}
    >
      <SimulatorFrame
        inner={{ radius, ...children?.inner }}
        outer={{ radius, ...children?.outer }}
      >
        <Emulator variant={format ?? "none"} {...rest} />
      </SimulatorFrame>
    </SimulatorWrapper>
  );
}
