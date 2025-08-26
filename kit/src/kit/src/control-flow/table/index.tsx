import { YStack } from "../../structure/stack/index.tsx";
import { TableStyle } from "./style.ts";
import type { TableProps } from "./type.ts";

/*####################################(TABLE HEADER)####################################*/
function TableHeader({ className, $ref, ...rest }: TableProps) {
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
function TableBody({ className, $ref, ...rest }: TableProps) {
  return (
    <tbody
      $ref={$ref}
      className={TableStyle.getStyle({ className, body: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE FOOTER)####################################*/
function TableFooter({ className, $ref, ...rest }: TableProps) {
  return (
    <tfoot
      $ref={$ref}
      className={TableStyle.getStyle({ className, footer: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE ROW)####################################*/
function TableRow({ className, $ref, ...rest }: TableProps) {
  return (
    <tr
      $ref={$ref}
      className={TableStyle.getStyle({ className, row: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE HEAD)####################################*/

function TableHead({ className, $ref, ...rest }: TableProps) {
  return (
    <th
      $ref={$ref}
      className={TableStyle.getStyle({ className, head: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE CELL)####################################*/
function TableCell({ className, $ref, ...rest }: TableProps) {
  return (
    <td
      $ref={$ref}
      className={TableStyle.getStyle({ className, cell: "base" })}
      {...rest}
    />
  );
}

/*####################################(TABLE CAPTION)####################################*/
function TableCaption({ className, $ref, ...rest }: TableProps) {
  return (
    <caption
      $ref={$ref}
      className={TableStyle.getStyle({ className, caption: "base" })}
      {...rest}
    />
  );
}

/*######################################(TABLE)######################################*/
export function Table({ className, ...rest }: TableProps) {
  return (
    <>
      <YStack className="relative w-auto">
        <TableHeader className={className} {...rest} />
        <TableBody className={className} {...rest} />
        <TableFooter className={className} {...rest} />
        <TableCaption className={className} {...rest} />
        <TableRow className={className} {...rest} />
        <TableHead className={className} {...rest} />
        <TableCell className={className} {...rest} />
      </YStack>
    </>
  );
}
