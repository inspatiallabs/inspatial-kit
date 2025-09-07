- **Extensible Architecture:** Decouples component logic from rendering environment.
- **`createRenderer(nodeOps, rendererID?)`:** Creates a custom renderer.
- **`DOMRenderer(InTrigger)` (`@inspatial/kit/renderer`):** For interactive web applications.
  \_ **Handling Dynamic HTML Content:** For inserting dynamic HTML (e.g., from APIs), prefer parsing the HTML into a `DocumentFragment` and rendering it directly within the component. This is more robust and integrates better with InSpatial's retained mode rendering than using `innerHTML` directly, which can have security implications and reconciliation challenges.
