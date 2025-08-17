import { $ } from "@inspatial/kit/state";
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
          {/* Named route navigation */}
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("home")}
          >
            navigateTo("home")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("counter")}
          >
            navigateTo("counter")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("projects")}
          >
            navigateTo("projects")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("routeTest")}
          >
            navigateTo("routeTest")
          </button>

          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("https://www.google.com/")}
          >
            navigate("google.com")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("/counter")}
          >
            navigate("/counter")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.to("/projects")}
          >
            navigate("/projects")
          </button>

          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.redirect("/")}
          >
            redirect("/")
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.reload()}
          >
            reload()
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.resetScrollPosition()}
          >
            resetScrollPosition()
          </button>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            on:tap={() => route.back()}
          >
            back()
          </button>
          <button
            type="button"
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
