import { Topbar } from "@in/widget/navigation/index.ts";

export function CreatorPortalTopbarMenu() {
  return (
    <>
      <Topbar
        data-inmotion="fade-d duration-500 once"
        children={{
          left: { preset: "1" },
          center: { preset: "2" },
          right: { preset: "3" },
        }}
      />
    </>
  );
}
