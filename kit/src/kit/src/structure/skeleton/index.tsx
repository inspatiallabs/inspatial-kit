import { Slot } from "../../structure/slot/index.tsx";
import { SkeletonStyle } from "./style.ts";
import type { SkeletonProps } from "./type.ts";

export function Skeleton(props: SkeletonProps) {
  const { className, class: classProp, ...rest } = props;
  return (
    <>
      <Slot
        // @ts-ignore
        className={SkeletonStyle.getStyle({ className, class: classProp })}
        {...rest}
      />
    </>
  );
}
