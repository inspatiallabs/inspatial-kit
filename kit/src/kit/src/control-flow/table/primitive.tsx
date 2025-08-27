import { TableStyle } from "./style.ts";
import type { TableProps } from "./type.ts";

/*####################################(TABLE HEADER)####################################*/
export function TableHeader({ className, $ref, ...rest }: TableProps) {
  return (
    <>
      <thead
        $ref={$ref}
        className={TableStyle.getStyle({ className, header: "base" })}
        {...rest}
      />
    </>
  );
}

/*####################################(TABLE BODY)####################################*/
export function TableBody({ className, $ref, ...rest }: TableProps) {
  return (
    <tbody
      $ref={$ref}
      className={TableStyle.getStyle({ className, body: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE FOOTER)####################################*/
export function TableFooter({ className, $ref, ...rest }: TableProps) {
  return (
    <tfoot
      $ref={$ref}
      className={TableStyle.getStyle({ className, footer: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE ROW)####################################*/
export function TableRow({ className, $ref, ...rest }: TableProps) {
  return (
    <tr
      $ref={$ref}
      className={TableStyle.getStyle({ className, row: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE HEAD)####################################*/

export function TableHead({ className, $ref, ...rest }: TableProps) {
  return (
    <th
      $ref={$ref}
      className={TableStyle.getStyle({ className, head: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE CELL)####################################*/
export function TableCell({ className, $ref, ...rest }: TableProps) {
  return (
    <td
      $ref={$ref}
      className={TableStyle.getStyle({ className, cell: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE CAPTION)####################################*/
export function TableCaption({ className, $ref, ...rest }: TableProps) {
  return (
    <caption
      $ref={$ref}
      className={TableStyle.getStyle({ className, caption: "base" })}
      {...rest}
    />
  );
}
