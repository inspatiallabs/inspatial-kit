import { createState } from "@inspatial/kit/state";
import { incloud } from "@inspatial/kit/cloud";
import type { SessionData, SocketStatus } from "@inspatial/kit/cloud";
import type { AuthProps } from "./type.ts";

/*######################### (STATE) #########################*/

export const useAuth = createState.in({
  initialState: <AuthProps>{
    user: null,
    status: "connecting" as SocketStatus,
    loading: false,
    error: "",
    users: [],
  },
  action: {
    setUser: { key: "user", fn: (_c: any, u: SessionData | null) => u },
    setStatus: { key: "status", fn: (_c: any, s: AuthProps["status"]) => s },
    setLoading: { key: "loading", fn: (_c: any, b: boolean) => b },
    setError: { key: "error", fn: (_c: any, m: string) => m },
    setUsers: {
      key: "users",
      fn: (_c: any, rows: Array<Record<string, unknown>>) => rows,
    },
    // Async workflows wrapped in trigger fns; return current while doing side-effects
    authCheck: {
      key: "user",
      fn: (current: SessionData | null) => {
        (async () => {
          const res = await incloud.api.auth.authCheck();
          if (res && typeof res === "object") {
            try {
              useAuth.action.setUser(res as unknown as SessionData);
            } catch {
              /* ignore */
            }
          }
        })();
        return current;
      },
      options: { name: "auth-check" },
    },
    login: {
      key: "loading",
      fn: (loading: boolean, email: string, password: string) => {
        (async () => {
          try {
            useAuth.action.setLoading(true);
            const user = await incloud.api.auth.login(email, password);
            useAuth.action.setUser(user as unknown as SessionData);
          } catch (e: any) {
            useAuth.action.setError(e?.message || "Login failed");
          } finally {
            useAuth.action.setLoading(false);
          }
        })();
        return loading;
      },
      options: { name: "auth-login" },
    },
    logout: {
      key: "user",
      fn: (current: SessionData | null) => {
        (async () => {
          await incloud.api.auth.logout();
          useAuth.action.setUser(null);
        })();
        return current;
      },
      options: { name: "auth-logout" },
    },
    getUsers: {
      key: "users",
      fn: (current: Array<Record<string, unknown>>) => {
        (async () => {
          try {
            const list = await incloud.api.entry.getEntryList("user");
            const rows = (list as any)?.rows ?? [];
            useAuth.action.setUsers(rows);
          } catch {
            /* ignore */
          }
        })();
        return current;
      },
      options: { name: "auth-load-users" },
    },
  },
  storage: { key: "auth", backend: "local", include: ["user"] },
});

// Attach a runtime action to ensure live status subscription once
let wired = false;
useAuth.addAction?.("ensureLive", {
  target: () => useAuth.status,
  fn: (current: SessionData["status"]) => {
    if (wired) return current;
    wired = true;
    try {
      const id = incloud.live.onConnectionStatus((s: AuthProps["status"]) =>
        useAuth.action.setStatus(s)
      );
      try {
        const currentStatus = (incloud.live as any).status as
          | SessionData["status"]
          | undefined;
        if (currentStatus) useAuth.action.setStatus(currentStatus);
      } catch {}
      (globalThis as any).inauthstatusid = id;
    } catch {}
    return current;
  },
});
