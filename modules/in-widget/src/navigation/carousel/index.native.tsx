import { Slot } from "../../structure/index.ts";
import { CarouselStyle } from "./style.ts";
import type { CarouselProps } from "./type.ts";
import { Image } from "../../media/index.ts";

export function Carousel(props: CarouselProps) {
  const { className, class: cls, empty, ...rest } = props;
  const classes = CarouselStyle.getStyle({ className, class: cls });

  if (empty?.isEmpty) {
    const slot = empty.slot as unknown;
    if (typeof slot === "string") {
      return <Image className={classes} src={slot} {...rest} />;
    }
    return (
      <Slot className={classes} {...(rest as any)}>
        {slot as any}
      </Slot>
    );
  }

  return <Slot className={classes} {...(rest as any)} />;
}
