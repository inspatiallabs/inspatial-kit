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

export function EditorNavigation() {
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
