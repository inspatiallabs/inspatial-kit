import { $ } from "@inspatial/state";
import { route } from "../../routes.tsx";
import { AppMenu } from "../../menu.tsx";

export function RouteTestWindow() {
  const currentPath = $(() => route.get());

  return (
    <>
      <AppMenu />
      <h1>Route API Test</h1>
      <div className="mt-3 p-3 border rounded">
        <div>
          <strong>Current path:</strong> {currentPath}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.navigate("https://www.google.com/")}
          >
            navigate("google.com")
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.navigate("/counter")}
          >
            navigate("/counter")
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.navigate("/projects")}
          >
            navigate("/projects")
          </button>

          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.redirect("/")}
          >
            redirect("/")
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.reload()}
          >
            reload()
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.resetScrollPosition()}
          >
            resetScrollPosition()
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.back()}
          >
            back()
          </button>
          <button
            className="px-2 py-1 border rounded"
          on:tap={() => route.forward()}
          >
            forward()
          </button>
        </div>
      </div>
    </>
  );
}


