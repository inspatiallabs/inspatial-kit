import { createExtension } from "@in/extension";
import { nextTick } from "@in/teract/signal/index.ts";
import { createMotion } from "./index.js";
import type { InMotionConfig } from "./type.ts";
import {
  motionStartHandler,
  motionEndHandler,
  motionProgressHandler,
} from "./trigger.ts";

/**
 * InMotion renderer extension
 * - Auto-initializes the InMotion engine on client
 * - Optionally applies configuration via .config()
 */
export function InMotion(config?: Partial<InMotionConfig>) {
  return createExtension({
    meta: {
      key: "InMotion",
      name: "motion",
      description: "Attribute-driven motion engine (data-inmotion)",
      author: { name: "InSpatial" },
      verified: true,
      price: 0,
      status: "installed",
      type: "Universal",
      version: "0.1.0",
    },
    capabilities: {
      triggers: {
        motionstart: {
          handler: motionStartHandler,
          type: {} as { id?: string },
          description: "Fires when a motion animation starts",
        },
        motionend: {
          handler: motionEndHandler,
          type: {} as { id?: string },
          description: "Fires when a motion animation ends",
        },
        motionprogress: {
          handler: motionProgressHandler,
          type: {} as {
            id?: string;
            ratio: number;
            time: number;
            duration: number;
            direction: "forward" | "reverse";
          },
          description: "Animation progress updates (0..1)",
        },
      },
    },
    lifecycle: {
      setup: () => {
        try {
          const api = createMotion();
          if (config && typeof api?.config === "function") {
            api.config(config);
          }
          // One-shot restart after initial mount to ensure scan
          nextTick(() => api.restart?.());
        } catch {}
      },
    },
  });
}
