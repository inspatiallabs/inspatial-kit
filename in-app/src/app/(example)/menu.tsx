import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarItem,
} from "@inspatial/kit/navigation";
import { InSpatialIcon } from "@inspatial/kit/icon";

export function Menu() {
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
          // defaultExpanded={true}
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

        {/* Examples Group */}
        <SidebarGroup id="examples" title="Examples" icon={<InSpatialIcon />}>
          <SidebarItem to="/counter" icon={<InSpatialIcon />}>
            Counter
          </SidebarItem>
          <SidebarItem to="/route-test" icon={<InSpatialIcon />}>
            Route Test
          </SidebarItem>
        </SidebarGroup>

        {/* More Standalone Items */}

        <SidebarItem to="/editor" icon={<InSpatialIcon />}>
          Editor
        </SidebarItem>
      </Sidebar>
    </>
  );
}
