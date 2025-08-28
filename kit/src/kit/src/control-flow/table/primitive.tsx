import { TableStyle } from "./style.ts";
import type {
  TableListProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableRowProps,
  TableWrapperProps,
} from "./type.ts";

/*####################################(TABLE HEADER)####################################*/
export function TableHeader({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableHeaderProps) {
  return (
    <>
      <thead
        $ref={$ref}
        className={TableStyle.header.getStyle({
          class: className as JSX.SharedProps["className"],
          format,
        } as any)}
        {...rest}
      >
        {children}
      </thead>
    </>
  );
}

/*####################################(TABLE LIST/BODY)####################################*/
export function TableList({
  className,
  format,
  $ref,
  children,
  each,
  track,
  ...rest
}: TableListProps) {
  if (each) {
    const { lazy } = require("../lazy/index.ts");
    const List = lazy(() => import("../list/index.ts"), "List");
    return (
      <tbody
        $ref={$ref}
        className={TableStyle.list.getStyle({
          class: className as JSX.SharedProps["className"],
          format,
        } as any)}
        {...rest}
      >
        <List each={each} track={track}>
          {children as any}
        </List>
      </tbody>
    );
  }

  return (
    <tbody
      $ref={$ref}
      className={TableStyle.list.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </tbody>
  );
}

/*####################################(TABLE FOOTER)####################################*/
export function TableFooter({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableFooterProps) {
  return (
    <tfoot
      $ref={$ref}
      className={TableStyle.footer.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </tfoot>
  );
}

/*####################################(TABLE ROW)####################################*/
export function TableRow({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableRowProps) {
  return (
    <tr
      $ref={$ref}
      className={TableStyle.row.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </tr>
  );
}

/*####################################(TABLE HEAD)####################################*/

export function TableHead({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableHeadProps) {
  return (
    <th
      $ref={$ref}
      className={TableStyle.head.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </th>
  );
}

/*####################################(TABLE CELL)####################################*/
export function TableCell({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableCellProps) {
  return (
    <td
      $ref={$ref}
      className={TableStyle.cell.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </td>
  );
}

/*####################################(TABLE CAPTION)####################################*/
export function TableCaption({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableCaptionProps) {
  return (
    <caption
      $ref={$ref}
      className={TableStyle.caption.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </caption>
  );
}

/*####################################(TABLE)####################################*/
export function TableWrapper({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableWrapperProps) {
  return (
    <table
      $ref={$ref}
      className={TableStyle.wrapper.getStyle({
        class: className as JSX.SharedProps["className"],
        format,
      } as any)}
      {...rest}
    >
      {children}
    </table>
  );
}
