import { Stack } from "@inspatial/kit/structure";
import { Show } from "@inspatial/kit/control-flow";
import { $ } from "@inspatial/kit/state";
import { useAuth } from "./(auth)/state.ts";
import { ProjectsWindow } from "./(dashboard)/projects/window.tsx";
import { AuthWindow } from "./(auth)/window.tsx";

export function AppWindow() {
  return (
    <>
      <Stack 
        // on:beforeMount={() => {
        //   const existing = useAuth.user.peek();
        //     useAuth.view.value = existing ? "dashboard" : "auth";
        // }}
        className="overflow-hidden h-screen w-screen"
      >
        <Show
          when={
            {}
            // $(() => useAuth.view.peek() === "auth")
          }
          otherwise={() => <ProjectsWindow />}
        >
          <AuthWindow />
        </Show>
      </Stack>
    </>
  );
}
