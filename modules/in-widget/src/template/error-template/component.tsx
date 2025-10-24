import { Slot, YStack } from "@in/widget/structure";
import type { ErrorTemplateProps } from "./types.ts";
import { createRoute } from "@in/route";
import { Button } from "@in/widget/ornament/index.ts";
import { Text } from "@in/widget/typography/index.ts";
import { Show } from "@in/widget/control-flow";
import { Icon } from "@in/widget/icon";
import { ErrorTemplateStyle } from "./style.ts";

/*########################(ERROR TEMPLATE)########################*/
/**
 * ErrorTemplate - A universal error display component following InSpatial Atomic Design Pattern
 *
 * @example
 * ```tsx
 * // Basic usage with defaults
 * <ErrorTemplate />
 *
 * // Custom header and message
 * <ErrorTemplate
 *   header="Connection Failed"
 *   message="Unable to reach the server"
 * />
 *
 * // With description and custom action
 * <ErrorTemplate
 *   header="Authentication Error"
 *   message="Your session has expired"
 *   description="Please log in again to continue"
 *   actionText="Go to Login"
 *   onAction={() => navigate('/login')}
 * />
 *
 * // Without icon
 * <ErrorTemplate
 *   showIcon={false}
 *   header="Not Found"
 *   message="The page you're looking for doesn't exist"
 * />
 * ```
 */
export function ErrorTemplate(props: ErrorTemplateProps) {
  /**************************(Route)**************************/
  const { current, reload } = createRoute();

  /**************************(Props)**************************/
  const {
    header = "Oh Snap!",
    message = `There was a problem loading ${current}`,
    description = undefined,
    actionText = "Try Again",
    onAction = () => reload(),
    showIcon = true,
    className,
    class: cls,
    style,
    $ref,
  } = props;

  /**************************(Render)**************************/
  return (
    <YStack
      // @ts-ignore
      className={ErrorTemplateStyle.root.getStyle({ className, class: cls })}
      style={style}
      $ref={$ref}
    >
      <YStack className={ErrorTemplateStyle.wrapper.getStyle()}>
        <Text size="lg" className={ErrorTemplateStyle.header.getStyle()}>
          {header}
        </Text>

        <Text size="sm" className={ErrorTemplateStyle.message.getStyle()}>
          {message}
        </Text>

        <Show when={description}>
          <Text size="sm" className={ErrorTemplateStyle.description.getStyle()}>
            {description}
          </Text>
        </Show>

        <Slot className={ErrorTemplateStyle.action.getStyle()}>
          <Button format="underline" size="sm" on:tap={onAction}>
            {actionText}
          </Button>
        </Slot>
      </YStack>

      <Show when={showIcon}>
        <Slot className={ErrorTemplateStyle.footer.getStyle()}>
          <Icon variant="InSpatialIcon" size="sm" />
        </Slot>
      </Show>
    </YStack>
  );
}
