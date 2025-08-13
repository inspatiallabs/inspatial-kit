import { Link } from "@inspatial/kit";
import { useTheme } from "./(extensions)/in-theme/index.ts";
import { $ } from "@inspatial/state";

export function AppMenu() {
  return (
    <>
      <nav className="flex gap-3 mt-3">
        <a href="/">Home</a>
        <a href="/counter">Counter</a>
        <a href="/projects">Projects</a>
      </nav>
      <div className="flex gap-3 mt-6">
        <div
          role="button"
          className="px-3 py-1 border rounded cursor-pointer"
          on:tap={async (e: any) => {
            e?.preventDefault?.();
            const rt: any = (globalThis as any).InRoute;
            await rt?.navigate?.("/");
          }}
        >
          Home (tap)
        </div>
        <div
          role="button"
          className="px-3 py-1 border rounded cursor-pointer"
          on:tap={async (e: any) => {
            e?.preventDefault?.();
            const rt: any = (globalThis as any).InRoute;
            await rt?.navigate?.("/counter");
          }}
        >
          Counter (tap)
        </div>
        <div
          role="button"
          className="px-3 py-1 border rounded cursor-pointer"
          on:tap={async (e: any) => {
            e?.preventDefault?.();
            const rt: any = (globalThis as any).InRoute;
            await rt?.navigate?.("/projects");
          }}
        >
          Projects (tap)
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        {/* Link-based navigation (3rd variant) */}
        <Link to="/">Home (Link)</Link>
        <Link to="/counter">Counter (Link)</Link>
        <Link to="/projects">Projects (Link)</Link>
      </div>
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <button
          type="button"
          style={{
            web: {
              backgroundColor: "yellow",
              color: "black",
              fontSize: "16px",
              fontWeight: "900",
              padding: "10px",
            },
          }}
          on:tap={() => useTheme.action.setToggle()}
        >
          {$(() =>
            String(useTheme.mode) === "dark"
              ? "Switch to Light"
              : "Switch to Dark"
          )}
        </button>
      </div>
    </>
  );
}
