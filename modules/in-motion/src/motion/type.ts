type LoopType = "mirror" | "jump";
type AnimationType = "fade" | "zoomin" | "zoomout" | "flip";
type DirectionType = "u" | "d" | "l" | "r" | "ul" | "ur" | "dl" | "dr";

export interface InMotionDefaults {
  animation?: AnimationType;
  direction?: DirectionType;
  duration?: number; // ms
  delay?: number; // ms
  threshold?: number; // %
  splitDelay?: number; // ms
  easing?: string;
  blur?: boolean | number; // rem
  forwards?: boolean;
  loop?: LoopType;
}

export interface InMotionConfig {
  defaults?: InMotionDefaults;
  observersDelay?: number; // ms
  once?: boolean;
}

export interface InMotionInstance {
  config(): InMotionConfig;
  config(newConfig: Partial<InMotionConfig>): InMotionInstance;
  destroy(): Promise<void>; //use only extreme cases, the system is reactive even in shadowRoot
  restart(): Promise<InMotionInstance>; //use only extreme cases, the system is reactive even in shadowRoot
  initialized(): boolean;
  readonly version: string;
}
