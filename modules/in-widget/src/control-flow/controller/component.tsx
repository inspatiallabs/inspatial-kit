// deno-lint-ignore-file jsx-no-children-prop
import { Button, Tab } from "@in/widget/ornament/index.ts";
import { YStack, XStack, Slot } from "@in/widget/structure/index.ts";
import { Text } from "@in/widget/typography/index.ts";
import { List } from "@in/widget/data-flow/list/index.ts";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import { Show } from "@in/widget/control-flow/show/index.ts";
import {
  Switch,
  Checkbox,
  Radio,
  NumberField,
  Counter,
  Slider,
} from "@in/widget/input/index.ts";
import { slugify } from "./helpers.ts";
import type {
  ControllerSettingsProps,
  ControllerSettingItem,
  ControllerProps,
} from "./type.ts";
import { ControllerStyle } from "./style.ts";
import { iss } from "@in/style";
import { $ } from "@in/teract/state";
import { Icon } from "@in/widget/icon";

/*####################################(RENDER CONTROLLER)####################################*/

function renderController<T extends Record<string, any>>(
  ctl?: ControllerSettingsProps<T> | null,
  children?: ControllerProps<T>
): any {
  try {
    /*******************************(Props)********************************/
    const hasReset = children?.hasReset ?? ctl?.hasReset ?? true;
    const slots =
      children && (children as any).children
        ? (children as any).children
        : (children as any);

    const { className, $ref, style, ...rest } = slots?.root || {};
    const {
      className: wrapperClassName,
      style: wrapperStyle,
      $ref: wrapperRef,
      ...wrapperRest
    } = slots?.wrapper || {};
    const {
      className: resetClassName,
      style: resetStyle,
      $ref: resetRef,
      ...resetRest
    } = slots?.reset || {};
    const {
      className: labelClassName,
      style: labelStyle,
      $ref: labelRef,
      ...labelRest
    } = slots?.label || {};
    const {
      className: tabClassName,
      style: tabStyle,
      $ref: tabRef,
      ...tabRest
    } = slots?.tab || {};
    const {
      className: colorClassName,
      style: colorStyle,
      $ref: colorRef,
      ...colorRest
    } = slots?.color || {};
    const {
      className: numberfieldClassName,
      style: numberfieldStyle,
      $ref: numberfieldRef,
      ...numberfieldRest
    } = slots?.numberfield || {};
    const {
      className: counterClassName,
      style: counterStyle,
      $ref: counterRef,
      ...counterRest
    } = slots?.counter || {};
    const {
      className: switchClassName,
      style: switchStyle,
      $ref: switchRef,
      ...switchRest
    } = slots?.switch || {};
    const {
      className: checkboxClassName,
      style: checkboxStyle,
      $ref: checkboxRef,
      ...checkboxRest
    } = slots?.checkbox || {};
    const {
      className: radioClassName,
      style: radioStyle,
      $ref: radioRef,
      ...radioRest
    } = slots?.radio || {};
    const {
      className: sliderClassName,
      style: sliderStyle,
      $ref: sliderRef,
      ...sliderRest
    } = slots?.slider || {};
    const {
      className: notSupportedClassName,
      style: notSupportedStyle,
      $ref: notSupportedRef,
      ...notSupportedRest
    } = slots?.notSupported || {};

    /******************************(Guard)******************************/

    if (!ctl || !ctl.settings || ctl.settings.length === 0) return null;

    const settings = ctl.settings;

    /******************************(Render)******************************/
    return (
      <YStack
        //@ts-ignore
        className={iss(ControllerStyle.root.getStyle({ className }))}
        style={style}
        $ref={$ref}
        {...rest}
      >
        <List each={settings}>
          {(s: ControllerSettingItem<T>) => {
            const path = (s.path || slugify(s.name || "")) as string;
            const reg = ctl.register(path as any);

            return (
              <XStack
                className={iss(
                  //@ts-ignore
                  ControllerStyle.wrapper.getStyle({
                    className: wrapperClassName,
                  })
                )}
                style={wrapperStyle}
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
                    style={labelStyle}
                    $ref={labelRef}
                    {...labelRest}
                  >
                    {s.name}
                  </Text>
                </Show>

                <Show when={$(() => reg.isDirty?.get?.() && hasReset)}>
                  <Button
                    //@ts-ignore
                    className={iss(
                      ControllerStyle.reset.getStyle({
                        className: resetClassName,
                      })
                    )}
                    style={resetStyle}
                    $ref={resetRef}
                    {...resetRest}
                    format="surface"
                    size="sm"
                    on:tap={() => {
                      ctl.set(
                        path as any,
                        (s.initialValue ??
                          (s.field.component === "tab"
                            ? (s.field.options || []).find(
                                (o: any) => !o?.disabled
                              )?.value
                            : s.field.component === "color"
                            ? ""
                            : reg.value?.get?.())) as any,
                        { touch: false, dirty: true }
                      );
                      if (ctl._dirty && ctl._dirty[path as any]) {
                        ctl._dirty[path as any].value = false as any;
                      }
                    }}
                  >
                    <Icon variant="UndoIcon" size="2xs" />
                  </Button>
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
                          style={tabStyle}
                          $ref={tabRef}
                          radius="md"
                          size="sm"
                          children={(s.field.options ?? []) as any}
                          selected={reg.value?.get?.()}
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
                          style={colorStyle}
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
                        <NumberField
                          //@ts-ignore
                          className={iss(
                            ControllerStyle.numberfield.getStyle({
                              className: numberfieldClassName,
                            })
                          )}
                          style={numberfieldStyle}
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
                      when: () => s.field.component === "counter",
                      children: (
                        <Counter
                          //@ts-ignore
                          className={iss(
                            ControllerStyle.counter.getStyle({
                              className: counterClassName,
                            })
                          )}
                          style={counterStyle}
                          $ref={counterRef}
                          value={reg.value?.get?.()}
                          // rateLimit={s.field.props?.rateLimit?.interval ?? 100}
                          format="Number"
                          on:input={(v: any) => reg.oninput(v)}
                          {...(s.field.props || {})}
                          {...counterRest}
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
                          style={switchStyle}
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
                          style={checkboxStyle}
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
                          style={radioStyle}
                          $ref={radioRef}
                          selected={reg.value?.get?.()}
                          on:input={(v: any) => reg.oninput(v)}
                          {...(s.field.props || {})}
                          {...radioRest}
                        />
                      ),
                    },
                    {
                      when: () => s.field.component === "slider",
                      children: (
                        <Slider
                          //@ts-ignore
                          className={iss(
                            ControllerStyle.slider.getStyle({
                              className: sliderClassName,
                            })
                          )}
                          style={sliderStyle}
                          $ref={sliderRef}
                          min={s.field.props?.min}
                          max={s.field.props?.max}
                          step={s.field.props?.step}
                          value={reg.value}
                          format={s.field.props?.format}
                          size={s.field.props?.size}
                          radius={s.field.props?.radius}
                          truncate={s.field.props?.truncate}
                          showValue={s.field.props?.showValue}
                          disabled={s.field.props?.disabled}
                          on:input={(v: number) => reg.oninput(v)}
                          on:blur={() => reg.onblur?.()}
                          {...(s.field.props || {})}
                          {...sliderRest}
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
                      style={notSupportedStyle}
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
  } catch (error) {
    console.error("[InSpatial Controller Component Error]:", error);
    return (
      <YStack>
        <Text style={{ web: { color: "red" } }} size="sm">
          InSpatial Controller Component Error:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </YStack>
    );
  }
}

/*####################################(CONTROLLER)####################################*/
export function Controller(
  as: any,
  children?: ControllerProps<any>["children"]
): any {
  try {
    if (
      arguments.length === 1 &&
      as &&
      typeof as === "object" &&
      ("ctl" in (as as any) || "as" in (as as any) || "children" in (as as any))
    ) {
      const props = as as any;
      const instance = props.ctl ?? props.as ?? null;
      const slots = props.children;
      return renderController(instance, slots);
    }

    return renderController(as, children as any);
  } catch (error) {
    console.error("[InSpatial Controller Component Error]:", error);
    return (
      <YStack>
        <Text style={{ web: { color: "red" } }} size="sm">
          InSpatial Controller Component Error:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </YStack>
    );
  }
}
