import type { StyleProps } from "@in/style";
import type { SidebarStyle } from "./style.ts";

/*################################(Base Types)################################*/

export interface SidebarMenuItem {
  id: string;
  title: string;
  icon?: JSX.Element;
  route?: string;
  disabled?: boolean;
  group?: string;
  isParent?: boolean;
}

/*################################(Component Props)################################*/

// Main Sidebar Props
export type SidebarProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.wrapper> & {
    minimized?: boolean;
    defaultMinimized?: boolean;
    onMinimizeChange?: (minimized: boolean) => void;
    children?: JSX.Element | JSX.Element[];
    showToggle?: boolean;
  };

// Sidebar Group Props (collapsible parent items)
export type SidebarGroupProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.group> & {
    id: string;
    title: string;
    icon?: JSX.Element;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandChange?: (expanded: boolean) => void;
  };

// Sidebar Item Props (individual menu items)
export type SidebarItemProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.item> & {
    to: string;
    icon?: JSX.Element;
    disabled?: boolean;
    active?: boolean;
    prefetch?: boolean;
    replace?: boolean;
    params?: Record<string, string>;
    query?: Record<string, string>;
    badge?: string | number;
    tooltip?: string;
  };

// Sidebar Toggle Button Props
export type SidebarToggleProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.toggle> & {
    minimized?: boolean;
    onToggle?: () => void;
    position?: "top" | "bottom" | "floating";
    icon?: {
      expand?: JSX.Element;
      collapse?: JSX.Element;
    };
  };

// Sidebar Section Props (for grouping items without collapsibility)
export type SidebarSectionProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.section> & {
    title?: string;
    divider?: boolean;
  };

// Sidebar Header Props
export type SidebarHeaderProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.header> & {
    logo?: JSX.Element;
    title?: string;
    subtitle?: string;
    minimized?: boolean;
  };

// Sidebar Footer Props
export type SidebarFooterProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.footer> & {
    minimized?: boolean;
  };

// Active Indicator (Pluck) Props
export type SidebarPluckProps = StyleProps<typeof SidebarStyle.pluck> & {
  active: boolean;
  minimized?: boolean;
  layoutId?: string;
};

/*################################(Configuration Types)################################*/

export interface SidebarConfig {
  minimizeOnMobile?: boolean;
  persistState?: boolean;
  closeOnRouteChange?: boolean;
  expandSingle?: boolean; // Only one group can be expanded at a time
  animationDuration?: number;
  tooltipDelay?: number;
}

/*################################(Event Types)################################*/

export interface SidebarEvents {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onGroupExpand?: (groupId: string) => void;
  onGroupCollapse?: (groupId: string) => void;
  onItemSelect?: (route: string) => void;
}
