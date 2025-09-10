import { $ } from "@inspatial/kit/state";
import { route } from "../../routes.tsx";
import { EditorNavigation } from "../../(editor)/menu.tsx";
import { XStack } from "@inspatial/kit/structure";

export function RouteTestWindow() {
  const currentPath = $(() => route.get());

  return (
    <>
      <XStack
        style={{
          web: {
            minWidth: "100%",
            maxWidth: "100%",
            height: "100vh",
            gap: "2px",
          },
        }}
      >
        {/*#################################(EDITOR NAVIGATION)#################################*/}

        <EditorNavigation />

        {/*#################################(ROUTE TEST VIEW)#################################*/}
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
      </XStack>
    </>
  );
}
