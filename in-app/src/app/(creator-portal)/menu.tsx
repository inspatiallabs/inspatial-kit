import { SettingsIcon, APIIcon, InSpatialIcon } from "@inspatial/kit/icon";
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarSection,
  SidebarToggle,
} from "@inspatial/kit/navigation";
import { useTheme } from "@inspatial/kit/theme";
import { $ } from "@inspatial/kit/state";
import { useCreatorPortal } from "./state.ts";
import { Choose } from "@inspatial/kit/control-flow";

/***********************************(Window Navigation)*********************************** */
function WindowNavigation() {
  return (
    <>
      <Sidebar showToggle={true}>
        {/* Optional Header */}
        <SidebarHeader logo={<InSpatialIcon />} title="My App" />

        {/* Home Group */}
        <SidebarGroup
          id="home"
          title="Home"
          icon={<InSpatialIcon />}
          defaultExpanded={true}
        >
          <SidebarItem to="/dashboard" icon={<InSpatialIcon />}>
            Dashboard
          </SidebarItem>
          <SidebarItem to="/analytics" icon={<InSpatialIcon />}>
            Analytics
          </SidebarItem>
        </SidebarGroup>

        {/* Standalone Items */}
        <SidebarItem to="/projects" icon={<InSpatialIcon />}>
          Projects
        </SidebarItem>

        {/* Guests Group */}
        <SidebarGroup id="guests" title="Guests" icon={<InSpatialIcon />}>
          <SidebarItem to="/guest-list" icon={<InSpatialIcon />}>
            List
          </SidebarItem>
          <SidebarItem to="/grouping" icon={<InSpatialIcon />}>
            Grouping
          </SidebarItem>
          <SidebarItem to="/table-plan" icon={<InSpatialIcon />}>
            Table Plan
          </SidebarItem>
        </SidebarGroup>

        {/* More Standalone Items */}
        <SidebarItem to="/route-test" icon={<InSpatialIcon />}>
          Route Test
        </SidebarItem>
        <SidebarItem to="/editor" icon={<InSpatialIcon />}>
          Editor
        </SidebarItem>
      </Sidebar>
    </>
  );
}

/***********************************(Data Navigation)*********************************** */
function DataNavigation() {
  // Use shared editor state
  const isCollection = $(
    () => useCreatorPortal.mode.get().data === "collection"
  );
  const isInsights = $(() => useCreatorPortal.mode.get().data === "insights");
  const isApi = $(() => useCreatorPortal.mode.get().data === "api");

  return (
    <>
      <Sidebar showToggle={true}>
        <SidebarSection title="Editor II">
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
            icon={<InSpatialIcon />}
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
            icon={<InSpatialIcon />}
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
            icon={<InSpatialIcon />}
          >
            API Explorer
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    </>
  );
}

/*#################################(CREATOR PORTAL NAVIGATION)#################################*/
export function CreatorPortalNavigation() {
  return (
    <>
      <WindowNavigation />
      <DataNavigation />
    </>
  );
}
