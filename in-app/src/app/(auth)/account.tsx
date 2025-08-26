import { createState, $ } from "@inspatial/kit/state";
import { Avatar } from "@inspatial/kit/ornament";
import { Slot, YStack } from "@inspatial/kit/structure";
import { Text } from "@inspatial/kit/typography";
import { useAuth } from "./state.ts";
import { List, Table } from "@inspatial/kit/control-flow";
import type { SessionData } from "@inspatial/kit/cloud";

export function AccountView() {
  //*************************(UI STATE)*************************//
  const ui = createState({
    toast: "" as string,
  });

  return (
    <>
      <Slot
        on:mount={() => {
          try {
            useAuth.action.authCheck();
            useAuth.action.getUsers();
          } catch (e) {
            console.error("Cloud init error:", e);
          }
        }}
        on:cloudStatus={(info: { status: string }) => {
          try {
            useAuth.action.setStatus(info.status as any);
          } catch {
            /* ignore */
          }
        }}
        on:cloudReconnected={() => {
          // re-fetch on reconnect via auth action
          try {
            useAuth.action.getUsers();
          } catch (e) {
            console.error("Refetch on reconnect error:", e);
          }
        }}
        on:cloudNotify={(n: {
          type: string;
          title?: string;
          message: string;
        }) => {
          ui.toast.set(`${n.type}: ${n.message}`);
          setTimeout(() => ui.toast.set(""), 2500);
        }}
      />
      <YStack className="w-11/12 xl:w-9/12 m-auto mt-2 items-center gap-2">
        <Avatar
          size="md"
          status={$(() =>
            useAuth.status.get() === "open" ||
            useAuth.status.get() === "reconnected"
              ? "live"
              : (useAuth.status.get() as any)
          )}
          format="initials"
          initials={$(() => {
            const u = useAuth.user.peek() as any;
            const name = u?.firstName || u?.email || "U";
            return String(name).slice(0, 2).toUpperCase();
          })}
          colorCast="color-mix(in oklab, var(--brand) 15%, var(--surface))"
          hasAIBadge={$(() => {
            const u = useAuth.user.peek() as any;
            return !!u?.systemAdmin;
          })}
        />
        <Text className="text-xs text-(--primary)">
          {() => `Cloud: ${useAuth.status}`}
        </Text>
      </YStack>

      <Text className="block w-11/12 xl:w-9/12 m-auto mt-1 text-xs text-(--primary)">
        {ui.toast}
      </Text>
      <Text className="block w-11/12 xl:w-9/12 m-auto mt-3 text-xs text-(--primary) break-words whitespace-pre-wrap">
        {useAuth.user.peek()}
      </Text>
      <List each={useAuth.users} track="id">
        {(user: SessionData) => (
          <Text className="flex flex-col text-sm text-(--primary) mb-2 bg-(--surface) p-3 rounded">
            {user?.email}
          </Text>
        )}
      </List>
      Table
    </>
  );
}
