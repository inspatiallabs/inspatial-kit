import {
  SettingsIcon,
  APIIcon,
  InSpatialIcon,
  DBIcon,
  LeaderboardIcon,
} from "@inspatial/kit/icon";
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarToggle,
} from "@inspatial/kit/navigation";
import { $ } from "@inspatial/kit/state";
import { useCreatorPortal } from "./state.ts";
import { Choose } from "@inspatial/kit/control-flow";

/***********************************(Spec Navigation)*********************************** */
// soon
/***********************************(Window Navigation)*********************************** */
// soon
/***********************************(Scene Navigation)*********************************** */
// soon
/***********************************(Data Navigation)*********************************** */
function DataExplorerPanel() {
  // Use shared editor state
  const isCollection = $(
    () => useCreatorPortal.mode.get().data === "collection"
  );
  const isInsights = $(() => useCreatorPortal.mode.get().data === "insights");
  const isApi = $(() => useCreatorPortal.mode.get().data === "api");

  return (
    <>
      <Sidebar defaultMinimized={true} style={{ web: { gap: "52px" } }}>
        <SidebarItem
          routeView="SPV"
          name="editor-view"
          value="collection"
          selected={isCollection}
          on:change={() =>
            useCreatorPortal.action.setMode({
              ...useCreatorPortal.mode.peek(),
              data: "collection",
            })
          }
          icon={
            <DBIcon data-inmotion="split-item split-flip-dr delay-2000 duration-800 once" scale="10xs" />
          }
        >
          Collection
        </SidebarItem>
        <SidebarItem
          routeView="SPV"
          name="editor-view"
          value="insights"
          selected={isInsights}
          on:change={() =>
            useCreatorPortal.action.setMode({
              ...useCreatorPortal.mode.peek(),
              data: "insights",
            })
          }
          icon={
            <LeaderboardIcon
              data-inmotion="split-item split-zoomin-dl once"
              scale="10xs"
            />
          }
        >
          Insights
        </SidebarItem>
        <SidebarItem
          routeView="SPV"
          name="editor-view"
          value="api"
          selected={isApi}
          on:change={() =>
            useCreatorPortal.action.setMode({
              ...useCreatorPortal.mode.peek(),
              data: "api",
            })
          }
          icon={
            <APIIcon
              data-inmotion="split-item split-fade-r once"
              scale="10xs"
            />
          }
        >
          API Explorer
        </SidebarItem>
      </Sidebar>
    </>
  );
}

/*#################################(CREATOR PORTAL SIDEBAR MENU)#################################*/
export function CreatorPortalSidebarMenu() {
  return (
    <>
      <DataExplorerPanel />
    </>
  );
}
