import { createState } from "@inspatial/kit/state";

/*###################################(TYPES)###################################*/
export type AuthUser = {
  name: string;
  email: string;
};

export type AuthView = "auth" | "dashboard";

/*###################################(STATE)###################################*/
export const useAuth = createState.in({
  id: "auth",
  initialState: {
    user: undefined as AuthUser | undefined,
    view: "auth" as AuthView,
  },
  action: {},
  storage: { key: "auth", backend: "local" },
});
