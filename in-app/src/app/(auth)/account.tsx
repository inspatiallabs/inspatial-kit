import { createState } from "@inspatial/kit/state";
import { Avatar } from "@inspatial/kit/avatar";
import { Slot, YStack } from "@inspatial/kit/structure";
import { Text } from "@inspatial/kit/typography";
import { loadUsers } from "./state.ts";
import { incloud } from "@inspatial/kit/cloud/index.ts";
import { List } from "@inspatial/kit/control-flow";

export function Account() {
  //*************************(STATE)*************************//
  const useAccount = createState({
    user: null as unknown | null,
    users: [] as unknown[],
    status: "connecting" as string,
    toast: "" as string,
  });

  return (
    <>
      <h1>User Account View</h1>
      <Slot
        on:mount={async () => {
          try {
            const user = await incloud.api.auth.login(
              "admin@user.com",
              "password"
            );
            useAccount.user.set(user);
            const list = await incloud.api.entry.getEntryList("user");
            const rows = (list as any)?.rows ?? [];
            useAccount.users.set(rows);
          } catch (e) {
            console.error("Cloud init error:", e);
          }
        }}
        on:cloudStatus={(info: { status: string }) => {
          useAccount.status.set(info.status);
        }}
        on:cloudReconnected={() => {
          // re-fetch on reconnect
          (async () => {
            try {
              const list = await loadUsers();
              const rows = (list as any)?.rows ?? [];
              useAccount.users.set(rows);
            } catch (e) {
              console.error("Refetch on reconnect error:", e);
            }
          })();
        }}
        on:cloudNotify={(n: {
          type: string;
          title?: string;
          message: string;
        }) => {
          useAccount.toast.set(`${n.type}: ${n.message}`);
          setTimeout(() => useAccount.toast.set(""), 2500);
        }}
      />
      <YStack className="w-11/12 xl:w-9/12 m-auto mt-2 items-center gap-2">
        <Avatar
          size="md"
          status={$(() =>
            useAccount.status.get() === "open" ||
            useAccount.status.get() === "reconnected"
              ? "live"
              : (useAccount.status.get() as any)
          )}
          format="initials"
          initials={$(() => {
            const u = useAccount.user.peek() as any;
            const name = u?.firstName || u?.email || "U";
            return String(name).slice(0, 2).toUpperCase();
          })}
          colorCast="color-mix(in oklab, var(--brand) 15%, var(--surface))"
          hasAIBadge={$(() => {
            const u = useAccount.user.peek() as any;
            return !!u?.systemAdmin;
          })}
        />
        <Text className="text-xs text-(--primary)">
          {() => `Cloud: ${useAccount.status}`}
        </Text>
      </YStack>

      <Text className="block w-11/12 xl:w-9/12 m-auto mt-1 text-xs text-(--primary)">
        {useAccount.toast}
      </Text>
      <Text className="block w-11/12 xl:w-9/12 m-auto mt-3 text-xs text-(--primary) break-words whitespace-pre-wrap">
        {useAccount.user.peek()}
      </Text>
      <List each={useAccount.users} track="id">
        {(row: any) => (
          <Text className="flex flex-col text-sm text-(--primary) mb-2 bg-(--surface) p-3 rounded">
            {(() => {
              try {
                return row?.firstName || row?.email || JSON.stringify(row);
              } catch {
                return "";
              }
            })()}
          </Text>
        )}
      </List>
    </>
  );
}
