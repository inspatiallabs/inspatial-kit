import { $ } from "@in/teract/state";
import { iss } from "@in/style";
import { ImageStyle, type ImageProps } from "../image/style.ts";

//NOTE: WIP*** Not ready for production
export function Image(props: ImageProps) {
  const {
    src,
    alt,
    width,
    height,
    sizes,
    priority,
    loading = priority ? "eager" : "lazy",
    decoding = "async",
    fetchPriority = priority ? "high" : "auto",
    crossOrigin,
    referrerPolicy,
    fit,
    radius,
    aspect,
    shadow,
    inline,
    dpr = [1, 2],
    generateSrcSet,
    placeholder = "none",
    blurDataURL,
    placeholderColor = "rgba(0,0,0,0.05)",
    asBackground = false,
    className,
    $ref,
    ...rest
  } = props;

  // Signals for lazy/in-view and load state
  const inView = $(false);
  const loaded = $(false);
  let rootEl: any = null;

  // Derive srcset
  const srcSet = $(() => {
    if (generateSrcSet) return generateSrcSet(src, dpr);
    // naive dpr-based srcset (expects server to serve @2x files via convention)
    return dpr.map((x) => (x === 1 ? `${src} 1x` : `${src} ${x}x`)).join(", ");
  });

  // View observer on mount; only set real src/srcset when visible
  function handleMount() {
    try {
      const node = rootEl as any | null;
      if (!node || !("IntersectionObserver" in globalThis)) {
        inView.set(true);
        return;
      }
      const io = new (globalThis as any).IntersectionObserver(
        (entries: any[]) => {
          if (entries.some((e) => e.isIntersecting)) {
            inView.set(true);
            io.disconnect?.();
          }
        },
        { rootMargin: "200px" }
      );
      io.observe(node);
    } catch {
      inView.set(true);
    }
  }

  const wrapperClass = iss(
    ImageStyle.getStyle({ fit, radius, aspect, shadow, inline }),
    className
  );

  return (
    <>
      <figure
        className={wrapperClass}
        $ref={(el: any) => {
          rootEl = el;
          if (typeof $ref === "function") ($ref as any)(el);
        }}
        on:mount={() => handleMount()}
        {...rest}
      >
        {/* Placeholder layer */}
        {placeholder !== "none" ? (
          <div
            className={iss("absolute inset-0")}
            style={{
              web: {
                backgroundColor:
                  placeholder === "color" ? placeholderColor : undefined,
                backgroundImage:
                  placeholder === "blur" && blurDataURL
                    ? `url(${blurDataURL})`
                    : undefined,
                backgroundSize: "cover",
                filter: placeholder === "blur" ? "blur(12px)" : undefined,
                opacity: $(() => (loaded ? 0 : 1)),
                transition: "opacity 200ms ease",
              },
            }}
          />
        ) : null}

        {asBackground ? (
          <div
            className="absolute inset-0"
            style={{
              web: {
                backgroundImage: `url(${src})`,
                backgroundSize: fit === "contain" ? "contain" : "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              },
            }}
          />
        ) : (
          <img
            alt={alt as any}
            decoding={decoding as any}
            loading={loading as any}
            fetchPriority={fetchPriority as any}
            crossOrigin={crossOrigin as any}
            referrerPolicy={referrerPolicy as any}
            width={width as any}
            height={height as any}
            sizes={sizes as any}
            on:load={() => loaded.set(true)}
            style={{ web: { display: "block", width: "100%", height: "100%" } }}
            src={src as any}
            srcset={srcSet as any}
          />
        )}
      </figure>
    </>
  );
}
