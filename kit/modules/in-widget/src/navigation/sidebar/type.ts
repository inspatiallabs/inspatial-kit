import type { StyleProps } from "@in/style";
import type { SidebarStyle } from "./style.ts";
import type { RadioProps } from "@in/widget/input/choice-input/radio/type.ts";
import type { LinkProps } from "@in/widget/navigation/link/index.ts";

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

type SidebarSizeProps = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

// Main Sidebar Props
export type SidebarProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.wrapper> & {
    minimized?: boolean;
    defaultMinimized?: boolean;
    onMinimizeChange?: (minimized: boolean) => void;
    children?: JSX.Element | JSX.Element[];
    showToggle?: boolean;

    // Size configuration for different states
    minimizedSize?: SidebarSizeProps;
    expandedSize?: SidebarSizeProps;
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
// Sidebar Item Props (unified API for Link and Radio anatomies)
type SidebarItemBaseProps = JSX.SharedProps &
  StyleProps<typeof SidebarStyle.item> & {
    icon?: JSX.Element;
    children?: JSX.Element | JSX.Element[];
    disabled?: boolean;
    // Event handlers (Tab/Radio pattern)
    onChange?: (value: string | number | boolean) => void;
    'on:input'?: (value: string | number | boolean) => void;
    'on:change'?: (value: string | number | boolean) => void;
  };

// MPV: MultiPageView (Link anatomy)
export type SidebarItemMPVProps = SidebarItemBaseProps &
  Partial<LinkProps> & {
    routeView: 'MPV';
    to: LinkProps['to'];
    // Disallow SPV-only props
    selected?: never;
    defaultSelected?: never;
    name?: never;
    value?: never;
    // Navigation-specific
    activeMatch?: 'exact' | 'prefix' | 'custom';
    isActive?: (currentRoute: string) => boolean;
  };

// SPV: SinglePageView (Radio group anatomy)
export type SidebarItemSPVProps = SidebarItemBaseProps & {
  routeView: 'SPV';
  name: string;
  value: string;
  selected?: boolean | import('@in/teract/signal/index.ts').Signal<boolean>;
  defaultSelected?: boolean;
  // Disallow MPV-only props
  to?: never;
  params?: never;
  query?: never;
  replace?: never;
  prefetch?: never;
  protect?: never;
  activeMatch?: never;
  isActive?: never;
};

export type SidebarItemProps = SidebarItemMPVProps | SidebarItemSPVProps;

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

// Active Indicator Props
export type SidebarIndicatorProps = StyleProps<typeof SidebarStyle.indicator> & {
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
