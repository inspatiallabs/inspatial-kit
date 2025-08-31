import type { StyleProps } from "@in/style";
import type { TableStyle } from "./style.ts";
import type { ColumnDef } from "./src/types.ts";
import type { ContextMenuActionProps } from "../../navigation/context-menu/type.ts";
import type { DockProps } from "@in/widget/presentation/dock/type.ts";
import type { ButtonProps } from "@in/widget/ornament/button/type.ts";
import type { InputFieldProps } from "@in/widget/input/type.ts";
import type { ListProps } from "@in/widget/data-flow/list/type.ts";

/*####################################(TABLE WRAPPER PROPS)####################################*/

export type TableWrapperProps = StyleProps<typeof TableStyle.wrapper> &
  JSX.SharedProps;

/*####################################(TABLE HEADER PROPS)####################################*/

export type TableHeaderProps = StyleProps<typeof TableStyle.header> &
  JSX.SharedProps;

/*####################################(TABLE HEADER PROPS)####################################*/

export type TableHeaderColumnProps = StyleProps<typeof TableStyle.head> &
  JSX.SharedProps;

/*####################################(TABLE HEADER BAR PROPS)####################################*/

export interface TableHeaderBarPaginationProps extends ButtonProps {
  display?: boolean;
  prev?: ButtonProps;
  next?: ButtonProps;
}

export interface TableHeaderBarFilterProps extends ButtonProps {
  display?: boolean;
}

export interface TableHeaderBarSearchProps extends InputFieldProps {
  display?: boolean;
}

export interface TableHeaderBarActionsProps {
  display?: boolean;
  customActions?: ButtonProps[];
  importExport?: ButtonProps | boolean;
  newEntry?: ButtonProps | boolean;
}

export type TableHeaderBarProps = StyleProps<typeof TableStyle.head> &
  JSX.SharedProps & {
    pagination?: TableHeaderBarPaginationProps;
    filter?: TableHeaderBarFilterProps;
    search?: TableHeaderBarSearchProps;
    actions?: TableHeaderBarActionsProps;
  };

/*####################################(TABLE HEADER WRAPPER PROPS)####################################*/

export type TableHeaderWrapperProps = StyleProps<typeof TableStyle.header> &
  JSX.SharedProps & {
    headerNavigator?: unknown;
    headerRelations?: unknown;
    headerBar?: TableHeaderBarProps;
    headerColumn?: TableHeaderColumnProps;
  };

/*####################################(TABLE LIST PROPS)####################################*/

export type TableListProps = StyleProps<typeof TableStyle.list> &
  JSX.SharedProps & {
    each?: ListProps["each"];
    track?: ListProps["track"];
  };

/*####################################(TABLE FOOTER PROPS)####################################*/

export type TableFooterProps = StyleProps<typeof TableStyle.footer> &
  JSX.SharedProps;

/*####################################(TABLE ROW PROPS)####################################*/

export type TableRowProps = StyleProps<typeof TableStyle.row> & JSX.SharedProps;

/*####################################(TABLE CELL PROPS)####################################*/

export type TableCellProps = StyleProps<typeof TableStyle.cell> &
  JSX.SharedProps;

/*####################################(TABLE CAPTION PROPS)####################################*/

export type TableCaptionProps = StyleProps<typeof TableStyle.caption> &
  JSX.SharedProps;

/*####################################(TABLE PRIMITIVE PROPS)####################################*/
export type TablePrimitiveProps =
  | TableWrapperProps
  | TableHeaderProps
  | TableListProps
  | TableFooterProps
  | TableRowProps
  | TableHeaderColumnProps
  | TableHeaderBarProps
  | TableCellProps
  | TableCaptionProps;

/*####################################(TABLE PROPS)####################################*/

export type TableProps<TData, TValue> = TablePrimitiveProps & {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId: (row: TData) => string;

  filterColumn?: string;
  onRowClick?: (row: TData) => void;
  onRowChecked?: (row: TData, checked: boolean) => void;
  allChecked?: boolean;
  onAllChecked?: (checked: boolean) => void;
  checkedRows: Set<string>;
  contextMenuActions?: ContextMenuActionProps<TData>[];
  dockMenuActions?: DockProps[];

  //Table Primitive Composition Props
  // header?: TableHeaderWrapperProps;
  // list?: TableListProps;
  // row?: TableRowProps;
  // cell?: TableCellProps;
  // caption?: TableCaptionProps;
  // footer?: TableFooterProps;
};
