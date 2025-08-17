import { createState } from "@inspatial/kit/state";

/*###################################(TYPES)###################################*/

/*###################################(STATE)###################################*/

export const useAuth = createState.in({
  id: "auth",
  initialState: {},
  action: {},
  storage: {}
});
