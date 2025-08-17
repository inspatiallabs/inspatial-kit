import { YStack, XStack, Stack, ScrollView } from "@inspatial/kit/structure";
import { AuthLayout } from "./(auth)/layout.tsx";
import { AppMenu } from "./menu.tsx";
import { Text } from "@inspatial/kit/typography";
import { Button } from "@inspatial/kit/ornament";
import { GoogleIcon } from "@inspatial/kit/icon";

export function AppWindow() {
  return (
    <>
      <YStack className="overflow-hidden h-screen w-screen">
        <AppMenu />
        <AuthLayout>
          <YStack className="w-full h-full items-center justify-center px-24">
            {/**Button**/}
            <Button
              format="outlineSurface"
              size="xl"
              className="gap-x-2 w-full"
            >
              <GoogleIcon />
              Continue With Google
            </Button>

            {/**Divider**/}

            {/**Input**/}

            {/**Button**/}
            <Button size="xl" className="w-full">
              Continue to InSpatial
            </Button>
          </YStack>
        </AuthLayout>
      </YStack>
    </>
  );
}
