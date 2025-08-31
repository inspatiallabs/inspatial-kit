import { TableStyle } from "./style.ts";
import type {
  TableListProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeaderColumnProps,
  TableHeaderBarProps,
  TableRowProps,
  TableWrapperProps,
} from "./type.ts";
import { Button, ButtonProps } from "../../ornament/button/index.ts";
import { Slot, XStack } from "../../structure/index.ts";
import { Text } from "../../typography/index.ts";
import { CaretLeftPrimeIcon } from "../../icon/caret-left-prime-icon.tsx";
import { CaretRightPrimeIcon } from "../../icon/caret-right-prime-icon.tsx";
import { FunnelIcon } from "../../icon/funnel-icon.tsx";
import { ShareIIIcon } from "../../icon/share-ii-icon.tsx";
import { InputField } from "../../input/inputfield/inputfield.native.tsx";

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
    const { lazy } = require("@in/widget/performance/lazy/index.ts");
    const List = lazy(() => import("@in/widget/data-flow/list/index.ts"), "List");
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

/*####################################(TABLE HEADER COLUMN)####################################*/

export function TableHeaderColumn({
  className,
  format,
  $ref,
  children,
  ...rest
}: TableHeaderColumnProps) {
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

/*####################################(TABLE HEADER BAR)####################################*/

export function TableHeaderBar({
  className,
  format,
  $ref,
  children,
  pagination,
  filter,
  search,
  actions,
  ...rest
}: TableHeaderBarProps) {
  const showPagination = pagination?.display ?? true;
  const showFilter = filter?.display ?? true;
  const showSearch = search?.display ?? true;
  const showActions = actions?.display ?? true;
  const importExport = actions?.importExport ?? true;
  const newEntry = actions?.newEntry ?? true;

  // Strip display before spreading into elements
  const {
    display: _pDisp,
    prev,
    next,
    ...paginationRest
  } = pagination || ({} as any);
  const { display: _fDisp, ...filterRest } = filter || ({} as any);
  const { display: _sDisp, ...searchRest } = search || ({} as any);
  const {
    display: _aDisp,
    actions: customActions = [],
    ...actionsRest
  } = actions || ({} as any);

  return (
    <>
      <XStack
        style={{
          web: {
            width: "100%",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingRight: "50px",
            paddingLeft: "10px",
            backgroundColor: "var(--surface)",
            marginBottom: "2px",
          },
        }}
        {...rest}
      >
        {/*----------------------(Paginate With Filters)----------------------*/}
        {showPagination && (
          <XStack
            style={{
              web: {
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              },
            }}
            {...(paginationRest as any)}
          >
            {/***********(Paginated Buttons)************/}
            <Button format="background" size="lg" {...(prev as any)}>
              <CaretLeftPrimeIcon />
            </Button>
            <Button format="background" size="lg" {...(next as any)}>
              <CaretRightPrimeIcon />
            </Button>

            {/***********(Filter Button)************/}
            {showFilter && (
              <Button
                format="outlineBackground"
                style={{
                  web: {
                    color: "var(--secondary)",
                    borderRadius: "8px",
                    padding: "0px 6px 0px 10px",
                  },
                }}
                {...(filterRest as any)}
              >
                <XStack gap={6} align="center">
                  <Text>Filter</Text>
                  <Slot
                    style={{
                      web: {
                        backgroundColor: "var(--background)",
                        borderRadius: "6px",
                        width: "32px",
                        height: "32px",
                      },
                    }}
                  >
                    <FunnelIcon
                      size="md"
                      style={{
                        web: {
                          padding: "4px",
                        },
                      }}
                    />
                  </Slot>
                </XStack>
              </Button>
            )}
          </XStack>
        )}
        {/*-------------------------(Search)-----------------------*/}
        {showSearch && (
          <InputField
            variant="searchfield"
            format="base"
            style={{
              web: {
                width: "100%",
                marginRight: "10px",
                marginLeft: "10px",
              },
            }}
            {...(searchRest as any)}
          />
        )}

        {/*-------------------------(Actions)-----------------------*/}
        {showActions && (
          <>
            <XStack gap={10}>
              {/***********(Import/Export Button)************/}
              {importExport && (
                <Button
                  format="outlineBackground"
                  size="lg"
                  style={{
                    web: {
                      color: "var(--primary)",
                      borderRadius: "8px",
                      padding: "4px",
                    },
                  }}
                  {...(importExport as ButtonProps)}
                >
                  {importExport && <ShareIIIcon />}
                </Button>
              )}

              {/***********(New Entry (Row) Button)************/}
              {newEntry && (
                <Button {...(newEntry as ButtonProps)}>
                  {newEntry.label ?? "New Entry"} 
                </Button>
              )}

              {/* Custom user actions */}
              {(customActions as any[]).map((btnProps: any, idx: number) => (
                <Button key={idx} {...btnProps} />
              ))}
              {children}
            </XStack>
          </>
        )}
      </XStack>
    </>
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
    <>
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
    </>
  );
}
