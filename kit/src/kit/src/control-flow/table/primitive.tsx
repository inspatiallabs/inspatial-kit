import { TableStyle } from "./style.ts";
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableRowProps,
  TableWrapperProps,
  TablePrimitiveProps,
} from "./type.ts";

/*####################################(TABLE HEADER)####################################*/
export function TableHeader({
  className,
  format,
  $ref,
  ...rest
}: TableHeaderProps) {
  return (
    <>
      <thead
        $ref={$ref}
        className={TableStyle.header.getStyle({ className, format })}
        {...rest}
      />
    </>
  );
}

/*####################################(TABLE BODY)####################################*/
export function TableBody({
  className,
  format,
  $ref,
  ...rest
}: TableBodyProps) {
  return (
    <tbody
      $ref={$ref}
      className={TableStyle.body.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE FOOTER)####################################*/
export function TableFooter({
  className,
  format,
  $ref,
  ...rest
}: TableFooterProps) {
  return (
    <tfoot
      $ref={$ref}
      className={TableStyle.footer.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE ROW)####################################*/
export function TableRow({ className, format, $ref, ...rest }: TableRowProps) {
  return (
    <tr
      $ref={$ref}
      className={TableStyle.row.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE HEAD)####################################*/

export function TableHead({
  className,
  format,
  $ref,
  ...rest
}: TableHeadProps) {
  return (
    <th
      $ref={$ref}
      className={TableStyle.head.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE CELL)####################################*/
export function TableCell({
  className,
  format,
  $ref,
  ...rest
}: TableCellProps) {
  return (
    <td
      $ref={$ref}
      className={TableStyle.cell.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE CAPTION)####################################*/
export function TableCaption({
  className,
  format,
  $ref,
  ...rest
}: TableCaptionProps) {
  return (
    <caption
      $ref={$ref}
      className={TableStyle.caption.getStyle({ className, format })}
      {...rest}
    />
  );
}

/*####################################(TABLE)####################################*/
export function TableWrapper({
  className,
  format,
  $ref,
  ...rest
}: TableWrapperProps) {
  return (
    <table
      $ref={$ref}
      className={TableStyle.wrapper.getStyle({ className, format })}
      {...rest}
    />
  );
}
