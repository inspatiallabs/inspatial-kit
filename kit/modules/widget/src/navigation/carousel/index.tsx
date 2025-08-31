import { CarouselStyle } from "./style.ts";
import type { CarouselProps } from "./type.ts";

export function Carousel(props: CarouselProps) {
  const { className, empty, ...rest } = props;
  const classes = CarouselStyle.getStyle({ className });

  if (empty?.isEmpty) {
    const slot = empty.slot as unknown;
    if (typeof slot === "string") {
      return <img className={classes} src={slot} {...rest} />;
    }
    return <div className={classes} {...(rest as any)}>{slot as any}</div>;
  }

  return <div className={classes} {...(rest as any)} />;
}
