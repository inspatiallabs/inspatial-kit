import { createState } from "@inspatial/kit/state";
import { incloud } from "@inspatial/kit/cloud";
import type {
  SessionData,
  SocketStatus,
  GetListResponse,
} from "@inspatial/kit/cloud";

export const useAuth = createState.in({
  initialState: {
    user: null as SessionData | null,
    status: "connecting" as SocketStatus,
    loading: false as boolean,
    error: "" as string,
  },
  action: {
    setUser: { key: "user", fn: (_c: any, u: SessionData | null) => u },
    setStatus: { key: "status", fn: (_c: any, s: SocketStatus) => s },
    setLoading: { key: "loading", fn: (_c: any, b: boolean) => b },
    setError: { key: "error", fn: (_c: any, m: string) => m },
  },
});

export async function authCheck(): Promise<SessionData | false> {
  const res = await incloud.api.auth.authCheck();
  if (res && typeof res === "object") {
    try {
      useAuth.action.setUser(res as SessionData);
    } catch {}
  }
  return res;
}

export async function login(email: string, password: string): Promise<void> {
  try {
    useAuth.action.setLoading(true);
    const user = await incloud.api.auth.login(email, password);
    useAuth.action.setUser(user);
  } catch (e: any) {
    useAuth.action.setError(e?.message || "Login failed");
  } finally {
    useAuth.action.setLoading(false);
  }
}

export async function logout(): Promise<void> {
  await incloud.api.auth.logout();
  useAuth.action.setUser(null);
}

export async function loadUsers(): Promise<GetListResponse | null> {
  try {
    const list = await incloud.api.entry.getEntryList("user");
    return list as any;
  } catch {
    return null;
  }
}
