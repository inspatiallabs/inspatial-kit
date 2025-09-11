export interface ExtensionTriggerTypes {
  motionstart: { id?: string };
  motionend: { id?: string };
  motionprogress: {
    id?: string;
    ratio: number;
    time: number;
    duration: number;
    direction: "forward" | "reverse";
  };
}
