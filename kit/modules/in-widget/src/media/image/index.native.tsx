import { ImageStyle } from "../image/style.ts";
import type { ImageProps } from "../image/type.ts";

/*###################################(IMAGE)###################################*/
export function Image(props: ImageProps) {
  /***************************(Props)***************************/
  const {
    className,
    $ref,
    src,
    alt,
    width,
    height,
    sizes,
    loading,
    decoding,
    fetchPriority,
    crossOrigin,
    referrerPolicy,
    fit,
    radius,
    aspect,
    shadow,
    inline,
    ...rest
  } = props as any;

  /***************************(Render)***************************/
  return (
    <>
      <img
        src={src as any}
        alt={alt as any}
        width={width as any}
        height={height as any}
        sizes={sizes as any}
        loading={loading as any}
        decoding={decoding as any}
        fetchPriority={fetchPriority as any}
        crossOrigin={crossOrigin as any}
        referrerPolicy={referrerPolicy as any}
        className={ImageStyle.getStyle({
          fit,
          radius,
          aspect,
          shadow,
          inline,
          className,
          ...rest,
        })}
        $ref={$ref}
        {...rest}
      />
    </>
  );
}
