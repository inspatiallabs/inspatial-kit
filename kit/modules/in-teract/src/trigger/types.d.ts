// // Type augmentation for @in/teract core triggers
// declare global {
//   namespace InSpatial {
//     interface ExtensionTriggers {
//       // Core universal triggers
//       tap: { type: "tap"; event?: Event };
//       longpress: { type: "longpress" };
//       rightclick: { type: "rightclick"; event: MouseEvent; x: number; y: number };
//       escape: KeyboardEvent;
//       key: { type: "key"; phase: "down" | "up"; key: string; code: string; repeat: boolean; event: KeyboardEvent };
//       "key:down": { type: "key"; phase: "down"; key: string; code: string; repeat: boolean; event: KeyboardEvent };
//       "key:up": { type: "key"; phase: "up"; key: string; code: string; repeat: boolean; event: KeyboardEvent };
//       mount: { type: "mount" };
//       beforeMount: { type: "beforeMount" };
//       frameChange: { type: "frameChange"; time: number; delta: number; elapsed: number; frame: number };
//       change: Event;
//       submit: Event;
//       focus: FocusEvent;
//       hover: boolean;
//       hoverstart: { type: "hoverstart"; event: Event };
//       hoverend: { type: "hoverend"; event: Event };
//       gamepad: {
//         connected: boolean;
//         buttonA: boolean;
//         buttonB: boolean;
//         buttonX: boolean;
//         buttonY: boolean;
//         joystick: [number, number];
//         joystickRight: [number, number];
//         RB: boolean;
//         LB: boolean;
//         RT: boolean;
//         LT: boolean;
//         start: boolean;
//         select: boolean;
//         up: boolean;
//         down: boolean;
//         left: boolean;
//         right: boolean;
//       };
//       gamepadconnect: { type: "gamepadconnect"; event: Event; index: number; id: string };
//       gamepaddisconnect: { type: "gamepaddisconnect"; event: Event; index: number; id: string };
//     }
//   }
// }

// export {};
