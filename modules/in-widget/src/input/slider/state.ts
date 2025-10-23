import { createState } from "@in/teract/state";

/*############################(SLIDER STATE)############################*/
export const useSlider = createState.in({
  id: "slider-state",
  initialState: {
    /** Local dragging state to disable transitions during drag */
    dragging: false,
  },
  action: {
    startDrag: { key: "dragging", fn: () => true },
    endDrag: { key: "dragging", fn: () => false },
  },
});
