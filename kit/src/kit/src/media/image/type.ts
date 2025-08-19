import type { StyleProps } from "@in/style";
import type { ImageStyle } from "./style.ts";

/*###################################(TYPES)###################################*/
export type ImageProps = StyleProps<typeof ImageStyle> &
  JSX.SharedProps & {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    sizes?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    decoding?: "async" | "auto";
    fetchPriority?: "high" | "low" | "auto";
    crossOrigin?: "anonymous" | "use-credentials";
    referrerPolicy?: string;
    dpr?: number[];
    generateSrcSet?: (src: string, dprs: number[]) => string;
    placeholder?: "blur" | "color" | "none";
    blurDataURL?: string;
    placeholderColor?: string;
    asBackground?: boolean;
  };
