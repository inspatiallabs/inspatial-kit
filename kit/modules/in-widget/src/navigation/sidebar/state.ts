import { createState } from "@in/teract/state/index.ts";

/*################################(Sidebar State)################################*/

export const useSidebar = createState.in({
  id: "sidebar",
  initialState: {
    isMinimized: false,
    hoveredGroup: null as string | null,
    expandedGroups: {} as Record<string, boolean>,
    activeRoute: "",
  },
  action: {
    setMinimized: {
      key: "isMinimized",
      fn: (_: boolean, minimized: boolean) => minimized,
    },
    toggleGroup: {
      key: "expandedGroups",
      fn: (current: Record<string, boolean>, groupId: string) => ({
        ...current,
        [groupId]: !current[groupId],
      }),
    },
    setHoveredGroup: {
      key: "hoveredGroup",
      fn: (_: string | null, groupId: string | null) => groupId,
    },
    setActiveRoute: {
      key: "activeRoute",
      fn: (_: string, route: string) => route,
    },
    expandGroup: {
      key: "expandedGroups",
      fn: (current: Record<string, boolean>, groupId: string) => ({
        ...current,
        [groupId]: true,
      }),
    },
    collapseGroup: {
      key: "expandedGroups",
      fn: (current: Record<string, boolean>, groupId: string) => ({
        ...current,
        [groupId]: false,
      }),
    },
    collapseAllGroups: {
      key: "expandedGroups",
      fn: () => ({}),
    },
  },
});
