import type { SessionData, SocketStatus } from "@inspatial/kit/cloud";

/*######################### (TYPES) #########################*/

export interface AuthProps {
  user: SessionData | null;
  status: SocketStatus;
  loading: boolean;
  error: string;
  users: Array<Record<string, unknown>>;
}
