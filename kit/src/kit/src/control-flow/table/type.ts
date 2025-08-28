import type { StyleProps } from "@in/style";
import type { TableStyle } from "./style.ts";
import type { ColumnDef } from "./src/types.ts";
import type { ContextMenuActionProps } from "../../navigation/context-menu/type.ts";
import type { DockProps } from "../../presentation/dock/type.ts";

/*####################################(TABLE PRIMITIVE PROPS)####################################*/

export type TableWrapperProps = StyleProps<typeof TableStyle.wrapper> &
  JSX.SharedProps;
export type TableHeaderProps = StyleProps<typeof TableStyle.header> &
  JSX.SharedProps;
export type TableListProps = StyleProps<typeof TableStyle.body> &
  JSX.SharedProps & {
    each?: any; // Accept signal or array for internal List integration
    track?: any; // Optional track key for List
  };
export type TableFooterProps = StyleProps<typeof TableStyle.footer> &
  JSX.SharedProps;
export type TableRowProps = StyleProps<typeof TableStyle.row> & JSX.SharedProps;
export type TableHeadProps = StyleProps<typeof TableStyle.head> &
  JSX.SharedProps;
export type TableCellProps = StyleProps<typeof TableStyle.cell> &
  JSX.SharedProps;
export type TableCaptionProps = StyleProps<typeof TableStyle.caption> &
  JSX.SharedProps;

export type TablePrimitiveProps =
  | TableWrapperProps
  | TableHeaderProps
  | TableListProps
  | TableFooterProps
  | TableRowProps
  | TableHeadProps
  | TableCellProps
  | TableCaptionProps;

/*####################################(TABLE PROPS)####################################*/
export type TableProps<TData, TValue> = TablePrimitiveProps & {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  onRowClick?: (row: TData) => void;
  onRowChecked?: (row: TData, checked: boolean) => void;
  allChecked?: boolean;
  onAllChecked?: (checked: boolean) => void;
  getRowId: (row: TData) => string;
  checkedRows: Set<string>;
  isPublic?: boolean;
  contextMenuActions?: ContextMenuActionProps<TData>[];
  dockMenuActions?: DockProps[];
};
