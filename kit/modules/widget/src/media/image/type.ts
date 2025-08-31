import type { StyleProps } from "@in/style";
import type { ImageStyle } from "./style.ts";
import type { ImageFileType } from "@in/cloud";

/*###################################(TYPES)###################################*/
export type ImageProps = StyleProps<typeof ImageStyle> &
  JSX.SharedProps & {
    // Source (prefer fileId for cloud optimization)
    fileId?: string;
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
    // Rendering policies
    dpr?: number[];
    formats?: Array<ImageFileType>;
    breakpoints?: Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", number>>;
    quality?: number;
    generateSrcSet?: (src: string, dprs: number[]) => string;
    placeholder?: "blur" | "color" | "none";
    blurDataURL?: string;
    placeholderColor?: string;
    asBackground?: boolean;
  };
