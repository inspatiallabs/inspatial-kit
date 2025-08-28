import type { StyleProps } from "@in/style";
import type { TableStyle } from "./style.ts";
import type { ColumnDef } from "./src/types.ts";
import type { ContextMenuActionProps } from "@in/kit/navigation/context-menu/type.ts";
import type { DockProps } from "@in/kit/presentation/dock/type.ts";

/*####################################(TABLE PRIMITIVE PROPS)####################################*/

export type TableWrapperProps = StyleProps<typeof TableStyle.wrapper> &
  JSX.SharedProps;
export type TableHeaderProps = StyleProps<typeof TableStyle.header> &
  JSX.SharedProps;
export type TableBodyProps = StyleProps<typeof TableStyle.body> &
  JSX.SharedProps;
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
  | TableBodyProps
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
  /**
   * if set to true, the guest list will be displayed in public mode disabling all form of data mutation
   */
  isPublic?: boolean;
  contextMenuActions: ContextMenuActionProps<TData>[];
  dockMenuActions: DockProps[];
};
