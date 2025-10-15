// deno-lint-ignore-file jsx-no-children-prop
import { Tab } from "@in/widget/ornament/index.ts";
import { YStack, XStack, Slot } from "@in/widget/structure/index.ts";
import { Text } from "@in/widget/typography/index.ts";
import { List } from "@in/widget/data-flow/list/index.ts";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import { Show } from "@in/widget/control-flow/show/index.ts";
import { Switch, Checkbox, Radio } from "@in/widget/input/index.ts";
import { slugify } from "./helpers.ts";
import type {
  ControllerSettingsProps,
  ControllerSettingItem,
  ControllerProps,
} from "./type.ts";
import { ControllerStyle } from "./style.ts";
import { iss } from "@in/style";

/*####################################(CONTROLLER)####################################*/

export function Controller<T extends Record<string, any>>(
  ctl?: ControllerSettingsProps<T> | null,
  children?: ControllerProps<T>
): any {
  /*******************************(Props)********************************/

  const { className, $ref, ...rest } = children?.children?.root || {};
  const {
    className: wrapperClassName,
    $ref: wrapperRef,
    ...wrapperRest
  } = children?.children?.wrapper || {};
  const {
    className: labelClassName,
    $ref: labelRef,
    ...labelRest
  } = children?.children?.label || {};
  const {
    className: tabClassName,
    $ref: tabRef,
    ...tabRest
  } = children?.children?.tab || {};
  const {
    className: colorClassName,
    $ref: colorRef,
    ...colorRest
  } = children?.children?.color || {};
  const {
    className: numberfieldClassName,
    $ref: numberfieldRef,
    ...numberfieldRest
  } = children?.children?.numberfield || {};
  const {
    className: switchClassName,
    $ref: switchRef,
    ...switchRest
  } = children?.children?.switch || {};
  const {
    className: checkboxClassName,
    $ref: checkboxRef,
    ...checkboxRest
  } = children?.children?.checkbox || {};
  const {
    className: radioClassName,
    $ref: radioRef,
    ...radioRest
  } = children?.children?.radio || {};
  const {
    className: notSupportedClassName,
    $ref: notSupportedRef,
    ...notSupportedRest
  } = children?.children?.notSupported || {};

  /******************************(Guard)******************************/

  if (!ctl || !ctl.settings || ctl.settings.length === 0) return null;

  const settings = ctl.settings;

  /******************************(Render)******************************/
  return (
    <YStack
      //@ts-ignore
      className={iss(ControllerStyle.root.getStyle({ className }))}
      $ref={$ref}
      {...rest}
    >
      <List each={settings}>
        {(s: ControllerSettingItem<T>) => {
          const path = (s.path || slugify(s.name)) as string;
          const reg = ctl.register(path as any);

          return (
            <XStack
              className={iss(
                //@ts-ignore
                ControllerStyle.wrapper.getStyle({
                  className: wrapperClassName,
                })
              )}
              $ref={wrapperRef}
              {...wrapperRest}
            >
              <Show when={s.name}>
                <Text
                  size="sm"
                  //@ts-ignore
                  className={iss(
                    //@ts-ignore
                    ControllerStyle.label.getStyle({
                      className: labelClassName,
                    })
                  )}
                  $ref={labelRef}
                  {...labelRest}
                >
                  {s.name}
                </Text>
              </Show>
              <Choose
                cases={[
                  {
                    when: () => s.field.component === "tab",
                    children: (
                      <Tab
                        //@ts-ignore
                        className={iss(
                          ControllerStyle.tab.getStyle({
                            className: tabClassName,
                          })
                        )}
                        $ref={tabRef}
                        radius="md"
                        size="sm"
                        children={(s.field.options || []) as any}
                        defaultSelected={reg.value?.peek?.()}
                        on:input={(v: any) => reg.oninput(v)}
                        {...(s.field.props || {})}
                        {...tabRest}
                      />
                    ),
                  },
                  {
                    when: () => s.field.component === "color",
                    children: (
                      <input
                        //@ts-ignore
                        className={iss(
                          ControllerStyle.color.getStyle({
                            className: colorClassName,
                          })
                        )}
                        $ref={colorRef}
                        type="color"
                        value={reg.value?.get?.()}
                        on:input={(e: any) => reg.oninput(e)}
                        {...(s.field.props || {})}
                        {...colorRest}
                      />
                    ),
                  },
                  {
                    when: () => s.field.component === "numberfield",
                    children: (
                      <input
                        //@ts-ignore
                        className={iss(
                          ControllerStyle.numberfield.getStyle({
                            className: numberfieldClassName,
                          })
                        )}
                        $ref={numberfieldRef}
                        type="number"
                        value={reg.value?.get?.()}
                        on:input={(e: any) => reg.oninput(e)}
                        {...(s.field.props || {})}
                        {...numberfieldRest}
                      />
                    ),
                  },
                  {
                    when: () => s.field.component === "switch",
                    children: (
                      <Switch
                        className={iss(
                          //@ts-ignore
                          ControllerStyle.switch.getStyle({
                            className: switchClassName,
                          })
                        )}
                        $ref={switchRef}
                        selected={reg.value?.get?.()}
                        on:input={(v: any) => reg.oninput(v)}
                        {...(s.field.props || {})}
                        {...switchRest}
                      />
                    ),
                  },
                  {
                    when: () => s.field.component === "checkbox",
                    children: (
                      <Checkbox
                        className={iss(
                          //@ts-ignore
                          ControllerStyle.checkbox.getStyle({
                            className: checkboxClassName,
                          })
                        )}
                        $ref={checkboxRef}
                        selected={reg.value?.get?.()}
                        on:input={(v: any) => reg.oninput(v)}
                        {...(s.field.props || {})}
                        {...checkboxRest}
                      />
                    ),
                  },
                  {
                    when: () => s.field.component === "radio",
                    children: (
                      <Radio
                        //@ts-ignore
                        className={iss(
                          //@ts-ignore
                          ControllerStyle.radio.getStyle({
                            className: radioClassName,
                          })
                        )}
                        $ref={radioRef}
                        selected={reg.value?.get?.()}
                        on:input={(v: any) => reg.oninput(v)}
                        {...(s.field.props || {})}
                        {...radioRest}
                      />
                    ),
                  },
                ]}
                otherwise={
                  <Slot
                    //@ts-ignore
                    className={iss(
                      //@ts-ignore
                      ControllerStyle.notSupported.getStyle({
                        className: notSupportedClassName,
                      })
                    )}
                    $ref={notSupportedRef}
                    {...notSupportedRest}
                  >
                    Not Supported
                  </Slot>
                }
              />
            </XStack>
          );
        }}
      </List>
    </YStack>
  );
}
